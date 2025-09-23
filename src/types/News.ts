export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  thumbnail_url?: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  views: number;
  likes: number;
  created_at: Date;
  updated_at?: Date;
  published_at?: Date;
}

export interface NewsComment {
  id: string;
  news_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  parent_id?: string; // for replies
  likes: number;
  created_at: Date;
  updated_at?: Date;
}
