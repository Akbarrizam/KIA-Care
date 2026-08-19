import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Users,
  RotateCcw,
  CheckCircle2,
  SkipForward,
  Plus,
  Calendar,
  Clock,
  Settings,
  FileText,
  History,
  LayoutDashboard,
  Megaphone,
  Stethoscope,
  Smile,
  Pill,
} from 'lucide-react';
import type { QueueItem, Service, QueueStatus } from '../../types/queue';

interface StaffDashboardProps {
  services: Service[];
  queues: QueueItem[];
  onCallNext: (serviceCode: string) => Promise<QueueItem | null>;
  onRecall: (queueId: string) => void;
  onUpdateStatus: (queueId: string, status: QueueStatus) => void;
  onAddWalkIn: (serviceCode: string, name: string, nik: string, phone: string) => Promise<void>;
  onResetData: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  services,
  queues,
  onCallNext,
  onRecall,
  onUpdateStatus,
  onAddWalkIn,
  onResetData,
}) => {
  const [selectedServiceCode, setSelectedServiceCode] = useState<string>('A');
  const [activeMenu, setActiveMenu] = useState<string>('call');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCallingLoading, setIsCallingLoading] = useState<boolean>(false);

  // Modal Walk-In
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);
  const [walkInName, setWalkInName] = useState<string>('');
  const [walkInNik, setWalkInNik] = useState<string>('');
  const [walkInPhone, setWalkInPhone] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeService = services.find((s) => s.code === selectedServiceCode) || services[0];

  const poliQueues = queues.filter((q) => q.service_code === selectedServiceCode);
  const currentlyServing = poliQueues.find((q) => q.status === 'calling' || q.status === 'serving');
  const nextQueues = poliQueues
    .filter((q) => q.status === 'waiting')
    .sort((a, b) => a.sequence_number - b.sequence_number);

  const handleCallNext = async () => {
    setIsCallingLoading(true);
    await onCallNext(selectedServiceCode);
    setIsCallingLoading(false);
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;
    await onAddWalkIn(selectedServiceCode, walkInName, walkInNik, walkInPhone);
    setWalkInName('');
    setWalkInNik('');
    setWalkInPhone('');
    setShowWalkInModal(false);
  };

  const getServiceIcon = (code: string) => {
    switch (code) {
      case 'A':
        return <Stethoscope className="w-4 h-4" />;
      case 'B':
        return <Smile className="w-4 h-4" />;
      case 'F':
      default:
        return <Pill className="w-4 h-4" />;
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
            <Megaphone className="w-3 h-3" /> Dipanggil
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
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* 1. Sidebar Navigasi */}
      <aside className="w-64 bg-teal-950 text-white flex flex-col justify-between hidden md:flex shrink-0 shadow-xl">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-teal-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-teal-950 font-black shadow-md">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-white">
                KLINIK SEHAT
              </h2>
              <p className="text-[11px] text-teal-300 font-medium">
                Dashboard Petugas
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveMenu('call')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'call'
                  ? 'bg-teal-700/80 text-white shadow-sm'
                  : 'text-teal-200/80 hover:bg-teal-900/50 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Panggil Nomor</span>
            </button>

            <button
              onClick={() => setActiveMenu('list')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'list'
                  ? 'bg-teal-700/80 text-white shadow-sm'
                  : 'text-teal-200/80 hover:bg-teal-900/50 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Daftar Antrian</span>
            </button>

            <button
              onClick={() => setActiveMenu('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'history'
                  ? 'bg-teal-700/80 text-white shadow-sm'
                  : 'text-teal-200/80 hover:bg-teal-900/50 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Pasien</span>
            </button>

            <button
              onClick={() => setActiveMenu('report')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'report'
                  ? 'bg-teal-700/80 text-white shadow-sm'
                  : 'text-teal-200/80 hover:bg-teal-900/50 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Laporan Kunjungan</span>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'settings'
                  ? 'bg-teal-700/80 text-white shadow-sm'
                  : 'text-teal-200/80 hover:bg-teal-900/50 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-teal-900/60 text-center">
          <button
            onClick={onResetData}
            className="w-full py-2 bg-teal-900 hover:bg-red-900/80 text-teal-200 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Data Simulasi
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {services.map((service) => (
              <button
                key={service.code}
                onClick={() => setSelectedServiceCode(service.code)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedServiceCode === service.code
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getServiceIcon(service.code)}
                <span>
                  {service.name} ({service.room_name})
                </span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                  {queues.filter((q) => q.service_code === service.code && q.status === 'waiting').length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              <span>
                {currentTime.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg font-mono font-bold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>{currentTime.toLocaleTimeString('id-ID')} WIB</span>
            </div>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pasien Loket</span>
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Section 1: Call Control & Next Queues */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Big Calling Box */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                    {activeService.name} — {activeService.room_name}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Status: Loket Aktif
                </span>
              </div>

              <div className="py-8 text-center my-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Sedang Dilayani / Dipanggil
                </span>
                <div className="inline-block relative">
                  <h1 className="text-7xl font-black tracking-tight text-teal-800 my-1">
                    {currentlyServing ? currentlyServing.queue_number : '—'}
                  </h1>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-2">
                  {currentlyServing ? (
                    <>Pasien: <strong className="text-teal-900 font-bold">{currentlyServing.patient_name}</strong></>
                  ) : (
                    'Belum ada pasien yang sedang dipanggil'
                  )}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleCallNext}
                  disabled={isCallingLoading || nextQueues.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
                      <span>Panggil Ulang</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(currentlyServing.id, 'completed')}
                      className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Selesai</span>
                    </button>

                    <button
                      onClick={() => onUpdateStatus(currentlyServing.id, 'skipped')}
                      className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-rose-200"
                    >
                      <SkipForward className="w-3.5 h-3.5 text-rose-600" />
                      <span>Lewati Pasien</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Antrian Selanjutnya */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-700" />
                  <span>Antrian Selanjutnya</span>
                </h4>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {nextQueues.length} Menunggu
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
                {nextQueues.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-teal-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-black text-sm text-teal-800 block">
                          {item.queue_number}
                        </span>
                        <span className="text-xs text-slate-600">
                          {item.patient_name}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRecall(item.id)}
                      title="Panggil nomor ini langsung"
                      className="p-2 rounded-xl bg-white hover:bg-teal-700 hover:text-white text-slate-400 border border-slate-200 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {nextQueues.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs my-auto">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 opacity-60" />
                    <p>Semua antrean untuk poli ini telah selesai dilayani.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Full Queue Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Daftar Antrian Lengkap ({activeService.name})
                </h3>
                <p className="text-xs text-slate-500">
                  Monitoring seluruh antrean pasien yang terdaftar pada hari ini
                </p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Total: {poliQueues.length} Pasien
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3">No.</th>
                    <th className="pb-3 px-3">Nomor Antrian</th>
                    <th className="pb-3 px-3">Nama Pasien</th>
                    <th className="pb-3 px-3">Waktu Ambil</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {poliQueues.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-400">{index + 1}</td>
                      <td className="py-3 px-3 font-black text-teal-800 text-sm">
                        {item.queue_number}
                      </td>
                      <td className="py-3 px-3 text-slate-900 font-semibold">
                        {item.patient_name}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">
                        {new Date(item.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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

                  {poliQueues.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada pasien yang mendaftar di poli ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Tambah Pasien Walk-in */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Tambah Pasien Loket (Walk-In)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pendaftaran nomor antrean langsung di loket untuk unit <strong>{activeService.name}</strong>.
            </p>

            <form onSubmit={handleWalkInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Marlina"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor NIK / KTP (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="3201xxxxxxx"
                  value={walkInNik}
                  onChange={(e) => setWalkInNik(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon / WA (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxx"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!walkInName.trim()}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Cetak & Tambah Antrian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
