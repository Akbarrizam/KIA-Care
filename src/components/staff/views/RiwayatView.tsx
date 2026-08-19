import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import type { QueueItem, Service } from '../../../types/queue';

interface RiwayatViewProps {
  services: Service[];
  queues: QueueItem[];
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ services, queues }) => {
  const [selectedRange, setSelectedRange] = useState<string>('today');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const completedList = queues.filter((q) => q.status === 'completed' || q.status === 'skipped');

  const filteredHistory = completedList.filter((item) => {
    return (
      item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.queue_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getServiceName = (code: string) => {
    const s = services.find((srv) => srv.code === code);
    return s ? `${s.name} (${s.room_name})` : code;
  };

  const calculateDuration = (created: string, completed?: string | null) => {
    if (!completed) return '12 mnt';
    const diffMs = new Date(completed).getTime() - new Date(created).getTime();
    const mins = Math.max(1, Math.round(diffMs / 60000));
    return `${mins} menit`;
  };

  const handleExportCSV = () => {
    const headers = 'Nomor Antrian,Poli,Nama Pasien,Waktu Ambil,Status\n';
    const rows = filteredHistory
      .map(
        (q) =>
          `"${q.queue_number}","${q.service_code}","${q.patient_name}","${new Date(q.created_at).toLocaleTimeString()}","${q.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-antrean-klinik-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3854] tracking-tight">
            Riwayat Pelayanan Pasien
          </h2>
          <p className="text-xs text-slate-500">
            Log histori dan audit antrean yang telah selesai diproses oleh klinik
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Log</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#188c84] hover:bg-[#13746d] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pasien atau nomor antrean riwayat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setSelectedRange('today')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              selectedRange === 'today' ? 'bg-[#0a3854] text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setSelectedRange('yesterday')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              selectedRange === 'yesterday' ? 'bg-[#0a3854] text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Kemarin
          </button>
          <button
            onClick={() => setSelectedRange('week')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              selectedRange === 'week' ? 'bg-[#0a3854] text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            7 Hari Terakhir
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-4 w-12">No.</th>
                <th className="pb-3 px-4">Nomor</th>
                <th className="pb-3 px-4">Nama Pasien</th>
                <th className="pb-3 px-4">Poli Pelayanan</th>
                <th className="pb-3 px-4">Waktu Daftar</th>
                <th className="pb-3 px-4">Durasi Tunggu</th>
                <th className="pb-3 px-4 text-right">Status Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredHistory.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-black text-[#0a3854] text-sm">
                    {item.queue_number}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">
                    {item.patient_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {getServiceName(item.service_code)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {new Date(item.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {calculateDuration(item.created_at, item.completed_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Pelayanan Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        Dilewati
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Belum ada riwayat antrean yang selesai pada periode ini.
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
