import React, { useState } from 'react';
import { ArrowLeft, Stethoscope, Smile, Pill, ChevronRight, Clock, Info, User, CheckCircle2 } from 'lucide-react';
import type { Service } from '../../types/queue';

interface ServiceSelectScreenProps {
  services: Service[];
  onBack: () => void;
  onConfirmTakeQueue: (service: Service, patientName: string, patientNik: string, patientPhone: string) => Promise<void>;
  isLoading: boolean;
}

export const ServiceSelectScreen: React.FC<ServiceSelectScreenProps> = ({
  services,
  onBack,
  onConfirmTakeQueue,
  isLoading,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientNik, setPatientNik] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const getServiceIcon = (code: string) => {
    switch (code) {
      case 'A':
        return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'B':
        return <Smile className="w-5 h-5 text-blue-600" />;
      case 'F':
      default:
        return <Pill className="w-5 h-5 text-purple-600" />;
    }
  };

  const handleStartTake = (service: Service) => {
    setSelectedService(service);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    await onConfirmTakeQueue(selectedService, patientName, patientNik, patientPhone);
  };

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Pilih Pelayanan
        </span>
        <div className="w-8" />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-3">
            Pilih loket / poli tujuan Anda:
          </p>

          <div className="flex flex-col gap-3">
            {services.map((service) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleStartTake(service)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-slate-100 mt-0.5">
                        {getServiceIcon(service.code)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm tracking-tight text-slate-900">
                            {service.name}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {service.room_name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                          <Clock className="w-3 h-3 text-teal-600" />
                          <span>
                            Perkiraan tunggu {service.estimated_wait_minutes - 5} - {service.estimated_wait_minutes} menit
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-1 text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Data Pasien Saat Poli Dipilih */}
        {selectedService && (
          <form
            onSubmit={handleSubmit}
            className="mt-2 bg-white p-4 rounded-2xl border border-teal-200 shadow-sm animate-fade-in flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs pb-1 border-b border-slate-100">
              <User className="w-4 h-4 text-teal-700" />
              <span>Data Pasien ({selectedService.name})</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama Lengkap Pasien <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dewi Lestari"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nomor NIK / KTP (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="3201xxxxxxx"
                  value={patientNik}
                  onChange={(e) => setPatientNik(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  No. WhatsApp / HP (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxx"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !patientName.trim()}
              className="mt-2 w-full py-2.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Memproses Tiket...</span>
              ) : (
                <span>Konfirmasi & Ambil Nomor Antrian</span>
              )}
            </button>
          </form>
        )}

        {/* Information Box at Bottom */}
        <div className="mt-auto bg-blue-50/80 rounded-2xl p-4 border border-blue-200/60 text-slate-700 text-xs flex items-start gap-3">
          <div className="p-1 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-blue-950 mb-0.5 text-xs">Informasi</h5>
            <p className="text-[11px] text-blue-900/80 leading-relaxed">
              Nomor antrian akan berlaku pada hari ini sampai jam <strong>16.00 WIB</strong>. Harap hadir setidaknya 10 menit sebelum perkiraan giliran dipanggil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
