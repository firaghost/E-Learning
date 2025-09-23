import { Comment, CommentReaction } from '../types/Comment';
import commentsData from '../data/comments.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get comments for a course
export const getCourseComments = async (courseId: string): Promise<Comment[]> => {
  await delay(300);
  const courseComments = commentsData.filter(comment => comment.course_id === courseId);
  
  return courseComments.map(comment => ({
    ...comment,
    created_at: new Date(comment.created_at),
    updated_at: comment.updated_at ? new Date(comment.updated_at) : undefined
  })) as Comment[];
};

// Get comment by ID
export const getCommentById = async (id: string): Promise<Comment | undefined> => {
  await delay(200);
  const comment = commentsData.find(comment => comment.id === id);
  if (!comment) return undefined;
  
  return {
    ...comment,
    created_at: new Date(comment.created_at),
    updated_at: comment.updated_at ? new Date(comment.updated_at) : undefined
  } as Comment;
};

// Create a new comment
export const createComment = async (commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'likes' | 'dislikes' | 'is_edited'>): Promise<Comment> => {
  await delay(400);
  
  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    ...commentData,
    likes: 0,
    dislikes: 0,
    is_edited: false,
    created_at: new Date(),
  };
  
  // In a real app, we would save the comment to a database here
  return newComment;
};

// Update a comment
export const updateComment = async (id: string, content: string): Promise<Comment | null> => {
  await delay(400);
  
  const commentIndex = commentsData.findIndex(comment => comment.id === id);
  if (commentIndex === -1) {
    return null;
  }
  
  const existingComment = commentsData[commentIndex];
  const updatedComment = {
    ...existingComment,
    content,
    is_edited: true,
    created_at: new Date(existingComment.created_at),
    updated_at: new Date(),
  };
  
  // In a real app, we would update the comment in the database here
  return updatedComment as Comment;
};

// Delete a comment
export const deleteComment = async (id: string): Promise<boolean> => {
  await delay(300);
  
  const commentIndex = commentsData.findIndex(comment => comment.id === id);
  if (commentIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the comment from the database here
  return true;
};

// Like a comment
export const likeComment = async (commentId: string, userId: string): Promise<CommentReaction> => {
  await delay(200);
  
  const reaction: CommentReaction = {
    id: `reaction_${Date.now()}`,
    comment_id: commentId,
    user_id: userId,
    type: 'like',
    created_at: new Date()
  };
  
  // In a real app, we would save the reaction and update comment likes count
  return reaction;
};

// Dislike a comment
export const dislikeComment = async (commentId: string, userId: string): Promise<CommentReaction> => {
  await delay(200);
  
  const reaction: CommentReaction = {
    id: `reaction_${Date.now()}`,
    comment_id: commentId,
    user_id: userId,
    type: 'dislike',
    created_at: new Date()
  };
  
  // In a real app, we would save the reaction and update comment dislikes count
  return reaction;
};

// Remove reaction from comment
export const removeCommentReaction = async (commentId: string, userId: string): Promise<boolean> => {
  await delay(200);
  
  // In a real app, we would remove the user's reaction from the database
  return true;
};

// Get comment replies
export const getCommentReplies = async (parentId: string): Promise<Comment[]> => {
  await delay(250);
  const replies = commentsData.filter(comment => comment.parent_id === parentId);
  
  return replies.map(comment => ({
    ...comment,
    created_at: new Date(comment.created_at),
    updated_at: comment.updated_at ? new Date(comment.updated_at) : undefined
  })) as Comment[];
};
