import React, { useEffect } from 'react';
import { ArrowLeft, Check, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PatientTicket } from '../../types/queue';

interface TicketScreenProps {
  ticket: PatientTicket;
  onBack: () => void;
  onGoToLiveStatus: () => void;
}

export const TicketScreen: React.FC<TicketScreenProps> = ({
  ticket,
  onBack,
  onGoToLiveStatus,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d7a75', '#10b981', '#14b8a6', '#f59e0b'],
      });
    } catch {
      // Fallback
    }
  }, []);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveTicket = () => {
    alert('Tiket antrean ' + ticket.queueNumber + ' berhasil disimpan di memori perangkat Anda!');
  };

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
      {/* Top Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Nomor Antrian
        </span>
        <div className="w-8" />
      </div>

      <div className="p-4 flex-1 flex flex-col items-center justify-between">
        {/* Ticket Digital Card */}
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg relative overflow-hidden text-center my-auto">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-700 via-teal-500 to-emerald-400" />

          {/* Success Check Icon */}
          <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center mb-3 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Nomor Anda
          </span>

          {/* Huge Queue Number */}
          <h2 className="text-5xl font-black tracking-tight text-teal-800 my-2">
            {ticket.queueNumber}
          </h2>

          <p className="text-xs font-medium text-slate-500 mb-6">
            Nama Pasien: <strong className="text-slate-800">{ticket.patientName}</strong>
          </p>

          {/* Ticket Information Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 divide-y divide-slate-200/80 text-left text-xs mb-4">
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Poli</span>
              <span className="font-bold text-slate-800">{ticket.serviceName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Ruang</span>
              <span className="font-bold text-slate-800">{ticket.roomName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-bold text-slate-800">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Waktu Ambil</span>
              <span className="font-bold text-slate-800">{formatTime(ticket.createdAt)} WIB</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Simpan nomor antrian ini atau tunjukkan ke petugas</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-4">
          <button
            onClick={handleSaveTicket}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Simpan Nomor</span>
          </button>

          <button
            onClick={onGoToLiveStatus}
            className="w-full py-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-teal-800 border border-teal-700 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Pantau Status Antrian</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
