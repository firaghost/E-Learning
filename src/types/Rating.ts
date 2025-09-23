export interface Rating {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  rating: number; // 1-5 stars
  review?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface RatingStats {
  course_id: string;
  average_rating: number;
  total_ratings: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
