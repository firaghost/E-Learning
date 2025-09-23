import { Rating, RatingStats } from '../types/Rating';
import ratingsData from '../data/ratings.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get ratings for a course
export const getCourseRatings = async (courseId: string): Promise<Rating[]> => {
  await delay(300);
  const courseRatings = ratingsData.filter(rating => rating.course_id === courseId);
  
  return courseRatings.map(rating => ({
    ...rating,
    created_at: new Date(rating.created_at),
    updated_at: rating.updated_at ? new Date(rating.updated_at) : undefined
  })) as Rating[];
};

// Get rating by user and course
export const getUserCourseRating = async (courseId: string, userId: string): Promise<Rating | undefined> => {
  await delay(200);
  const rating = ratingsData.find(rating => 
    rating.course_id === courseId && rating.user_id === userId
  );
  
  if (!rating) return undefined;
  
  return {
    ...rating,
    created_at: new Date(rating.created_at),
    updated_at: rating.updated_at ? new Date(rating.updated_at) : undefined
  } as Rating;
};

// Create or update a rating
export const submitRating = async (ratingData: Omit<Rating, 'id' | 'created_at' | 'updated_at'>): Promise<Rating> => {
  await delay(400);
  
  // Check if user already rated this course
  const existingRating = ratingsData.find(rating => 
    rating.course_id === ratingData.course_id && rating.user_id === ratingData.user_id
  );
  
  if (existingRating) {
    // Update existing rating
    const updatedRating: Rating = {
      ...existingRating,
      rating: ratingData.rating,
      review: ratingData.review,
      created_at: new Date(existingRating.created_at),
      updated_at: new Date()
    };
    
    // In a real app, we would update the rating in the database here
    return updatedRating;
  } else {
    // Create new rating
    const newRating: Rating = {
      id: `rating_${Date.now()}`,
      ...ratingData,
      created_at: new Date(),
    };
    
    // In a real app, we would save the rating to a database here
    return newRating;
  }
};

// Delete a rating
export const deleteRating = async (id: string): Promise<boolean> => {
  await delay(300);
  
  const ratingIndex = ratingsData.findIndex(rating => rating.id === id);
  if (ratingIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the rating from the database here
  return true;
};

// Get rating statistics for a course
export const getCourseRatingStats = async (courseId: string): Promise<RatingStats> => {
  await delay(250);
  
  const courseRatings = ratingsData.filter(rating => rating.course_id === courseId);
  
  if (courseRatings.length === 0) {
    return {
      course_id: courseId,
      average_rating: 0,
      total_ratings: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const totalRatings = courseRatings.length;
  const sumRatings = courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = sumRatings / totalRatings;
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  courseRatings.forEach(rating => {
    distribution[rating.rating as keyof typeof distribution]++;
  });
  
  return {
    course_id: courseId,
    average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    total_ratings: totalRatings,
    rating_distribution: distribution
  };
};

// Get all ratings by a user
export const getUserRatings = async (userId: string): Promise<Rating[]> => {
  await delay(300);
  const userRatings = ratingsData.filter(rating => rating.user_id === userId);
  
  return userRatings.map(rating => ({
    ...rating,
    created_at: new Date(rating.created_at),
    updated_at: rating.updated_at ? new Date(rating.updated_at) : undefined
  })) as Rating[];
};

// Get recent ratings (for admin dashboard)
export const getRecentRatings = async (limit: number = 10): Promise<Rating[]> => {
  await delay(250);
  
  const sortedRatings = ratingsData
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
  
  return sortedRatings.map(rating => ({
    ...rating,
    created_at: new Date(rating.created_at),
    updated_at: rating.updated_at ? new Date(rating.updated_at) : undefined
  })) as Rating[];
};
