export interface DoctorApplication {
  id: string;
  full_name: string;
  email: string;
  specialization: string;
  experience: number;
  languages: string;
  bio: string;
  cv_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  specialization: string;
  experience: number;
  languages: string;
  bio: string;
  verification_status: "pending" | "approved" | "rejected";
  rating: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "doctor" | "patient";
  onboarding_status: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  session_datetime: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  vr_scene_title: string;
  appointment_link: string | null;
  duration_minutes: number | null;
}

export interface VRScene {
  id: string;
  title: string;
  description: string;
  created_at: string;
}
