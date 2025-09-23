export interface Tutor {
  id: string;
  name: string;
  subject: string;
  description: string;
  level: string;
  contact_info: string;
  experience: string;
  rating: number;
  hourly_rate: number;
  availability: string[];
  specializations: string[];
  languages: string[];
  created_by: string; // user id
  created_at?: Date;
  updated_at?: Date;
}