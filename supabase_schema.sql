-- =========================================================
-- SKEMA DATABASE APLIKASI NOMOR ANTRIAN KLINIK SEHAT
-- Framework: Supabase (PostgreSQL) + Realtime Replication
-- =========================================================

-- 1. Buat Tabel Layanan (Services / Poli)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(5) NOT NULL UNIQUE,          -- 'A', 'B', 'F'
    name VARCHAR(100) NOT NULL,               -- 'Poli Umum', 'Poli Gigi', 'Farmasi'
    room_name VARCHAR(50) NOT NULL,           -- 'Ruang 1', 'Ruang 2', 'Loket Obat'
    description TEXT,
    estimated_wait_minutes INT DEFAULT 15,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Buat Tabel Profil & Akun Petugas Loket
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'petugas',
    role_title VARCHAR(100) NOT NULL DEFAULT 'Petugas Loket & Pendaftaran',
    room_name VARCHAR(50) DEFAULT 'Meja Loket Pendaftaran',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Buat Tabel Antrian Pasien (Queues)
CREATE TABLE IF NOT EXISTS public.queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    service_code VARCHAR(5) NOT NULL,         -- 'A', 'B', 'F'
    queue_number VARCHAR(20) NOT NULL,        -- 'A-025', 'B-012'
    sequence_number INT NOT NULL,             -- 25 (nomor urut per hari)
    patient_name VARCHAR(150) NOT NULL,
    patient_nik VARCHAR(30),
    patient_phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- 'waiting', 'calling', 'serving', 'completed', 'skipped', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT now(),
    called_at TIMESTAMPTZ,
    serving_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    queue_date DATE DEFAULT CURRENT_DATE
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_queues_date_status ON public.queues(queue_date, status);
CREATE INDEX IF NOT EXISTS idx_queues_service ON public.queues(service_id, queue_date);

-- 4. Aktifkan Realtime pada Tabel
ALTER PUBLICATION supabase_realtime ADD TABLE public.queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_profiles;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public all access on queues" ON public.queues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access on staff_profiles" ON public.staff_profiles FOR SELECT USING (true);

-- 6. Seed Data Layanan Poli
INSERT INTO public.services (code, name, room_name, description, estimated_wait_minutes)
VALUES
    ('A', 'Poli Umum', 'Ruang 1', 'Layanan pemeriksaan kesehatan umum dan konsultasi dokter', 15),
    ('B', 'Poli Gigi', 'Ruang 2', 'Layanan kesehatan gigi, penambalan, dan perawatan mulut', 20),
    ('F', 'Farmasi', 'Loket Obat', 'Layanan pengambilan resep dan obat-obatan', 10)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    room_name = EXCLUDED.room_name,
    estimated_wait_minutes = EXCLUDED.estimated_wait_minutes;

-- 7. Seed Data Akun Petugas Loket Klinik
INSERT INTO public.staff_profiles (email, name, role, role_title, room_name)
VALUES
    ('petugas@kliniksehat.com', 'Petugas Loket Klinik', 'petugas', 'Petugas Pendaftaran & Loket Antrean', 'Meja Loket Pendaftaran')
ON CONFLICT (email) DO NOTHING;
