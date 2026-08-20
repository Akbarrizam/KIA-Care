import { useState, useEffect, useCallback } from 'react';
import type { QueueItem, Service, PatientTicket, QueueStatus } from '../types/queue';
import { INITIAL_SERVICES, INITIAL_QUEUES } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { speechCaller } from '../lib/speechHelper';

const STORAGE_KEY_QUEUES = 'klinik_sehat_queues_v2_clean';
const STORAGE_KEY_SERVICES = 'klinik_sehat_services_v2';
const STORAGE_KEY_MY_TICKET = 'klinik_sehat_my_ticket_v2';

export function useQueueManager() {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [queues, setQueues] = useState<QueueItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QUEUES);
    return saved ? JSON.parse(saved) : INITIAL_QUEUES;
  });

  const [myTicket, setMyTicket] = useState<PatientTicket | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MY_TICKET);
    return saved ? JSON.parse(saved) : null;
  });

  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [lastAnnouncement, setLastAnnouncement] = useState<{ queueNumber: string; serviceName: string; time: Date } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUEUES, JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    if (myTicket) {
      localStorage.setItem(STORAGE_KEY_MY_TICKET, JSON.stringify(myTicket));
    } else {
      localStorage.removeItem(STORAGE_KEY_MY_TICKET);
    }
  }, [myTicket]);

  // Otomatis hilangkan tiket aktif jika antrean dilewati atau dibatalkan oleh petugas loket
  useEffect(() => {
    if (!myTicket) return;
    const matchingQueue = queues.find(
      (q) => q.id === myTicket.queueId || q.queue_number === myTicket.queueNumber
    );

    if (
      matchingQueue &&
      (matchingQueue.status === 'skipped' || matchingQueue.status === 'cancelled')
    ) {
      setMyTicket(null);
      localStorage.removeItem(STORAGE_KEY_MY_TICKET);
    }
  }, [queues, myTicket]);

  // BroadcastChannel untuk sinkronisasi antar-tab pada perangkat yang sama
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('klinik_sehat_realtime_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_QUEUES') {
          setQueues(payload);
        } else if (type === 'ANNOUNCE_AUDIO') {
          const { queueNumber, serviceName, roomName } = payload;
          speechCaller.announceQueue(queueNumber, serviceName, roomName);
          setLastAnnouncement({ queueNumber, serviceName, time: new Date() });
        }
      };
    } catch {
      // Ignore if not supported
    }

    return () => {
      channel?.close();
    };
  }, []);

  const broadcastQueues = useCallback((updatedQueues: QueueItem[]) => {
    setQueues(updatedQueues);
    try {
      const channel = new BroadcastChannel('klinik_sehat_realtime_sync');
      channel.postMessage({ type: 'SYNC_QUEUES', payload: updatedQueues });
      channel.close();
    } catch {
      // Fallback
    }
  }, []);

  const broadcastAnnouncement = useCallback((queueNumber: string, serviceName: string, roomName: string) => {
    speechCaller.announceQueue(queueNumber, serviceName, roomName);
    setLastAnnouncement({ queueNumber, serviceName, time: new Date() });
    try {
      const channel = new BroadcastChannel('klinik_sehat_realtime_sync');
      channel.postMessage({
        type: 'ANNOUNCE_AUDIO',
        payload: { queueNumber, serviceName, roomName },
      });
      channel.close();
    } catch {
      // Fallback
    }
  }, []);

  // Sinkronisasi Supabase (Realtime Subscription + Polling Fallback)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLiveConnected(true);
      return;
    }

    const fetchSupabaseData = async () => {
      try {
        const { data: srvData } = await supabase.from('services').select('*').order('code');
        if (srvData && srvData.length > 0) {
          setServices(srvData);
        }

        const { data: qData, error: qError } = await supabase
          .from('queues')
          .select('*')
          .order('sequence_number', { ascending: true });
        
        if (!qError && qData) {
          setQueues(qData);
        }
        setIsLiveConnected(true);
      } catch (err) {
        console.warn('Supabase fetch error:', err);
      }
    };

    fetchSupabaseData();

    // Supabase Realtime Channel
    const channel = supabase
      .channel('supabase_realtime_queues')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queues' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as QueueItem;
            setQueues((prev) => {
              const exists = prev.some((item) => item.id === newItem.id);
              return exists ? prev : [...prev, newItem];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as QueueItem;
            setQueues((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
            if (updated.status === 'calling') {
              const srv = services.find((s) => s.code === updated.service_code);
              if (srv) {
                broadcastAnnouncement(updated.queue_number, srv.name, srv.room_name);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            setQueues((prev) => prev.filter((q) => q.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Backup polling setiap 3 detik untuk menjamin sinkronisasi HP & Laptop
    const pollInterval = setInterval(() => {
      fetchSupabaseData();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [broadcastAnnouncement, services]);

  const takeQueue = async (
    serviceCode: string,
    patientName: string,
    patientNik?: string,
    patientPhone?: string
  ): Promise<PatientTicket> => {
    const service = services.find((s) => s.code === serviceCode) || services[0];
    
    const existingPoliQueues = queues.filter((q) => q.service_code === serviceCode);
    const maxSeq = existingPoliQueues.reduce((max, q) => Math.max(max, q.sequence_number || 0), 0);
    const nextSeq = maxSeq + 1;
    const queueNumber = `${serviceCode}-${String(nextSeq).padStart(3, '0')}`;

    let generatedId = 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    // 1. Simpan ke Supabase jika terhubung
    if (isSupabaseConfigured) {
      try {
        const payloadToInsert = {
          service_code: serviceCode,
          queue_number: queueNumber,
          sequence_number: nextSeq,
          patient_name: patientName.trim() || 'Pasien Mandiri',
          patient_nik: patientNik || null,
          patient_phone: patientPhone || null,
          status: 'waiting',
        };

        const { data, error } = await supabase
          .from('queues')
          .insert([payloadToInsert])
          .select()
          .single();

        if (!error && data) {
          generatedId = data.id;
        } else if (error) {
          console.error('Supabase Insert Error:', error.message);
        }
      } catch (err) {
        console.warn('Failed insert to Supabase, fallback to local:', err);
      }
    }

    const newQueueItem: QueueItem = {
      id: generatedId,
      service_code: serviceCode,
      queue_number: queueNumber,
      sequence_number: nextSeq,
      patient_name: patientName.trim() || 'Pasien Mandiri',
      patient_nik: patientNik,
      patient_phone: patientPhone,
      status: 'waiting',
      created_at: new Date().toISOString(),
    };

    const updated = [...queues, newQueueItem];
    broadcastQueues(updated);

    const ticket: PatientTicket = {
      queueId: newQueueItem.id,
      queueNumber: newQueueItem.queue_number,
      serviceCode: service.code,
      serviceName: service.name,
      roomName: service.room_name,
      patientName: newQueueItem.patient_name,
      patientNik: newQueueItem.patient_nik,
      createdAt: newQueueItem.created_at,
    };

    setMyTicket(ticket);
    return ticket;
  };

  const callNextQueue = async (serviceCode: string) => {
    const waitingList = queues
      .filter((q) => q.service_code === serviceCode && q.status === 'waiting')
      .sort((a, b) => a.sequence_number - b.sequence_number);

    if (waitingList.length === 0) {
      return null;
    }

    const targetQueue = waitingList[0];
    const service = services.find((s) => s.code === serviceCode);

    const updated = queues.map((q) => {
      if (q.service_code === serviceCode && q.status === 'calling') {
        return { ...q, status: 'completed' as QueueStatus, completed_at: new Date().toISOString() };
      }
      if (q.id === targetQueue.id) {
        return { ...q, status: 'calling' as QueueStatus, called_at: new Date().toISOString() };
      }
      return q;
    });

    broadcastQueues(updated);

    if (service) {
      broadcastAnnouncement(targetQueue.queue_number, service.name, service.room_name);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('queues')
          .update({ status: 'calling', called_at: new Date().toISOString() })
          .eq('id', targetQueue.id);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }

    return targetQueue;
  };

  const recallQueue = (queueId: string) => {
    const target = queues.find((q) => q.id === queueId);
    if (!target) return;
    const service = services.find((s) => s.code === target.service_code);
    if (service) {
      broadcastAnnouncement(target.queue_number, service.name, service.room_name);
    }
  };

  const updateQueueStatus = async (queueId: string, status: QueueStatus) => {
    const updated = queues.map((q) => {
      if (q.id === queueId) {
        return {
          ...q,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : q.completed_at,
          serving_at: status === 'serving' ? new Date().toISOString() : q.serving_at,
        };
      }
      return q;
    });

    broadcastQueues(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('queues').update({ status }).eq('id', queueId);
      } catch (e) {
        console.warn('Supabase update error:', e);
      }
    }
  };

  const submitRating = async (queueId: string, rating: number, feedback?: string) => {
    const now = new Date().toISOString();
    const updated = queues.map((q) => {
      if (q.id === queueId) {
        return {
          ...q,
          rating,
          feedback: feedback?.trim() || null,
          rating_submitted_at: now,
        };
      }
      return q;
    });

    broadcastQueues(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('queues')
          .update({
            rating,
            feedback: feedback?.trim() || null,
            rating_submitted_at: now,
          })
          .eq('id', queueId);
      } catch (e) {
        console.warn('Supabase rating update error:', e);
      }
    }
  };

  const resetAllData = async () => {
    localStorage.removeItem(STORAGE_KEY_QUEUES);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_MY_TICKET);
    setServices(INITIAL_SERVICES);
    setQueues(INITIAL_QUEUES);
    setMyTicket(null);
    broadcastQueues(INITIAL_QUEUES);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('queues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase reset error:', e);
      }
    }
  };

  const clearMyTicket = () => {
    setMyTicket(null);
    localStorage.removeItem(STORAGE_KEY_MY_TICKET);
  };

  return {
    services,
    queues,
    myTicket,
    isLiveConnected,
    lastAnnouncement,
    takeQueue,
    callNextQueue,
    recallQueue,
    updateQueueStatus,
    submitRating,
    resetAllData,
    clearMyTicket,
    setMyTicket,
  };
}
