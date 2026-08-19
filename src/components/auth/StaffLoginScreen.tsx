import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import type { StaffProfile } from '../../types/queue';
import { authService } from '../../lib/authService';

interface StaffLoginScreenProps {
  onLoginSuccess: (user: StaffProfile) => void;
  onOpenPatientView?: () => void;
}

export const StaffLoginScreen: React.FC<StaffLoginScreenProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('petugas@kliniksehat.com');
  const [password, setPassword] = useState('petugas123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan kata sandi wajib diisi!');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Kata sandi minimal 4 karakter!');
      return;
    }

    setIsLoading(true);

    try {
      const profile = await authService.login(email, password);
      onLoginSuccess(profile);
    } catch (err) {
      setErrorMsg('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] font-sans select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. SISI KIRI (BRANDED HERO - TEMA KLINIK SEHAT SESUAI GAMBAR CONTOH) */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[58%] bg-gradient-to-br from-[#062030] via-[#0a3854] to-[#0e4d6d] p-8 lg:p-14 text-white flex flex-col justify-between overflow-hidden">
        {/* Subtle Background Pattern Dots */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse [animation-duration:8s]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Brand Logo */}
        <div className="relative z-10 flex items-center gap-3.5 animate-fade-in">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-[#0a3854] shadow-lg shadow-teal-500/25">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider uppercase text-white leading-tight">
              KLINIK SEHAT
            </h1>
            <p className="text-[11px] text-teal-300 font-medium tracking-wide">
              SISTEM INFORMASI & ANTRIAN TERPADU
            </p>
          </div>
        </div>

        {/* Center Content: Main Headline & Feature Cards */}
        <div className="relative z-10 my-auto py-10 max-w-xl space-y-6 animate-fade-in [animation-delay:150ms]">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-teal-200 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Sistem Loket & Antrean Medis Realtime</span>
          </div>

          {/* Big Hero Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-[1.18] tracking-tight text-white drop-shadow-xs">
            Melayani Pasien & Antrean Klinik dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-300">
              Cepat, Tepat & Terpadu.
            </span>
          </h2>

          <p className="text-sm text-slate-300/90 leading-relaxed max-w-lg font-normal">
            Klinik Sehat membantu mengelola administrasi loket pendaftaran, pemanggilan nomor antrean secara realtime, dan rekapitulasi harian seluruh poli secara akurat dan teratur.
          </p>

          {/* 2 Glassmorphism Feature Cards Sesuai Gambar Contoh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all shadow-sm">
              <div className="flex items-center gap-2 mb-1.5 text-teal-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Panggilan Suara Realtime</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Sintesis suara bel dan panggil nomor otomatis ke seluruh ruang tunggu poli.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all shadow-sm">
              <div className="flex items-center gap-2 mb-1.5 text-teal-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Manajemen Multi-Poli</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Kontrol terpusat untuk Poli Umum, Poli Gigi, dan Farmasi dalam 1 dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Sisi Kiri */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <span>© 2026 KLINIK SEHAT • ALL RIGHTS RESERVED</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              SISTEM ANTRIAN AKTIF
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SISI KANAN (FORM LOGIN MINIMALIS SESUAI GAMBAR CONTOH) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[42%] flex flex-col justify-center items-center p-8 lg:p-14 bg-white relative">
        <div className="w-full max-w-md space-y-6 animate-fade-in [animation-delay:250ms]">
          {/* Header Login Sisi Kanan */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-[#0a3854] tracking-tight">
              Selamat Datang di Portal Petugas
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Silakan masuk menggunakan kredensial akun loket Anda.
            </p>
          </div>

          {/* Card Form Container */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl animate-shake">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  EMAIL / USERNAME
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: petugas@kliniksehat.com"
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/70 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    KATA SANDI
                  </label>
                  <span className="text-[11px] text-slate-400 font-semibold cursor-default">
                    Petugas Loket
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-3 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/70 focus:bg-white text-slate-800 font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button Sesuai Gambar Contoh */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#188c84] hover:bg-[#13746d] active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-3"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'MASUK KE DASHBOARD'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bottom Security Info */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akses Khusus Petugas Loket Terlindungi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
