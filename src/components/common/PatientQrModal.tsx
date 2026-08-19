import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, Printer, X, Sparkles, Smartphone, Wifi, Edit3 } from 'lucide-react';

interface PatientQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientQrModal: React.FC<PatientQrModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  // Default ke IP jaringan Wi-Fi lokal komputer (192.168.1.11)
  const [customIp, setCustomIp] = useState('192.168.1.11');
  const [isEditingIp, setIsEditingIp] = useState(false);

  if (!isOpen) return null;

  // Jika diakses dari domain asli / hosting internet gunakan origin, jika di localhost ganti dengan IP lokal Wi-Fi
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const baseUrl = isLocalhost
    ? `http://${customIp}:5173`
    : typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  const patientUrl = `${baseUrl}/?mode=pasien`;

  const handleCopy = () => {
    navigator.clipboard.writeText(patientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col text-slate-800 text-center relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon & Title */}
        <div className="mb-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#0a3854] tracking-tight">
            QR Code Pendaftaran Pasien (Wi-Fi)
          </h3>
          <p className="text-xs text-slate-500">
            Akses langsung dari HP dalam jaringan Wi-Fi yang sama
          </p>
        </div>

        {/* IP Wi-Fi Banner / Input */}
        <div className="mb-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-2.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <Wifi className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                IP Komputer di Wi-Fi:
              </span>
              {isEditingIp ? (
                <input
                  type="text"
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-white border border-emerald-400 rounded-md focus:outline-none w-32"
                />
              ) : (
                <span className="font-mono font-bold text-xs">{customIp}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditingIp(!isEditingIp)}
            className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingIp ? 'Selesai' : 'Ubah IP'}</span>
          </button>
        </div>

        {/* Printable Standee Preview Card */}
        <div className="bg-gradient-to-b from-teal-900 to-[#0a3854] p-5 rounded-3xl text-white shadow-md my-1 border border-teal-800">
          <div className="flex items-center justify-center gap-1.5 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klinik Sehat • Antrian Mandiri</span>
          </div>

          <h4 className="text-sm font-black mb-3">
            Scan untuk Ambil Nomor Antrian
          </h4>

          {/* White QR Code container */}
          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto">
            <QRCodeSVG
              value={patientUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#0a3854"
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-teal-100">
            <Smartphone className="w-4 h-4 text-teal-300 animate-bounce" />
            <span>Pastikan HP tersambung ke Wi-Fi yang sama</span>
          </div>
        </div>

        {/* Link URL Copy box */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-500 truncate max-w-[240px] font-mono text-[11px]">
            {patientUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handlePrint}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Standee</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 bg-[#188c84] hover:bg-[#13746d] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
