# 🏥 Sistem Informasi & Antrian Terpadu - Klinik Sehat (KIA Care)

Aplikasi manajemen antrean klinik modern berbasis web (*Cross-Platform / PWA*) yang menghubungkan **Dashboard Petugas Loket**, **Layar Antrean Mandiri Pasien (Mobile)**, dan **Pemanggilan Suara Otomatis (Audio Bell & Speech Synthesizer)** secara *realtime* menggunakan **React 19**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.

---

## 🌟 Fitur Utama

### 1. 🖥️ Dashboard Petugas & Dokter
* **🔐 Portal Login Petugas:** Tampilan *split-screen* modern untuk autentikasi petugas loket.
* **🏠 Beranda Ringkasan:** Statistik metrik harian (Total Pasien, Menunggu, Sedang Dilayani, Selesai) dan status antrean per poli.
* **📢 Meja Panggilan Nomor (Calling Station):**
  * Tampilan nomor aktif besar (*big display*) dengan pemilih unit poli (*Poli Umum, Poli Gigi, Farmasi*).
  * Tombol **Panggil Berikutnya** (mengeluarkan suara bel & pemanggil nomor otomatis).
  * Aksi cepat: **Panggil Ulang**, **Selesai**, dan **Lewati Pasien**.
  * Daftar antrean berikutnya (*next in line*) dengan pemanggil langsung.
* **📑 Daftar Antrian (Master Table):** Tabel seluruh antrean dengan pencarian instan (Nama, NIK, No. Antrean) dan filter poli/status.
* **🕒 Riwayat & Audit Log:** Log pasien yang telah selesai dilayani, perhitungan durasi tunggu, tombol **Cetak Log** dan **Export ke file CSV (Excel)**.
* **📊 Laporan & Analisis:** KPI rata-rata waktu tunggu, proporsi kunjungan per poli, analisis jam padat (*peak hours*), dan tombol **Unduh Laporan PDF**.
* **⚙️ Pengaturan Klinik:** Konfigurasi profil klinik, jam operasional, status buka unit pelayanan, uji coba suara speaker, dan reset antrean harian.
* **🖨️ Generator QR Code Pasien:** Modal cetak kartu/standee QR Code yang otomatis menggunakan IP Wi-Fi lokal atau domain live klinik.

---

### 2. 📱 Layar Antrean Mandiri Pasien (Mobile Web)
* **Akses Tanpa Perlu Unduh Aplikasi:** Pasien cukup mengarahkan kamera smartphone ke QR Code di meja loket atau membuka link `/?mode=pasien`.
* **Pilih Poli & Ambil Tiket:** Pasien memilih poli (*Poli Umum, Poli Gigi, Farmasi*), mengisi nama/NIK, dan menerima tiket nomor antrean resmi (contoh: `A-001`).
* **Live Status Tracker:** Memantau nomor yang sedang dipanggil dan sisa orang di depan antrean secara *realtime*.
* **Pembersihan Otomatis:** Saat petugas menekan tombol *Selesai*, tiket aktif otomatis dibersihkan dari layar utama pasien.

---

### 3. 🔊 Voice Synthesizer & Sound Bell
* **Web Audio API Chime Bell:** Nada dering bel sebelum nomor dipanggil (*Ding-Dong*).
* **Indonesian Text-to-Speech:** Membaca nomor antrean secara natural dalam Bahasa Indonesia (contoh: *"Nomor Antrean A-001, silakan menuju ke Poli Umum, Ruang 1"*).

---

### 4. ⚡ Sinkronisasi Realtime & Database (Supabase)
* **PostgreSQL + Supabase Realtime Replication:** Setiap antrean yang diambil dari HP langsung muncul seketika di monitor laptop petugas tanpa perlu refresh.
* **Smart Offline Fallback:** Menggunakan `BroadcastChannel` dan `localStorage` agar sistem tetap berjalan $100\%$ lancar meskipun koneksi internet terputus.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool & Bundler** | Vite 8 |
| **Styling & CSS** | Tailwind CSS v4 |
| **Database & Realtime** | Supabase (PostgreSQL + WebSocket Realtime) |
| **Icons & UI Assets** | Lucide React |
| **QR Code Engine** | qrcode.react |
| **Speech & Audio** | Web Audio API + Web Speech API (Indonesian Voice) |
| **Efek Animasi** | Canvas Confetti & CSS Micro-animations |

---

## 📁 Struktur Direktori

```text
P1 - KIA Care/
├── public/                     # Asset publik & favicon
├── src/
│   ├── components/
│   │   ├── auth/               # StaffLoginScreen & StaffLoadingScreen
│   │   ├── common/             # PatientQrModal & SupabaseConfigModal
│   │   ├── display/            # TvDisplayScreen (Display TV Ruang Tunggu)
│   │   ├── patient/            # Layar HP Pasien (HomeScreen, ServiceSelect, Ticket, LiveStatus, BottomNav)
│   │   └── staff/              # Views Dashboard Petugas
│   │       └── views/          # Beranda, PanggilNomor, DaftarAntrian, Riwayat, Laporan, Pengaturan
│   ├── data/                   # Initial services & empty queue state
│   ├── hooks/                  # useQueueManager (State management & Realtime sync)
│   ├── lib/                    # Supabase client, authService, speechHelper
│   ├── types/                  # TypeScript interface (QueueItem, Service, StaffProfile, PatientTicket)
│   ├── App.tsx                 # Main App Component & Router
│   ├── index.css               # Design system & Tailwind styling
│   └── main.tsx                # Entry point
├── .env.example                # Contoh konfigurasi environment variable
├── supabase_schema.sql         # Skema database PostgreSQL & Realtime Supabase
├── vite.config.ts              # Konfigurasi Vite & host network
└── package.json                # Dependencies & script project
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 18 ke atas) di komputer Anda.

### 2. Instalasi Dependensi
Buka terminal pada folder proyek ini, lalu jalankan:
```bash
npm install
```

### 3. Konfigurasi Database Supabase (Opsional tapi Direkomendasikan)
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buat file `.env` di direktori utama (atau salin dari `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-jwt-key
   ```
3. Buka menu **SQL Editor** di dashboard Supabase, salin seluruh isi file **`supabase_schema.sql`**, lalu klik **Run**.

### 4. Jalankan Aplikasi di Server Lokal
```bash
npm run dev
```
Aplikasi akan aktif dan dapat diakses melalui browser:
* **Dashboard Petugas (Komputer):** `http://localhost:5173`
* **Layar Pasien (Smartphone di Wi-Fi yang sama):** `http://[IP-Komputer]:5173/?mode=pasien`
* **Display TV Ruang Tunggu:** `http://localhost:5173/?mode=tv`

---

## 🔑 Kredensial Login Petugas (Default Demo)

* **Email:** `petugas@kliniksehat.com`
* **Kata Sandi:** `petugas123` *(atau kata sandi apa saja $\ge 4$ karakter)*

---

## 📄 Lisensi
Proyek ini dibuat untuk sistem antrean dan manajemen operasional klinik kesehatan **Klinik Sehat (KIA Care)**. Seluruh hak cipta dilindungi.
