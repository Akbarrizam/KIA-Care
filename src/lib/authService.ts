import type { StaffProfile } from '../types/queue';
import { supabase, isSupabaseConfigured } from './supabase';

export const DEFAULT_STAFF_PROFILE: StaffProfile = {
  id: 'staff-petugas-01',
  email: 'petugas@kliniksehat.com',
  name: 'Petugas Loket Klinik',
  role: 'petugas',
  roleTitle: 'Petugas Pendaftaran & Loket Antrean',
  roomName: 'Meja Loket Pendaftaran',
};

const STAFF_SESSION_KEY = 'klinik_staff_auth_session_v1';

export const authService = {
  // Mendapatkan sesi petugas yang sedang aktif tersimpan
  getCurrentSession(): StaffProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STAFF_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Login Petugas (Mendukung Supabase Auth + Fallback Petugas)
  async login(email: string, password: string): Promise<StaffProfile> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Jika Supabase terhubung, coba login dengan Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (!error && data?.user) {
          const profile: StaffProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            name: data.user.user_metadata?.full_name || 'Petugas Loket Klinik',
            role: 'petugas',
            roleTitle: 'Petugas Loket & Pendaftaran',
            roomName: 'Meja Loket Pendaftaran',
          };
          this.saveSession(profile);
          return profile;
        }
      } catch (err) {
        console.warn('Supabase Auth warning:', err);
      }
    }

    // 2. Fallback instan akun petugas
    const profile: StaffProfile = {
      ...DEFAULT_STAFF_PROFILE,
      email: cleanEmail,
    };

    this.saveSession(profile);
    return profile;
  },

  // Simpan sesi ke localStorage
  saveSession(profile: StaffProfile): void {
    localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(profile));
  },

  // Logout Petugas
  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Fallback
      }
    }
    localStorage.removeItem(STAFF_SESSION_KEY);
  },
};
