import React from 'react';
import { Menu, Bell, Stethoscope, Smile, Pill, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import type { Service, PatientTicket } from '../../types/queue';

interface HomeScreenProps {
  services: Service[];
  activeTicket: PatientTicket | null;
  onSelectService: (service: Service) => void;
  onViewStatus: () => void;
  onGoToServiceList: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  services,
  activeTicket,
  onSelectService,
  onViewStatus,
  onGoToServiceList,
}) => {
  const getServiceIcon = (code: string) => {
    switch (code) {
      case 'A':
        return <Stethoscope className="w-6 h-6 text-teal-700" />;
      case 'B':
        return <Smile className="w-6 h-6 text-blue-600" />;
      case 'F':
      default:
        return <Pill className="w-6 h-6 text-purple-600" />;
    }
  };

  const getServiceBg = (code: string) => {
    switch (code) {
      case 'A':
        return 'bg-teal-50 border-teal-200 text-teal-900 hover:border-teal-400';
      case 'B':
        return 'bg-blue-50 border-blue-200 text-blue-900 hover:border-blue-400';
      case 'F':
      default:
        return 'bg-purple-50 border-purple-200 text-purple-900 hover:border-purple-400';
    }
  };

  const getIconWrapperBg = (code: string) => {
    switch (code) {
      case 'A':
        return 'bg-teal-100/80';
      case 'B':
        return 'bg-blue-100/80';
      case 'F':
      default:
        return 'bg-purple-100/80';
    }
  };

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-4">
      {/* Top App Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20 shadow-xs">
        <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Sistem Antrian
        </span>
        <button className="relative p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          {activeTicket && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
          )}
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Active Ticket Alert Banner */}
        {activeTicket && (
          <div
            onClick={onViewStatus}
            className="p-3.5 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-2xl shadow-md cursor-pointer flex items-center justify-between hover:shadow-lg transition-all"
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Antrian Anda Sedang Berjalan
              </span>
              <p className="font-bold text-lg mt-0.5">
                {activeTicket.queueNumber} • {activeTicket.serviceName}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <span>Pantau</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Welcome Greeting Card */}
        <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 rounded-3xl p-5 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-teal-200 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Klinik Sehat Terpadu</span>
            </div>
            <h2 className="text-xl font-black tracking-tight mb-1">
              Selamat Datang 👋
            </h2>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              Silakan pilih jenis pelayanan poli untuk mengambil nomor antrean secara mandiri dan mudah.
            </p>
          </div>
        </div>

        {/* Service Options List */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pilihan Layanan Poli
            </h3>
            <button
              onClick={onGoToServiceList}
              className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${getServiceBg(
                  service.code
                )}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-2xl ${getIconWrapperBg(service.code)} shadow-inner`}>
                    {getServiceIcon(service.code)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight text-slate-900">
                      {service.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {service.description || `Layanan ${service.name}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-semibold text-teal-800 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                        {service.room_name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Est. {service.estimated_wait_minutes} mnt
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-auto bg-slate-100 rounded-2xl p-3.5 border border-slate-200/60 text-slate-600 text-xs flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Pendaftaran antrean online dibuka mulai jam <strong>07.30 - 15.30 WIB</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
