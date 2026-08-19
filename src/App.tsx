import { useState, useEffect } from 'react';
import {
  Home,
  Megaphone,
  ListOrdered,
  History,
  FileBarChart,
  Settings,
  Volume2,
  Plus,
  LogOut,
  QrCode,
  Shield,
} from 'lucide-react';
import type { Service, StaffProfile } from './types/queue';
import { useQueueManager } from './hooks/useQueueManager';
import { speechCaller } from './lib/speechHelper';
import { authService } from './lib/authService';
import { PatientQrModal } from './components/common/PatientQrModal';

// Auth Components
import { StaffLoginScreen } from './components/auth/StaffLoginScreen';

// 6 Sidebar Views
import { BerandaView } from './components/staff/views/BerandaView';
import { PanggilNomorView } from './components/staff/views/PanggilNomorView';
import { DaftarAntrianView } from './components/staff/views/DaftarAntrianView';
import { RiwayatView } from './components/staff/views/RiwayatView';
import { LaporanView } from './components/staff/views/LaporanView';
import { PengaturanView } from './components/staff/views/PengaturanView';

// Patient & TV Displays
import { HomeScreen } from './components/patient/HomeScreen';
import { ServiceSelectScreen } from './components/patient/ServiceSelectScreen';
import { TicketScreen } from './components/patient/TicketScreen';
import { LiveStatusScreen } from './components/patient/LiveStatusScreen';
import { NotificationScreen } from './components/patient/NotificationScreen';
import { BottomNav } from './components/patient/BottomNav';
import type { PatientTab } from './components/patient/BottomNav';
import { TvDisplayScreen } from './components/display/TvDisplayScreen';

