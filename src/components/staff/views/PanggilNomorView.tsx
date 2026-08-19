import React, { useState } from 'react';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  SkipForward,
  Search,
  Filter,
} from 'lucide-react';
import type { QueueItem, Service, QueueStatus } from '../../../types/queue';

interface PanggilNomorViewProps {
  services: Service[];
  queues: QueueItem[];
  selectedServiceCode: string;
  onSelectServiceCode: (code: string) => void;
  onCallNext: () => Promise<void>;
  onRecall: (queueId: string) => void;
  onUpdateStatus: (queueId: string, status: QueueStatus) => void;
  isCallingLoading: boolean;
}

export const PanggilNomorView: React.FC<PanggilNomorViewProps> = ({
  services,
  queues,
  selectedServiceCode,
  onSelectServiceCode,
  onCallNext,
  onRecall,
  onUpdateStatus,
  isCallingLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeService: Service =
    services.find((s: Service) => s.code === selectedServiceCode) || services[0];

  const poliQueues: QueueItem[] = queues.filter(
    (q: QueueItem) => q.service_code === selectedServiceCode
  );

  const currentlyServing: QueueItem | undefined = poliQueues.find(
    (q: QueueItem) => q.status === 'calling' || q.status === 'serving'
  );

  const nextQueues: QueueItem[] = poliQueues
    .filter((q: QueueItem) => q.status === 'waiting')
    .sort((a: QueueItem, b: QueueItem) => a.sequence_number - b.sequence_number);

  const filteredTableQueues: QueueItem[] = poliQueues.filter((item: QueueItem) => {
    const matchSearch =
      item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.queue_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'completed':
        return <span className="text-blue-600 font-semibold">Selesai</span>;
      case 'calling':
        return <span className="text-amber-500 font-bold animate-pulse">Dipanggil</span>;
      case 'serving':
        return <span className="text-emerald-600 font-bold">Sedang Dilayani</span>;
      case 'skipped':
        return <span className="text-rose-500 font-semibold">Dilewati</span>;
      default:
        return <span className="text-slate-500 font-medium">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Unit Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0a3854] tracking-tight">
            {activeService.name} - {activeService.room_name}
          </h2>
          <p className="text-xs text-slate-500">
            Meja pemanggilan nomor antrean aktif untuk dokter & petugas klinik
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          {services.map((service: Service) => (
            <button
              key={service.code}
              onClick={() => onSelectServiceCode(service.code)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedServiceCode === service.code
                  ? 'bg-[#0a3854] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <span>
                {service.name} - {service.room_name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: KARTU SEDANG DILAYANI & ANTRIAN SELANJUTNYA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Kartu Sedang Dilayani (Kiri - 2 Kolom) */}
        <div className="lg:col-span-2 bg-[#e6f4f2] border border-teal-200/80 rounded-3xl p-8 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sedang Dilayani
            </span>
            <span className="text-xs font-semibold text-teal-800 bg-white/70 px-3 py-1 rounded-full">
              {activeService.room_name}
            </span>
          </div>

          <div className="py-6 text-center">
            <h1 className="text-8xl font-black tracking-tight text-[#0a3854] leading-none my-2 drop-shadow-xs">
              {currentlyServing ? currentlyServing.queue_number : '—'}
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-2">
              {currentlyServing ? (
                <>
                  Pasien: <strong className="text-teal-900 font-bold">{currentlyServing.patient_name}</strong>
                </>
              ) : (
                'Belum ada antrean yang dipanggil'
              )}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-teal-200/60">
            <button
              onClick={onCallNext}
              disabled={isCallingLoading || nextQueues.length === 0}
              className="w-full py-4 bg-[#1f9d55] hover:bg-[#178546] active:scale-[0.99] text-white font-extrabold text-base uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>
                {isCallingLoading ? 'Memanggil...' : 'PANGGIL BERIKUTNYA'}
              </span>
            </button>

            {currentlyServing && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onRecall(currentlyServing.id)}
                  className="py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
                  <span>Panggil Ulang</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(currentlyServing.id, 'completed')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai</span>
                </button>

                <button
                  onClick={() => onUpdateStatus(currentlyServing.id, 'skipped')}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-rose-200"
                >
                  <SkipForward className="w-3.5 h-3.5 text-rose-600" />
                  <span>Lewati</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kartu Antrian Selanjutnya (Kanan) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Antrian Selanjutnya
              </h4>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                {nextQueues.length} Menunggu
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
              {nextQueues.map((item: QueueItem) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200/70 rounded-2xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-[#0a3854]">
                      {item.queue_number}
                    </span>
                    <span className="text-xs text-slate-600 font-medium truncate max-w-[120px]">
                      {item.patient_name}
                    </span>
                  </div>
                  <button
                    onClick={() => onRecall(item.id)}
                    title="Panggil langsung"
                    className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {nextQueues.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 opacity-60" />
                  <p>Tidak ada antrean menunggu untuk poli ini.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Antrean Poli Ini:</span>
            <span className="font-bold text-slate-800">{poliQueues.length} Pasien</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: TABEL DAFTAR ANTRIAN LENGKAP */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#0a3854]">
              Daftar Antrian
            </h3>
            <p className="text-xs text-slate-400">
              Data antrean pasien secara realtime untuk {activeService.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nomor / nama pasien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white w-56"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="waiting">Menunggu</option>
                <option value="calling">Dipanggil</option>
                <option value="completed">Selesai</option>
                <option value="skipped">Dilewati</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-4 w-16">No.</th>
                <th className="pb-3 px-4">Nomor</th>
                <th className="pb-3 px-4">Nama Pasien</th>
                <th className="pb-3 px-4">Waktu Ambil</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTableQueues.map((item: QueueItem, index: number) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-semibold">{index + 1}</td>
                  <td className="py-3.5 px-4 font-black text-[#0a3854] text-sm">
                    {item.queue_number}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-bold">
                    {item.patient_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {new Date(item.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onRecall(item.id)}
                        title="Panggil Suara"
                        className="p-1.5 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      {item.status !== 'completed' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'completed')}
                          title="Tandai Selesai"
                          className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTableQueues.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada data antrean yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
