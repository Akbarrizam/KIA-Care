import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  Megaphone,
  TrendingUp,
  Stethoscope,
  Smile,
  Pill,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import type { QueueItem, Service } from '../../../types/queue';

interface BerandaViewProps {
  services: Service[];
  queues: QueueItem[];
  onNavigateMenu: (menu: string) => void;
  onOpenWalkInModal: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  services,
  queues,
  onNavigateMenu,
  onOpenWalkInModal,
}) => {
  const totalToday = queues.length;
  const waitingCount = queues.filter((q) => q.status === 'waiting').length;
  const servingCount = queues.filter((q) => q.status === 'calling' || q.status === 'serving').length;
  const completedCount = queues.filter((q) => q.status === 'completed').length;

  const getServiceIcon = (code: string) => {
    switch (code) {
      case 'A':
        return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'B':
        return <Smile className="w-5 h-5 text-blue-600" />;
      case 'F':
      default:
        return <Pill className="w-5 h-5 text-purple-600" />;
    }
  };

  const getServiceBg = (code: string) => {
    switch (code) {
      case 'A':
        return 'bg-teal-50 border-teal-200';
      case 'B':
        return 'bg-blue-50 border-blue-200';
      case 'F':
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3854] tracking-tight">
            Ringkasan Operasional Klinik
          </h2>
          <p className="text-xs text-slate-500">
            Monitoring aktivitas pelayanan pasien dan status antrean hari ini
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWalkInModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#188c84] hover:bg-[#13746d] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pasien Baru</span>
          </button>
          <button
            onClick={() => onNavigateMenu('panggil')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a3854] hover:bg-[#082d44] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Megaphone className="w-4 h-4" />
            <span>Buka Meja Panggilan</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Pasien Hari Ini
            </span>
            <h3 className="text-3xl font-black text-[#0a3854] mt-1">
              {totalToday} <span className="text-xs font-semibold text-slate-400">Pasien</span>
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14% dibanding kemarin</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sedang Menunggu
            </span>
            <h3 className="text-3xl font-black text-amber-500 mt-1">
              {waitingCount} <span className="text-xs font-semibold text-slate-400">Antrean</span>
            </h3>
            <span className="inline-block text-[11px] text-slate-400 mt-2">
              Dalam ruang tunggu
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sedang Dilayani
            </span>
            <h3 className="text-3xl font-black text-teal-700 mt-1">
              {servingCount} <span className="text-xs font-semibold text-slate-400">Poli Aktif</span>
            </h3>
            <span className="inline-block text-[11px] text-teal-600 font-semibold mt-2">
              Sedang diperiksa dokter
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Selesai Pelayanan
            </span>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">
              {completedCount} <span className="text-xs font-semibold text-slate-400">Pasien</span>
            </h3>
            <span className="inline-block text-[11px] text-emerald-600 font-semibold mt-2">
              Pelayanan rampung
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Status per Poli & Aktivitas Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#0a3854] uppercase tracking-wide">
                Status Antrean Tiap Poli
              </h3>
              <p className="text-xs text-slate-400">
                Pembaruan kondisi antrean secara langsung di tiap unit
              </p>
            </div>
            <button
              onClick={() => onNavigateMenu('panggil')}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Meja Panggil</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => {
              const serviceQueues = queues.filter((q) => q.service_code === service.code);
              const currentCall = serviceQueues.find((q) => q.status === 'calling' || q.status === 'serving');
              const waiting = serviceQueues.filter((q) => q.status === 'waiting').length;

              return (
                <div
                  key={service.code}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${getServiceBg(service.code)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-white shadow-xs">
                      {getServiceIcon(service.code)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {service.room_name}
                    </span>
                  </div>

                  <div className="my-3">
                    <h4 className="font-extrabold text-xs text-slate-900">
                      {service.name}
                    </h4>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0a3854]">
                        {currentCall ? currentCall.queue_number : '—'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        (Aktif)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">Menunggu:</span>
                    <span className="font-bold text-slate-900">{waiting} Pasien</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-extrabold text-xs text-[#0a3854] uppercase tracking-wider">
              Antrean Masuk Terbaru
            </h3>
            <button
              onClick={() => onNavigateMenu('antrian')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[300px] flex-1">
            {queues.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-500">Belum ada pasien hari ini</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mulai dengan menambah pasien loket</p>
              </div>
            ) : (
              queues.slice(-5).reverse().map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#0a3854]">
                        {item.queue_number}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({item.service_code === 'A' ? 'Umum' : item.service_code === 'B' ? 'Gigi' : 'Farmasi'})
                      </span>
                    </div>
                    <span className="text-slate-700 font-semibold block mt-0.5">
                      {item.patient_name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(item.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
