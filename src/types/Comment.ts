export interface Comment {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  parent_id?: string; // for replies
  likes: number;
  dislikes: number;
  is_edited: boolean;
  created_at: Date;
  updated_at?: Date;
}

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  type: 'like' | 'dislike';
  created_at: Date;
}
