import React, { useState } from 'react';
import {
  Search,
  Filter,
  Volume2,
  CheckCircle2,
  SkipForward,
  Plus,
  Stethoscope,
  Smile,
  Pill,
  Clock,
} from 'lucide-react';
import type { QueueItem, Service, QueueStatus } from '../../../types/queue';

interface DaftarAntrianViewProps {
  services: Service[];
  queues: QueueItem[];
  onRecall: (queueId: string) => void;
  onUpdateStatus: (queueId: string, status: QueueStatus) => void;
  onOpenWalkInModal: () => void;
}

export const DaftarAntrianView: React.FC<DaftarAntrianViewProps> = ({
  services,
  queues,
  onRecall,
  onUpdateStatus,
  onOpenWalkInModal,
}) => {
  const [selectedPoliFilter, setSelectedPoliFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredQueues = queues.filter((item) => {
    const matchPoli = selectedPoliFilter === 'all' || item.service_code === selectedPoliFilter;
    const matchStatus = selectedStatusFilter === 'all' || item.status === selectedStatusFilter;
    const matchSearch =
      item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.queue_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patient_nik && item.patient_nik.includes(searchQuery));
    return matchPoli && matchStatus && matchSearch;
  });

  const getServiceBadge = (code: string) => {
    switch (code) {
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
            <Stethoscope className="w-3 h-3" /> Poli Umum
          </span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
            <Smile className="w-3 h-3" /> Poli Gigi
          </span>
        );
      case 'F':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
            <Pill className="w-3 h-3" /> Farmasi
          </span>
        );
    }
  };

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Selesai
          </span>
        );
      case 'calling':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
            <Clock className="w-3 h-3" /> Dipanggil
          </span>
        );
      case 'serving':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Sedang Dilayani
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            Dilewati
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3854] tracking-tight">
            Daftar Seluruh Antrian Pasien
          </h2>
          <p className="text-xs text-slate-500">
            Manajemen dan monitoring antrean lintas seluruh poli hari ini ({queues.length} total pasien)
          </p>
        </div>

        <button
          onClick={onOpenWalkInModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#188c84] hover:bg-[#13746d] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pasien Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pasien, nomor antrean, atau NIK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setSelectedPoliFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedPoliFilter === 'all'
                ? 'bg-[#0a3854] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Poli
          </button>
          {services.map((service) => (
            <button
              key={service.code}
              onClick={() => setSelectedPoliFilter(service.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPoliFilter === service.code
                  ? 'bg-[#0a3854] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
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

      {/* Main Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-4 w-12">No.</th>
                <th className="pb-3 px-4">Nomor</th>
                <th className="pb-3 px-4">Poli Tujuan</th>
                <th className="pb-3 px-4">Nama Pasien</th>
                <th className="pb-3 px-4">Waktu Daftar</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredQueues.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-black text-[#0a3854] text-sm">
                    {item.queue_number}
                  </td>
                  <td className="py-3.5 px-4">{getServiceBadge(item.service_code)}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">
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
                        <Volume2 className="w-4 h-4" />
                      </button>
                      {item.status !== 'completed' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'completed')}
                          title="Tandai Selesai"
                          className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {item.status === 'waiting' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'skipped')}
                          title="Lewati"
                          className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredQueues.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    Tidak ditemukan data antrean yang sesuai filter.
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
