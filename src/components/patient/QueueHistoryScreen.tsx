import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import type { QueueItem, Service } from '../../types/queue';

interface QueueHistoryScreenProps {
  queues: QueueItem[];
  services: Service[];
  onBack: () => void;
}

export const QueueHistoryScreen: React.FC<QueueHistoryScreenProps> = ({
  queues,
  services,
  onBack,
}) => {
  const getServiceName = (code: string) => {
    const s = services.find((srv) => srv.code === code);
    return s ? `${s.name} (${s.room_name})` : code;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      case 'calling':
      case 'serving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3" /> Dipanggil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Riwayat Antrian
        </span>
        <div className="w-8" />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Hari Ini
          </span>
          <span>{queues.length} Total Antrian</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {queues.slice().reverse().map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-teal-800">
                    {item.queue_number}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <h5 className="font-semibold text-xs text-slate-800 mt-1">
                  {item.patient_name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {getServiceName(item.service_code)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(item.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {queues.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs my-auto">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Belum ada riwayat antrean.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
