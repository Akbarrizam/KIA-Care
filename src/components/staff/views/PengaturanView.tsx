import React, { useState } from 'react';
import {
  Building,
  Volume2,
  Save,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { Service } from '../../../types/queue';
import { speechCaller } from '../../../lib/speechHelper';

interface PengaturanViewProps {
  services: Service[];
  onResetData: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  services,
  onResetData,
}) => {
  const [clinicName, setClinicName] = useState('Klinik Sehat Terpadu');
  const [clinicAddress, setClinicAddress] = useState('Jl. Kesehatan No. 45, Jakarta Pusat');
  const [openTime, setOpenTime] = useState('07:30');
  const [closeTime, setCloseTime] = useState('16:00');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-[#0a3854] tracking-tight">
          Pengaturan Sistem & Konfigurasi Klinik
        </h2>
        <p className="text-xs text-slate-500">
          Kelola profil klinik, jam operasional pendaftaran, unit poli, dan pengujian audio
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan klinik berhasil diperbarui dan disimpan!</span>
        </div>
      )}

      {/* Form Profil Klinik */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building className="w-5 h-5 text-teal-700" />
          <h3 className="font-extrabold text-sm text-[#0a3854] uppercase tracking-wide">
            Informasi Profil Klinik
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Fasilitas Kesehatan / Klinik
            </label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jam Buka Pendaftaran
            </label>
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jam Tutup Pendaftaran
            </label>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#188c84] hover:bg-[#13746d] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>

      {/* Pengaturan Unit Pelayanan (Poli) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-[#0a3854] uppercase tracking-wide pb-3 border-b border-slate-100">
          Unit Pelayanan Aktif
        </h3>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.code}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-[#0a3854]">
                    Kode: [{service.code}] {service.name}
                  </span>
                  <span className="text-xs text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md font-semibold">
                    {service.room_name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Estimasi Waktu Periksa: <strong>{service.estimated_wait_minutes} Menit</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600">Aktif Buka</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pengaturan Audio Speaker dan Reset Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#0a3854] font-bold text-sm">
            <Volume2 className="w-5 h-5 text-teal-700" />
            <span>Uji Suara Speaker</span>
          </div>
          <p className="text-xs text-slate-500">
            Periksa bel nada dering dan sintesis suara pemanggil antrean.
          </p>
          <button
            onClick={() => speechCaller.announceQueue('A-001', 'Poli Umum', 'Ruang 1')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span>Putar Suara</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <RotateCcw className="w-5 h-5 text-rose-600" />
            <span>Reset Data Antrean</span>
          </div>
          <p className="text-xs text-slate-500">
            Bersihkan seluruh daftar antrean pasien hari ini untuk memulai sesi baru.
          </p>
          <button
            onClick={onResetData}
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Reset Antrean Hari Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
