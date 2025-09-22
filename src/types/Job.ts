export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
  posted_by: string; // user id
  created_at?: Date;
  updated_at?: Date;
}