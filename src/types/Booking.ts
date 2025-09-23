export interface Booking {
  id: string;
  student_id: string;
  student_name: string;
  tutor_id: string;
  tutor_name: string;
  subject: string;
  session_type: 'individual' | 'group';
  duration: number; // in minutes
  scheduled_date: Date;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meeting_link?: string;
  notes?: string;
  price: number;
  created_at: Date;
  updated_at?: Date;
}

export interface BookingRequest {
  tutor_id: string;
  subject: string;
  session_type: 'individual' | 'group';
  duration: number;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
}

export interface TutorSession {
  id: string;
  tutor_id: string;
  student_id: string;
  booking_id: string;
  subject: string;
  start_time: Date;
  end_time: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link?: string;
  session_notes?: string;
  student_feedback?: string;
  tutor_feedback?: string;
  rating?: number;
  created_at: Date;
  updated_at?: Date;
}
