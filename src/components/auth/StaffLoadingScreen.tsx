import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StaffLoadingScreenProps {
  userName: string;
  userRole: string;
  onComplete: () => void;
}

export const StaffLoadingScreen: React.FC<StaffLoadingScreenProps> = ({
  userName,
  userRole,
  onComplete,
}) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Memverifikasi hak akses akun...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Menyiapkan modul antrean & meja panggil...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Sinkronisasi data pasien & antrean hari ini...');
    }, 950);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Siap! Mengalihkan ke Dashboard...');
    }, 1500);

    const t4 = setTimeout(() => {
      onComplete();
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072437] via-[#0a3854] to-[#0d4b68] flex flex-col items-center justify-center p-6 text-white select-none relative overflow-hidden font-sans">
      {/* Decorative background aura */}
      <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center z-10 max-w-sm w-full animate-fade-in flex flex-col items-center">
        {/* Animated Logo with Pulse Ring */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-[#0a3854] shadow-2xl shadow-teal-400/20">
            <HeartPulse className="w-12 h-12 text-[#0a3854] animate-pulse" />
          </div>
          {/* Subtle spinning border */}
          <div className="absolute -inset-2 rounded-[28px] border-2 border-teal-400/40 border-t-transparent animate-spin [animation-duration:3s]" />
        </div>

        <span className="text-[11px] font-bold tracking-widest text-teal-300 uppercase bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700/50 mb-2">
          {userRole}
        </span>

        <h2 className="text-xl font-black tracking-tight text-white mb-1">
          Selamat Datang, {userName}!
        </h2>
        <p className="text-xs text-teal-200/70 mb-8">
          Mempersiapkan dashboard sistem antrean Klinik Sehat
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md mb-3 shadow-inner">
          <div
            className="h-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-100">
          {progress === 100 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          )}
          <span>{statusText}</span>
        </div>
      </div>

      {/* Footer lock badge */}
      <div className="absolute bottom-8 text-[11px] text-teal-300/50 flex items-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Koneksi Aman & Terotentikasi</span>
      </div>
    </div>
  );
};
