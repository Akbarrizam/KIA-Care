import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, ExternalLink, X } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- Skema Supabase Lengkap
-- Salin dan jalankan di Supabase Dashboard -> SQL Editor
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    room_name VARCHAR(50) NOT NULL,
    description TEXT,
    estimated_wait_minutes INT DEFAULT 15,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    service_code VARCHAR(5) NOT NULL,
    queue_number VARCHAR(20) NOT NULL,
    sequence_number INT NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_nik VARCHAR(30),
    patient_phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMPTZ DEFAULT now(),
    called_at TIMESTAMPTZ,
    serving_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    queue_date DATE DEFAULT CURRENT_DATE
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public all access on queues" ON public.queues FOR ALL USING (true) WITH CHECK (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Integrasi Database Supabase
              </h3>
              <p className="text-xs text-slate-500">
                Status: {isSupabaseConfigured ? (
                  <span className="text-emerald-600 font-bold">Terhubung ke Supabase Cloud</span>
                ) : (
                  <span className="text-teal-700 font-bold">Mode Simulasi Realtime Lokal (Siap Pakai)</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-700">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-teal-950 mb-0.5">
                Simulasi Otomatis Tanpa Setup Tambahan
              </h4>
              <p className="text-teal-900/80 leading-relaxed">
                Aplikasi ini sudah dilengkapi <strong>Realtime Synchronization</strong> otomatis multi-tab browser. Anda bisa langsung mencoba membuka Tab Pasien dan Tab Petugas bersamaan dan melihat perubahannya secara instan.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>Langkah Menghubungkan ke Supabase Cloud Asli:</span>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Buka Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
              <li>Buat project baru di <strong>supabase.com</strong>.</li>
              <li>Buka menu <strong>SQL Editor</strong>, tempel skema SQL di bawah, lalu klik <strong>Run</strong>.</li>
              <li>Buka <strong>Project Settings &gt; API</strong>, lalu salin <strong>URL</strong> dan <strong>anon key</strong>.</li>
              <li>Buat file <code>.env</code> di root folder proyek ini:</li>
            </ol>
          </div>

          <div className="bg-slate-900 text-teal-300 font-mono p-3 rounded-xl text-[11px]">
            VITE_SUPABASE_URL=https://your-project.supabase.co<br />
            VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">Skema SQL Database:</span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-300 p-3.5 rounded-xl font-mono text-[10px] max-h-40 overflow-y-auto leading-relaxed">
              {sqlCode}
            </pre>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
