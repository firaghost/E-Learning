export interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  content_url: string;
  created_by: string; // user id
  created_at?: Date;
  updated_at?: Date;
}