import React from 'react';
import { HeartPulse } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <div className="relative flex flex-col items-center justify-between min-h-[640px] h-full w-full bg-white px-6 py-12 select-none overflow-hidden">
      {/* Decorative top soft glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -top-12 -right-20 w-64 h-64 bg-emerald-100 rounded-full blur-2xl opacity-50" />

      {/* Center Logo & Title */}
      <div className="my-auto flex flex-col items-center text-center z-10 animate-fade-in">
        {/* Emblem Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center shadow-xl shadow-teal-700/20 transform transition-transform hover:scale-105">
            {/* Medical Cross with Leaf Motif */}
            <div className="relative flex items-center justify-center">
              <HeartPulse className="w-14 h-14 text-white animate-pulse" />
            </div>
          </div>
          {/* Subtle ring badge */}
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-teal-900 mb-1">
          KLINIK SEHAT
        </h1>
        <p className="text-sm font-medium text-slate-500 tracking-wide">
          Sistem Nomor Antrian Digital
        </p>

        {/* Loading indicator */}
        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce"></span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Memuat...</span>
        </div>

        {onFinish && (
          <button
            onClick={onFinish}
            className="mt-6 text-xs text-teal-700 font-semibold underline hover:text-teal-900 cursor-pointer"
          >
            Lewati Intro
          </button>
        )}
      </div>

      {/* Bottom Wave Graphic */}
      <div className="w-full relative h-28 -mx-6 -mb-12 overflow-hidden">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="h-full w-full opacity-90"
        >
          <path
            d="M-4.22,46.88 C166.75,145.56 304.45,-12.32 504.79,66.61 L500.00,150.00 L0.00,150.00 Z"
            fill="#0d7a75"
          ></path>
          <path
            d="M0.00,80.00 C150.00,140.00 340.00,20.00 500.00,90.00 L500.00,150.00 L0.00,150.00 Z"
            fill="#169b94"
            opacity="0.6"
          ></path>
        </svg>
      </div>
    </div>
  );
};
