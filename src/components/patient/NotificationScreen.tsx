import React from 'react';
import { HeartPulse, ArrowLeft, ArrowUp } from 'lucide-react';
import type { PatientTicket } from '../../types/queue';

interface NotificationScreenProps {
  ticket: PatientTicket | null;
  onBack: () => void;
  onOpenApp: () => void;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  ticket,
  onBack,
  onOpenApp,
}) => {
  const queueNumber = ticket ? ticket.queueNumber : 'A-025';
  const serviceName = ticket ? ticket.serviceName : 'Poli Umum';
  const roomName = ticket ? ticket.roomName : 'Ruang 1';

  return (
    <div className="relative flex flex-col justify-between min-h-[640px] h-full bg-gradient-to-b from-teal-900 via-emerald-950 to-slate-950 text-white p-6 select-none overflow-hidden">
      {/* Back button for preview */}
      <div className="flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/50">
          Simulasi Notifikasi HP
        </span>
        <div className="w-8" />
      </div>

      {/* Lockscreen Time & Date */}
      <div className="text-center my-auto flex flex-col items-center z-10">
        <div className="w-5 h-5 mb-2 text-teal-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-6xl font-light tracking-tight text-white/95">
          09:45
        </h1>
        <p className="text-xs text-teal-200/80 font-medium mt-1">
          Minggu, 18 Mei 2025
        </p>

        {/* Push Notification Card */}
        <div className="w-full max-w-sm mt-8 bg-white/15 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-left shadow-2xl transition-all animate-bounce [animation-duration:3s]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-teal-500 flex items-center justify-center text-white">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-teal-100">Klinik Sehat</span>
            </div>
            <span className="text-[10px] text-teal-200/60">sekarang</span>
          </div>

          <h4 className="text-xs font-bold text-white mb-1">
            Nomor Anda akan dipanggil
          </h4>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Nomor <strong className="text-white underline">{queueNumber}</strong> akan segera dipanggil. Silakan menuju ke <strong>{serviceName} ({roomName})</strong>. Terima kasih.
          </p>
        </div>
      </div>

      {/* Slide / Click to open */}
      <div className="text-center z-10 flex flex-col items-center gap-2">
        <button
          onClick={onOpenApp}
          className="flex items-center gap-2 text-xs text-teal-200 hover:text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-md cursor-pointer transition-all"
        >
          <ArrowUp className="w-4 h-4 animate-bounce" />
          <span>Buka Aplikasi Klinik</span>
        </button>
        <span className="text-[10px] text-teal-400/60">Ketuk untuk kembali memantau status antrean</span>
      </div>
    </div>
  );
};
