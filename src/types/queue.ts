export type QueueStatus = 'waiting' | 'calling' | 'serving' | 'completed' | 'skipped' | 'cancelled';

export interface StaffProfile {
  id: string;
  name: string;
  role: 'petugas';
  roleTitle: string;
  email: string;
  roomName?: string;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  code: string; // 'A', 'B', 'F'
  name: string; // 'Poli Umum', 'Poli Gigi', 'Farmasi'
  room_name: string; // 'Ruang 1', 'Ruang 2', 'Loket Obat'
  description?: string;
  estimated_wait_minutes: number;
  is_active: boolean;
}

export interface QueueItem {
  id: string;
  service_id?: string;
  service_code: string;
  queue_number: string; // 'A-025'
  sequence_number: number; // 25
  patient_name: string;
  patient_nik?: string;
  patient_phone?: string;
  status: QueueStatus;
  created_at: string;
  called_at?: string | null;
  serving_at?: string | null;
  completed_at?: string | null;
  queue_date?: string;
}

export interface PatientTicket {
  queueId: string;
  queueNumber: string;
  serviceCode: string;
  serviceName: string;
  roomName: string;
  patientName: string;
  patientNik?: string;
  createdAt: string;
}

export interface QueueSummary {
  currentCallingNumber: string | null;
  totalWaiting: number;
  estimatedWaitMinutes: number;
  remainingBeforeUser: number;
}
