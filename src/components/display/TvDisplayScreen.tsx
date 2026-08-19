import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Sparkles, HeartPulse, Clock, Calendar } from 'lucide-react';
import type { QueueItem, Service } from '../../types/queue';

interface TvDisplayScreenProps {
  services: Service[];
  queues: QueueItem[];
  lastAnnouncement: { queueNumber: string; serviceName: string; time: Date } | null;
}

export const TvDisplayScreen: React.FC<TvDisplayScreenProps> = ({
  services,
  queues,
  lastAnnouncement,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 px-8 py-5 border-b border-teal-900/60 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-teal-950 shadow-lg shadow-teal-500/20">
            <HeartPulse className="w-8 h-8 text-teal-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>KLINIK SEHAT</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-800 text-teal-200 uppercase tracking-wider">
                Live Display
              </span>
            </h1>
            <p className="text-xs text-teal-300/80 font-medium">
              Sistem Pemanggilan Nomor Antrian Ruang Tunggu
            </p>
          </div>
        </div>

        {/* Center Flash Announcement Banner */}
        {lastAnnouncement && (
          <div className="hidden lg:flex items-center gap-3 bg-teal-900/80 border border-teal-500/40 px-6 py-2.5 rounded-2xl animate-pulse">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-teal-300">Panggilan Terakhir</span>
              <p className="text-sm font-black text-white">
                {lastAnnouncement.queueNumber} — {lastAnnouncement.serviceName}
              </p>
            </div>
          </div>
        )}

        {/* Right Date, Clock & Screen Controls */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-xs font-semibold text-teal-300/90">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {time.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2 text-3xl font-black text-white font-mono tracking-wider">
              <Clock className="w-5 h-5 text-teal-400" />
              <span>{time.toLocaleTimeString('id-ID')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              title={isAudioEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isAudioEnabled
                  ? 'bg-teal-800 border-teal-600 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title="Layar Penuh (Fullscreen)"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all cursor-pointer"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Poli Columns */}
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {services.map((service) => {
          const serviceQueues = queues.filter((q) => q.service_code === service.code);
          const currentCall = serviceQueues.find((q) => q.status === 'calling' || q.status === 'serving');
          const waitingList = serviceQueues
            .filter((q) => q.status === 'waiting')
            .sort((a, b) => a.sequence_number - b.sequence_number);

          return (
            <div
              key={service.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative"
            >
              {/* Header Card Poli */}
              <div className="bg-gradient-to-r from-teal-900 to-teal-950 p-6 border-b border-teal-800/60 text-center">
                <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                  {service.name}
                </h2>
                <span className="inline-block mt-1 text-xs font-bold text-teal-300 bg-teal-950/80 px-4 py-1 rounded-full border border-teal-700/50">
                  {service.room_name}
                </span>
              </div>

              {/* Big Currently Calling Box */}
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center my-auto">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">
                  Nomor Sedang Dipanggil
                </span>

                <div
                  className={`w-full py-8 px-4 rounded-3xl border transition-all ${
                    currentCall
                      ? 'bg-gradient-to-b from-teal-950/80 to-slate-950 border-teal-500/50 shadow-2xl calling-pulse'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  <h3 className="text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-md">
                    {currentCall ? currentCall.queue_number : '—'}
                  </h3>
                  <p className="text-sm font-semibold text-teal-200/90 mt-2">
                    {currentCall ? `Pasien: ${currentCall.patient_name}` : 'Menunggu Panggilan'}
                  </p>
                </div>
              </div>

              {/* Next Waiting Queues List */}
              <div className="bg-slate-950/80 p-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-3">
                  <span>Antrian Selanjutnya</span>
                  <span className="text-teal-400">{waitingList.length} Menunggu</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {waitingList.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center"
                    >
                      <span className="text-base font-black text-teal-300 block">
                        {item.queue_number}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {item.patient_name}
                      </span>
                    </div>
                  ))}

                  {waitingList.length === 0 && (
                    <div className="col-span-3 py-3 text-center text-slate-500 text-xs">
                      Tidak ada antrean menunggu
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom Running Text Marquee */}
      <footer className="bg-teal-950 border-t border-teal-900/60 px-6 py-3 flex items-center gap-4 text-xs font-semibold text-teal-200">
        <div className="flex items-center gap-1.5 shrink-0 bg-teal-800/80 text-white px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pengumuman</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee">
            Selamat datang di <strong>Klinik Sehat</strong> • Harap menyiapkan kartu identitas (KTP / BPJS) saat nomor Anda dipanggil • Pasien dapat memantau posisi antrean secara realtime melalui smartphone • Jagalah ketertiban dan kebersihan bersama.
          </div>
        </div>
      </footer>
    </div>
  );
};
