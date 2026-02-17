export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface AppointmentWithDetails {
  id: string;
  patient?: Patient | null;
  doctor?: Doctor | null;
  dateTime?: string | null;
  status: AppointmentStatus;
  department?: string | null;
}