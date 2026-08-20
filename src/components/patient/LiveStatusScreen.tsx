import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  Users,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageCircle,
  Star,
  Sparkles,
  Volume2,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QueueItem, PatientTicket, Service } from '../../types/queue';
import { speechCaller } from '../../lib/speechHelper';

interface LiveStatusScreenProps {
  myTicket: PatientTicket | null;
  queues: QueueItem[];
  services: Service[];
  onBack: () => void;
  onTakeNewTicket: () => void;
  onCancelTicket: () => void;
  onSubmitRating?: (queueId: string, rating: number, feedback?: string) => void;
}

export const LiveStatusScreen: React.FC<LiveStatusScreenProps> = ({
  myTicket,
  queues,
  services,
  onBack,
  onTakeNewTicket,
  onCancelTicket,
  onSubmitRating,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasAlertedApproaching, setHasAlertedApproaching] = useState(false);
  const [hasAlertedCalling, setHasAlertedCalling] = useState(false);

  // Rating Modal States
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const prevStatusRef = useRef<string | null>(null);

  const userQueue = myTicket
    ? queues.find((q) => q.id === myTicket.queueId || q.queue_number === myTicket.queueNumber)
    : null;
  const serviceCode = myTicket?.serviceCode || 'A';
  const service = services.find((s) => s.code === serviceCode);

  const currentlyCalling = queues.find(
    (q) => q.service_code === serviceCode && (q.status === 'calling' || q.status === 'serving')
  );

  const userSeq = userQueue?.sequence_number || 0;
  const waitingBeforeUser = queues.filter(
    (q) =>
      q.service_code === serviceCode &&
      q.status === 'waiting' &&
      q.sequence_number < userSeq
  ).length;

  const isMyTurnNow = userQueue?.status === 'calling' || userQueue?.status === 'serving';
  const isCompleted = userQueue?.status === 'completed';
  const isApproaching = waitingBeforeUser > 0 && waitingBeforeUser <= 2 && userQueue?.status === 'waiting';

  const estMinutesPerPerson = service?.estimated_wait_minutes || 10;
  const totalEstWaitMin = Math.max(5, waitingBeforeUser * estMinutesPerPerson);

  // 1. Trigger Getaran & Audio saat Giliran Tiba atau Sisa 1-2 Orang
  useEffect(() => {
    if (isMyTurnNow && !hasAlertedCalling) {
      speechCaller.triggerVibration([300, 150, 300, 150, 500]);
      speechCaller.playPatientAlert();
      setHasAlertedCalling(true);
    }
  }, [isMyTurnNow, hasAlertedCalling]);

  useEffect(() => {
    if (isApproaching && !hasAlertedApproaching) {
      speechCaller.triggerVibration([200, 100, 200]);
      speechCaller.playPatientAlert();
      setHasAlertedApproaching(true);
    }
  }, [isApproaching, hasAlertedApproaching]);

  // 2. Deteksi status selesai untuk menampilkan modal rating CSAT
  useEffect(() => {
    if (userQueue && prevStatusRef.current !== 'completed' && userQueue.status === 'completed') {
      setShowRatingModal(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // Fallback
      }
    }
    prevStatusRef.current = userQueue?.status || null;
  }, [userQueue]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleShareWhatsApp = () => {
    if (!myTicket) return;
    const liveUrl = typeof window !== 'undefined' ? `${window.location.origin}/?mode=pasien` : '';
    const statusMsg = isMyTurnNow
      ? '🔔 *STATUS:* Sedang Dipanggil ke Ruangan!'
      : isCompleted
      ? '✅ *STATUS:* Pelayanan Selesai'
      : `⏳ *STATUS:* Menunggu (${waitingBeforeUser} orang lagi)`;

    const message =
      `🏥 *UPDATE ANTREAN KLINIK SEHAT*\n\n` +
      `*No. Antrean:* ${myTicket.queueNumber}\n` +
      `*Pasien:* ${myTicket.patientName}\n` +
      `*Poli:* ${myTicket.serviceName} (${myTicket.roomName})\n` +
      `${statusMsg}\n\n` +
      `🔗 *Live Tracker:* ${liveUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRatingSubmit = () => {
    if (!myTicket) return;
    setIsSubmittingRating(true);

    if (onSubmitRating) {
      onSubmitRating(myTicket.queueId, selectedRating, feedbackText);
    }

    setTimeout(() => {
      setIsSubmittingRating(false);
      setRatingSubmitted(true);
      setTimeout(() => {
        setShowRatingModal(false);
        onCancelTicket();
        onBack();
      }, 1200);
    }, 500);
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    onCancelTicket();
    onBack();
  };

  if (!myTicket) {
    return (
      <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
            Status Antrian
          </span>
          <div className="w-8" />
        </div>

        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-200 text-slate-400 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 mb-1">
            Belum Ada Nomor Antrian Aktif
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-6">
            Anda belum mengambil nomor antrian pada hari ini. Silakan pilih poli dan ambil tiket antrean.
          </p>
          <button
            onClick={onTakeNewTicket}
            className="py-3 px-6 bg-[#188c84] hover:bg-[#13746d] text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ambil Nomor Antrian Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-800 pb-6 relative">
      {/* Top App Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm tracking-wide text-slate-800 uppercase">
          Live Status Antrian
        </span>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Segarkan data"
        >
          <RefreshCw className={`w-4 h-4 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Banner 1: Giliran Tiba (Pemanggilan Aktif) */}
        {isMyTurnNow && (
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg animate-pulse flex items-center gap-3.5 border-2 border-emerald-300">
            <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wide flex items-center gap-1.5">
                <span>🔔 Giliran Anda Tiba!</span>
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Silakan segera menuju ke <strong>{myTicket.serviceName} ({myTicket.roomName})</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Banner 2: Peringatan Sisa 1-2 Orang (Mendekati) */}
        {isApproaching && !isMyTurnNow && (
          <div className="p-3.5 bg-amber-500 text-white rounded-2xl shadow-md flex items-center gap-3 animate-fade-in border border-amber-300">
            <div className="p-2 rounded-xl bg-white/20 shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide">
                Persiapan: Sisa {waitingBeforeUser} Pasien Lagi
              </h4>
              <p className="text-[11px] text-amber-100 mt-0.5">
                Mohon tetap berada di dekat ruang tunggu {myTicket.serviceName}.
              </p>
            </div>
          </div>
        )}

        {/* Banner 3: Pelayanan Selesai */}
        {isCompleted && (
          <div className="p-4 bg-slate-800 text-white rounded-2xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Pelayanan Selesai</h4>
                <p className="text-xs text-slate-300">Terima kasih telah berkunjung.</p>
              </div>
            </div>
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Beri Rating
            </button>
          </div>
        )}

        {/* 1. NOMOR ANDA Card */}
        <div className="bg-gradient-to-b from-teal-800 via-teal-900 to-[#0a3854] rounded-3xl p-6 text-white text-center shadow-xl shadow-teal-900/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-bold text-teal-200 uppercase tracking-widest block mb-1">
            Nomor Antrean Anda
          </span>
          <h1 className="text-5xl font-black tracking-tight text-white my-1">
            {myTicket.queueNumber}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs font-semibold px-3.5 py-1 bg-white/15 rounded-full text-teal-100 backdrop-blur-xs">
              {myTicket.serviceName} • {myTicket.roomName}
            </span>
          </div>
        </div>

        {/* 2. SEDANG DILAYANI Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Nomor Sedang Dilayani
          </span>
          <h2 className="text-4xl font-black tracking-tight text-amber-500 my-1">
            {currentlyCalling ? currentlyCalling.queue_number : '—'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {currentlyCalling ? `Pasien: ${currentlyCalling.patient_name}` : 'Belum ada panggilan aktif di poli ini'}
          </p>
        </div>

        {/* 3. SISA ANTRIAN & ESTIMASI WAKTU Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sisa Antrian
            </span>
            <span className="text-xl font-black text-slate-800 mt-0.5">
              {isCompleted ? '0' : isMyTurnNow ? '0' : `${waitingBeforeUser} orang`}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Tunggu
            </span>
            <span className="text-xl font-black text-slate-800 mt-0.5">
              {isCompleted ? '0 mnt' : isMyTurnNow ? 'Sekarang' : `${totalEstWaitMin - 5} - ${totalEstWaitMin} mnt`}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Kirim Update ke WhatsApp</span>
          </button>

          <button
            onClick={handleRefresh}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan Status</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL RATING KEPUASAN PASIEN (CSAT MODAL) */}
      {/* ========================================================================= */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden">
            {ratingSubmitted ? (
              <div className="py-6 space-y-3 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Terima Kasih Banyak!
                </h3>
                <p className="text-xs text-slate-500">
                  Penilaian Anda sangat berharga untuk meningkatkan kualitas pelayanan Klinik Sehat.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#0a3854]">
                    Bagaimana Pelayanan Kami?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Beri rating untuk pelayanan di <strong>{myTicket.serviceName}</strong>
                  </p>
                </div>

                {/* Star Rating Selector */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="p-1 hover:scale-125 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= selectedRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating Label Indicator */}
                <span className="inline-block text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {selectedRating === 5 && '🌟 Sangat Puas & Menyenangkan'}
                  {selectedRating === 4 && '😊 Puas & Cepat'}
                  {selectedRating === 3 && '😐 Cukup Baik'}
                  {selectedRating === 2 && '🙁 Kurang Memuaskan'}
                  {selectedRating === 1 && '⚠️ Sangat Kecewa'}
                </span>

                {/* Feedback Input */}
                <div>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tulis ulasan / saran Anda (opsional)..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-800"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleSkipRating}
                    className="py-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Lewati
                  </button>

                  <button
                    onClick={handleRatingSubmit}
                    disabled={isSubmittingRating}
                    className="py-2.5 bg-[#188c84] hover:bg-[#13746d] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRating ? 'Mengirim...' : 'Kirim Ulasan'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
