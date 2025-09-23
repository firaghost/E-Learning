export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  content_url: string;
  created_by: string; // user id
  instructor_name: string;
  duration: string; // e.g., "4 weeks", "2 hours"
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  thumbnail_url?: string;
  price: number; // 0 for free courses
  enrollment_count: number;
  average_rating: number;
  total_ratings: number;
  is_published: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: Date;
  progress: number; // 0-100
  completed_at?: Date;
  last_accessed?: Date;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  order: number;
  duration: string;
  is_free_preview: boolean;
}
