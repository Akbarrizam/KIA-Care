import type { Service, QueueItem } from '../types/queue';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    code: 'A',
    name: 'Poli Umum',
    room_name: 'Ruang 1',
    description: 'Layanan pemeriksaan umum dan konsultasi dokter',
    estimated_wait_minutes: 15,
    is_active: true,
  },
  {
    id: 'srv-2',
    code: 'B',
    name: 'Poli Gigi',
    room_name: 'Ruang 2',
    description: 'Layanan kesehatan gigi dan mulut',
    estimated_wait_minutes: 20,
    is_active: true,
  },
  {
    id: 'srv-3',
    code: 'F',
    name: 'Farmasi',
    room_name: 'Loket Obat',
    description: 'Layanan pengambilan resep dan obat-obatan',
    estimated_wait_minutes: 10,
    is_active: true,
  },
];

// Data antrean awal bersih (kosong)
export const INITIAL_QUEUES: QueueItem[] = [];
