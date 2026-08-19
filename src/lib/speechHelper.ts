// Helper untuk Audio Chime (Web Audio API) dan Pemanggil Suara Bahasa Indonesia (Web Speech API)

class SpeechCaller {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Memutar nada bel / chime elegan sebelum suara panggilan
  public playChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Nada 1: Sol (G5 = 784 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(784, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        // Nada 2: Do (C6 = 1046 Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.5, now + 0.25);
        gain2.gain.setValueAtTime(0.3, now + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.25);
        osc2.stop(now + 0.9);

        setTimeout(() => {
          resolve();
        }, 900);
      } catch (err) {
        console.warn('Audio Context Chime Error:', err);
        resolve();
      }
    });
  }

  // Mengeja nomor antrian agar terbaca natural dalam bahasa Indonesia
  // Contoh: 'A-025' -> 'A dua puluh lima' atau 'A nol dua lima'
  private formatQueueSpelling(queueNumber: string): string {
    const parts = queueNumber.split('-');
    if (parts.length === 2) {
      const prefix = parts[0];
      const num = parseInt(parts[1], 10);
      return `${prefix}, nomor urut ${num}`;
    }
    return queueNumber;
  }

  // Memanggil nomor antrian dengan suara bahasa Indonesia
  public async announceQueue(queueNumber: string, serviceName: string, roomName: string) {
    if (!this.synth) return;

    try {
      // 1. Bunyikan Bel Chime
      await this.playChime();

      // 2. Batalkan ucapan sebelumnya jika masih antre
      this.synth.cancel();

      const spelledQueue = this.formatQueueSpelling(queueNumber);
      const textToSpeak = `Nomor antrean, ${spelledQueue}. Silakan menuju ke ${serviceName}, ${roomName}.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88; // Sedikit lebih santai agar artikulasi jelas
      utterance.pitch = 1.05;

      // Cari suara bahasa Indonesia jika tersedia di browser
      const voices = this.synth.getVoices();
      const idVoice = voices.find(v => v.lang === 'id-ID' || v.lang.startsWith('id'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

export const speechCaller = new SpeechCaller();
