import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Clock, Users, BellRing, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import type { QueueItem, PatientTicket, Service } from '../../types/queue';

interface LiveStatusScreenProps {
  myTicket: PatientTicket | null;
  queues: QueueItem[];
  services: Service[];
  onBack: () => void;
  onTakeNewTicket: () => void;
  onCancelTicket: () => void;
}

export const LiveStatusScreen: React.FC<LiveStatusScreenProps> = ({
  myTicket,
  queues,
  services,
  onBack,
  onTakeNewTicket,
  onCancelTicket,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userQueue = myTicket ? queues.find((q) => q.id === myTicket.queueId || q.queue_number === myTicket.queueNumber) : null;
  const serviceCode = myTicket?.serviceCode || 'A';
  const service = services.find((s) => s.code === serviceCode);

  const currentlyCalling = queues.find(
    (q) => q.service_code === serviceCode && (q.status === 'calling' || q.status === 'serving')
  );

  const userSeq = userQueue?.sequence_number || 0;
  const waitingBeforeUser = queues.filter(
    (q) =>
      q.service_code === serviceCode &&
      q.status === 'waiting' &&
      q.sequence_number < userSeq
  ).length;

  const isMyTurnNow = userQueue?.status === 'calling' || userQueue?.status === 'serving';
  const isCompleted = userQueue?.status === 'completed';

  const estMinutesPerPerson = service?.estimated_wait_minutes || 10;
  const totalEstWaitMin = Math.max(5, waitingBeforeUser * estMinutesPerPerson);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  if (!myTicket) {
    return (
      <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
          <button onClick={onBack} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
            Status Antrian
          </span>
          <div className="w-8" />
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-200 text-slate-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 mb-1">
            Belum Ada Nomor Antrian Aktif
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-6">
            Anda belum mengambil nomor antrian pada hari ini. Silakan pilih poli dan ambil tiket antrean.
          </p>
          <button
            onClick={onTakeNewTicket}
            className="py-3 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ambil Nomor Antrian Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
      {/* Top App Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Status Antrian
        </span>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Banner Pemanggilan Aktif */}
        {isMyTurnNow && (
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg animate-bounce flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/20">
              <BellRing className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wide">
                Giliran Anda Tiba!
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Silakan segera menuju ke <strong>{myTicket.serviceName} ({myTicket.roomName})</strong>.
              </p>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 bg-slate-800 text-white rounded-2xl shadow-md flex items-center gap-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="font-bold text-sm">Pelayanan Selesai</h4>
              <p className="text-xs text-slate-300">
                Terima kasih telah berkunjung ke Klinik Sehat.
              </p>
            </div>
          </div>
        )}

        {/* 1. NOMOR ANDA Card */}
        <div className="bg-gradient-to-b from-teal-700 via-teal-800 to-teal-900 rounded-3xl p-6 text-white text-center shadow-xl shadow-teal-900/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
            Nomor Anda
          </span>
          <h1 className="text-5xl font-black tracking-tight text-white my-1">
            {myTicket.queueNumber}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs font-semibold px-3 py-1 bg-white/15 rounded-full text-teal-100 backdrop-blur-xs">
              {myTicket.serviceName} • {myTicket.roomName}
            </span>
          </div>
        </div>

        {/* 2. SEDANG DILAYANI Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Sedang Dilayani
          </span>
          <h2 className="text-4xl font-black tracking-tight text-amber-500 my-1">
            {currentlyCalling ? currentlyCalling.queue_number : '—'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {currentlyCalling ? `Pasien: ${currentlyCalling.patient_name}` : 'Belum ada panggilan aktif'}
          </p>
        </div>

        {/* 3. SISA ANTRIAN & ESTIMASI WAKTU Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sisa Antrian
            </span>
            <span className="text-xl font-black text-slate-800 mt-0.5">
              {isCompleted ? '0' : isMyTurnNow ? '0' : `${waitingBeforeUser} orang`}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Tunggu
            </span>
            <span className="text-xl font-black text-slate-800 mt-0.5">
              {isCompleted ? '0 mnt' : isMyTurnNow ? 'Sekarang' : `${totalEstWaitMin - 5} - ${totalEstWaitMin} mnt`}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button
            onClick={handleRefresh}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-teal-900 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>

          {isCompleted && (
            <button
              onClick={onCancelTicket}
              className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Selesaikan & Ambil Tiket Lain
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
