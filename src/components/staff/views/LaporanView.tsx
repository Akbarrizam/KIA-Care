import React from 'react';
import {
  Clock,
  TrendingUp,
  Award,
  Download,
  Stethoscope,
  Smile,
  Pill,
} from 'lucide-react';
import type { QueueItem, Service } from '../../../types/queue';

interface LaporanViewProps {
  services: Service[];
  queues: QueueItem[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ queues }) => {
  const total = queues.length || 1;
  const countUmum = queues.filter((q) => q.service_code === 'A').length;
  const countGigi = queues.filter((q) => q.service_code === 'B').length;
  const countFarmasi = queues.filter((q) => q.service_code === 'F').length;

  const pctUmum = Math.round((countUmum / total) * 100);
  const pctGigi = Math.round((countGigi / total) * 100);
  const pctFarmasi = Math.round((countFarmasi / total) * 100);

  // Peak hour distributions dummy data
  const peakHours = [
    { hour: '08.00 - 09.00', count: 6, pct: 40 },
    { hour: '09.00 - 10.00', count: 14, pct: 90 },
    { hour: '10.00 - 11.00', count: 11, pct: 75 },
    { hour: '11.00 - 12.00', count: 8, pct: 55 },
    { hour: '13.00 - 14.00', count: 9, pct: 60 },
    { hour: '14.00 - 15.00', count: 4, pct: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3854] tracking-tight">
            Laporan Kunjungan & Analisis Pelayanan
          </h2>
          <p className="text-xs text-slate-500">
            Statistik performa operasional antrean, efisiensi waktu, dan volume pasien
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a3854] hover:bg-[#082d44] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Laporan PDF</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Rata-rata Waktu Tunggu</span>
            <h3 className="text-3xl font-black text-[#0a3854] mt-1">11.4 Menit</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Sangat Baik (SOP &lt; 15 mnt)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Tingkat Penyelesaian</span>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">96.8%</h3>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              Hanya 3.2% pasien terlewat
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Jam Paling Padat (Peak)</span>
            <h3 className="text-3xl font-black text-amber-500 mt-1">09.00 - 10.00</h3>
            <span className="text-[11px] text-slate-500 mt-1 inline-block">
              14 pasien mendaftar / jam
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Proporsi Poli & Jam Sibuk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#0a3854] uppercase tracking-wide">
            Distribusi Pasien Per Poli
          </h3>
          <p className="text-xs text-slate-400">
            Persentase volume pasien yang berkunjung ke masing-masing poli klinik
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5 text-teal-800">
                  <Stethoscope className="w-3.5 h-3.5" /> Poli Umum
                </span>
                <span>{countUmum} Pasien ({pctUmum}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${pctUmum}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5 text-blue-800">
                  <Smile className="w-3.5 h-3.5" /> Poli Gigi
                </span>
                <span>{countGigi} Pasien ({pctGigi}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pctGigi}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5 text-purple-800">
                  <Pill className="w-3.5 h-3.5" /> Farmasi & Obat
                </span>
                <span>{countFarmasi} Pasien ({pctFarmasi}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${pctFarmasi}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#0a3854] uppercase tracking-wide">
            Kepadatan Antrean Berdasarkan Jam
          </h3>
          <p className="text-xs text-slate-400">
            Analisis beban kedatangan pasien untuk penyesuaian jadwal dokter jaga
          </p>

          <div className="space-y-3 pt-2">
            {peakHours.map((item) => (
              <div key={item.hour} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="font-semibold">{item.hour}</span>
                  <span className="font-bold text-[#0a3854]">{item.count} Pasien</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
