export type UserRole = 'student' | 'tutor' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}