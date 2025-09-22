export interface Tutor {
  id: string;
  name: string;
  subject: string;
  description: string;
  level: string;
  contact_info: string;
  created_by: string; // user id
  created_at?: Date;
  updated_at?: Date;
}