export function App() {
  const {
    services,
    queues,
    myTicket,
    lastAnnouncement,
    callNextQueue,
    recallQueue,
    updateQueueStatus,
    takeQueue,
    resetAllData,
    clearMyTicket,
  } = useQueueManager();

  // Auth States
  const [currentUser, setCurrentUser] = useState<StaffProfile | null>(() => {
    return authService.getCurrentSession();
  });

  // View Mode: otomatis deteksi jika URL mengandung ?mode=pasien atau ?mode=tv
  const [currentAppMode, setCurrentAppMode] = useState<'staff' | 'patient' | 'tv'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      if (mode === 'pasien' || mode === 'patient') return 'patient';
      if (mode === 'tv' || mode === 'display') return 'tv';
    }
    return 'staff';
  });

  // Patient Mobile Sub-screens
  const [patientScreen, setPatientScreen] = useState<'home' | 'select-service' | 'ticket' | 'status' | 'notification' | 'history'>('home');
  const [patientTab, setPatientTab] = useState<PatientTab>('home');
  const [isTakingQueue, setIsTakingQueue] = useState<boolean>(false);

  // Dashboard Staff Menu & Poli
  const [activeMenu, setActiveMenu] = useState<string>('panggil');
  const [selectedServiceCode, setSelectedServiceCode] = useState<string>('A');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCallingLoading, setIsCallingLoading] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Modal Walk-In
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);
  const [walkInName, setWalkInName] = useState<string>('');
  const [walkInNik, setWalkInNik] = useState<string>('');
  const [walkInPhone, setWalkInPhone] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeService: Service =
    services.find((s: Service) => s.code === selectedServiceCode) || services[0];

  // Handler Login Petugas
  const handleLoginSuccess = (profile: StaffProfile) => {
    setCurrentUser(profile);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const handleCallNext = async () => {
    setIsCallingLoading(true);
    await callNextQueue(selectedServiceCode);
    setIsCallingLoading(false);
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) return;
    await takeQueue(selectedServiceCode, walkInName, walkInNik, walkInPhone);
    setWalkInName('');
    setWalkInNik('');
    setWalkInPhone('');
    setShowWalkInModal(false);
  };

  // Handler Pasien
  const handleConfirmTakeQueue = async (
    service: Service,
    pName: string,
    pNik: string,
    pPhone: string
  ) => {
    setIsTakingQueue(true);
    try {
      await takeQueue(service.code, pName, pNik, pPhone);
      setPatientScreen('ticket');
    } finally {
      setIsTakingQueue(false);
    }
  };

  // ==========================================================
  // 1. TAMPILAN KHUSUS PASIEN (SAAT SCAN QR ATAU BUKA LINK PASIEN)
  // ==========================================================
  if (currentAppMode === 'patient') {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center text-slate-800">
        <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-sm relative">
          {patientScreen === 'home' && (
            <>
              <HomeScreen
                services={services}
                activeTicket={myTicket}
                onSelectService={() => setPatientScreen('select-service')}
                onViewStatus={() => {
                  setPatientScreen('status');
                  setPatientTab('status');
                }}
                onGoToServiceList={() => setPatientScreen('select-service')}
              />
              <BottomNav
                activeTab={patientTab}
                onTabChange={(tab) => {
                  setPatientTab(tab);
                  if (tab === 'home') setPatientScreen('home');
                  if (tab === 'status') setPatientScreen('status');
                }}
                hasActiveTicket={Boolean(myTicket)}
              />
            </>
          )}

          {patientScreen === 'select-service' && (
            <ServiceSelectScreen
              services={services}
              onBack={() => setPatientScreen('home')}
              onConfirmTakeQueue={handleConfirmTakeQueue}
              isLoading={isTakingQueue}
            />
          )}

          {patientScreen === 'ticket' && myTicket && (
            <TicketScreen
              ticket={myTicket}
              onBack={() => setPatientScreen('home')}
              onGoToLiveStatus={() => {
                setPatientScreen('status');
                setPatientTab('status');
              }}
            />
          )}

          {patientScreen === 'status' && (
            <>
              <LiveStatusScreen
                myTicket={myTicket}
                queues={queues}
                services={services}
                onBack={() => {
                  setPatientScreen('home');
                  setPatientTab('home');
                }}
                onTakeNewTicket={() => setPatientScreen('select-service')}
                onCancelTicket={clearMyTicket}
              />
              <BottomNav
                activeTab={patientTab}
                onTabChange={(tab) => {
                  setPatientTab(tab);
                  if (tab === 'home') setPatientScreen('home');
                  if (tab === 'status') setPatientScreen('status');
                }}
                hasActiveTicket={Boolean(myTicket)}
              />
            </>
          )}

          {patientScreen === 'notification' && (
            <NotificationScreen
              ticket={myTicket}
              onBack={() => setPatientScreen('home')}
              onOpenApp={() => setPatientScreen('status')}
            />
          )}
        </div>
      </div>
    );
  }

  // ==========================================================
  // 2. TAMPILAN DISPLAY TV RUANG TUNGGU
  // ==========================================================
  if (currentAppMode === 'tv') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentAppMode('staff')}
          className="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-600 backdrop-blur-md cursor-pointer"
        >
          ✕ Keluar Mode TV
        </button>
        <TvDisplayScreen
          services={services}
          queues={queues}
          lastAnnouncement={lastAnnouncement}
        />
      </div>
    );
  }

  // ==========================================================
  // 3. TAMPILKAN LOGIN SCREEN JIKA BELUM LOGIN (SISI PETUGAS)
  // ==========================================================
  if (!currentUser && currentAppMode === 'staff') {
    return (
      <StaffLoginScreen
        onLoginSuccess={handleLoginSuccess}
        onOpenPatientView={() => setCurrentAppMode('patient')}
      />
    );
  }

  // ==========================================================
  // 4. TAMPILAN UTAMA DASHBOARD PETUGAS
  // ==========================================================
  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-slate-800 font-sans antialiased select-none">
      {/* 1. SIDEBAR NAVIGASI PETUGAS */}
      <aside className="w-64 bg-[#0a3854] text-white flex flex-col justify-between shrink-0 shadow-lg z-30">
        <div>
          {/* Header Sidebar: Brand */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-[#0a3854] font-black text-xl shadow-md">
              +
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wide text-white uppercase">
                DASHBOARD PETUGAS
              </h1>
              <p className="text-[11px] text-teal-300 font-medium">
                Klinik Sehat
              </p>
            </div>
          </div>

          {/* User Profile Card in Sidebar */}
          {currentUser && (
            <div className="mx-4 my-3 p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div className="truncate flex-1">
                <h4 className="font-bold text-xs text-white truncate">
                  {currentUser.name}
                </h4>
                <span className="text-[10px] font-semibold text-teal-300 uppercase tracking-wider block">
                  {currentUser.roleTitle}
                </span>
                <span className="text-[9px] text-slate-300 block truncate">
                  {currentUser.roomName}
                </span>
              </div>
            </div>
          )}

          {/* 6 Menu Items */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveMenu('beranda')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'beranda'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveMenu('panggil')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'panggil'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Panggil Nomor</span>
            </button>

            <button
              onClick={() => setActiveMenu('antrian')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'antrian'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Daftar Antrian</span>
            </button>

            <button
              onClick={() => setActiveMenu('riwayat')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'riwayat'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>

            <button
              onClick={() => setActiveMenu('laporan')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'laporan'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileBarChart className="w-4 h-4" />
              <span>Laporan</span>
            </button>

            <button
              onClick={() => setActiveMenu('pengaturan')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeMenu === 'pengaturan'
                  ? 'bg-[#188c84] text-white font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              Loket Aktif: {activeService.name} ({activeService.room_name})
            </span>
          </div>

          {/* Right Controls: Date, Time & Add Walk-in */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            {/* Tombol QR Code Pasien */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl transition-colors cursor-pointer font-bold"
              title="Tampilkan QR Code untuk di-scan HP Pasien"
            >
              <QrCode className="w-4 h-4 text-teal-700" />
              <span>QR Code Pasien</span>
            </button>

            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 font-medium">
              <span>
                {currentTime.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-mono font-bold text-[#0a3854]">
                {currentTime.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            <button
              onClick={() => speechCaller.announceQueue('A-023', activeService.name, activeService.room_name)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Uji coba speaker pemanggil"
            >
              <Volume2 className="w-4 h-4 text-teal-700" />
              <span>Tes Audio</span>
            </button>

            <button
              onClick={() => setShowWalkInModal(true)}
              className="flex items-center gap-1.5 bg-[#188c84] hover:bg-[#13746d] text-white font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Pasien Loket</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <div className="p-8 max-w-[1400px] w-full mx-auto">
          {activeMenu === 'beranda' && (
            <BerandaView
              services={services}
              queues={queues}
              onNavigateMenu={setActiveMenu}
              onOpenWalkInModal={() => setShowWalkInModal(true)}
            />
          )}

          {activeMenu === 'panggil' && (
            <PanggilNomorView
              services={services}
              queues={queues}
              selectedServiceCode={selectedServiceCode}
              onSelectServiceCode={setSelectedServiceCode}
              onCallNext={handleCallNext}
              onRecall={recallQueue}
              onUpdateStatus={updateQueueStatus}
              isCallingLoading={isCallingLoading}
            />
          )}

          {activeMenu === 'antrian' && (
            <DaftarAntrianView
              services={services}
              queues={queues}
              onRecall={recallQueue}
              onUpdateStatus={updateQueueStatus}
              onOpenWalkInModal={() => setShowWalkInModal(true)}
            />
          )}

          {activeMenu === 'riwayat' && (
            <RiwayatView services={services} queues={queues} />
          )}

          {activeMenu === 'laporan' && (
            <LaporanView services={services} queues={queues} />
          )}

          {activeMenu === 'pengaturan' && (
            <PengaturanView
              services={services}
              onResetData={resetAllData}
            />
          )}
        </div>
      </main>

      {/* Modal Tambah Pasien Walk-in */}
      {showWalkInModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base text-[#0a3854] mb-1">
              Tambah Pasien Loket ({activeService.name})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cetak nomor antrean langsung untuk pasien yang mendaftar di loket klinik.
            </p>

            <form onSubmit={handleWalkInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
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
                  No. Telepon / WhatsApp (Opsional)
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
                  className="px-5 py-2 bg-[#188c84] hover:bg-[#13746d] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
                >
                  Cetak & Tambah Antrian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Pasien Modal */}
      <PatientQrModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
    </div>
  );
}

export default App;
