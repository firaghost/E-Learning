import { Rating, RatingStats } from '../types/Rating';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { isDemo } from '../config/environment';

// Demo review data
const demoReviews: Rating[] = [
  {
    id: '1',
    course_id: '1',
    user_id: '2',
    user_name: 'Jane Smith',
    rating: 5,
    review: 'Excellent course! Very comprehensive and well-structured. The instructor explains concepts clearly.',
    created_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    course_id: '1',
    user_id: '3',
    user_name: 'Bob Johnson',
    rating: 4,
    review: 'Great content, but could use more practical examples. Overall very good.',
    created_at: new Date('2024-01-20'),
  },
  {
    id: '3',
    course_id: '1',
    user_id: '4',
    user_name: 'Alice Brown',
    rating: 5,
    review: 'Amazing course! Learned so much and the pace was perfect.',
    created_at: new Date('2024-01-25'),
  },
  {
    id: '4',
    course_id: '2',
    user_id: '2',
    user_name: 'Jane Smith',
    rating: 4,
    review: 'Good introduction to the topic. Would recommend for beginners.',
    created_at: new Date('2024-02-01'),
  },
  {
    id: '5',
    course_id: '2',
    user_id: '4',
    user_name: 'Alice Brown',
    rating: 3,
    review: 'Decent course but felt a bit rushed in some sections.',
    created_at: new Date('2024-02-05'),
  },
];

// Initialize demo data
if (isDemo()) {
  const storedReviews = DemoDataStore.get('reviews', demoReviews);
  if (storedReviews.length === 0) {
    DemoDataStore.set('reviews', demoReviews);
  }
}

export interface SubmitReviewRequest {
  course_id: string;
  rating: number;
  review?: string;
}

// Calculate rating statistics for a course
const calculateRatingStats = (reviews: Rating[], courseId: string): RatingStats => {
  const courseReviews = reviews.filter(r => r.course_id === courseId);
  
  if (courseReviews.length === 0) {
    return {
      course_id: courseId,
      average_rating: 0,
      total_ratings: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / courseReviews.length;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  courseReviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  return {
    course_id: courseId,
    average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    total_ratings: courseReviews.length,
    rating_distribution: distribution
  };
};

export const reviewService = {
  // Get all reviews for a course
  getCourseReviews: async (courseId: string): Promise<Rating[]> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      return reviews.filter((review: Rating) => review.course_id === courseId)
        .sort((a: Rating, b: Rating) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Production mode - real API call
    const response = await ApiAdapter.get<Rating[]>(`/courses/${courseId}/reviews`);
    return response;
  },

  // Get rating statistics for a course
  getCourseRatingStats: async (courseId: string): Promise<RatingStats> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      return calculateRatingStats(reviews, courseId);
    }

    // Production mode - real API call
    const response = await ApiAdapter.get<RatingStats>(`/courses/${courseId}/rating-stats`);
    return response;
  },

  // Submit a new review
  submitReview: async (reviewData: SubmitReviewRequest): Promise<Rating> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Check if user already reviewed this course
      const existingReview = reviews.find((r: Rating) => 
        r.course_id === reviewData.course_id && r.user_id === currentUser.id
      );

      if (existingReview) {
        throw new Error('You have already reviewed this course. You can update your existing review.');
      }

      const newReview: Rating = {
        id: `review_${Date.now()}`,
        course_id: reviewData.course_id,
        user_id: currentUser.id,
        user_name: currentUser.name,
        rating: reviewData.rating,
        review: reviewData.review,
        created_at: new Date(),
      };

      reviews.push(newReview);
      DemoDataStore.set('reviews', reviews);

      return newReview;
    }

    // Production mode - real API call
    const response = await ApiAdapter.authenticatedRequest<Rating>(`/courses/${reviewData.course_id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });

    return response;
  },

  // Update an existing review
  updateReview: async (reviewId: string, reviewData: Partial<SubmitReviewRequest>): Promise<Rating> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      const reviewIndex = reviews.findIndex((r: Rating) => r.id === reviewId);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (reviews[reviewIndex].user_id !== currentUser.id) {
        throw new Error('You can only update your own reviews');
      }

      reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        ...reviewData,
        updated_at: new Date(),
      };

      DemoDataStore.set('reviews', reviews);
      return reviews[reviewIndex];
    }

    // Production mode - real API call
    const response = await ApiAdapter.authenticatedRequest<Rating>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });

    return response;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      const reviewIndex = reviews.findIndex((r: Rating) => r.id === reviewId);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (reviews[reviewIndex].user_id !== currentUser.id) {
        throw new Error('You can only delete your own reviews');
      }

      reviews.splice(reviewIndex, 1);
      DemoDataStore.set('reviews', reviews);
      return;
    }

    // Production mode - real API call
    await ApiAdapter.authenticatedRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Get user's review for a specific course
  getUserCourseReview: async (courseId: string): Promise<Rating | null> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      const userReview = reviews.find((r: Rating) => 
        r.course_id === courseId && r.user_id === currentUser.id
      );

      return userReview || null;
    }

    // Production mode - real API call
    try {
      const response = await ApiAdapter.authenticatedRequest<Rating>(`/courses/${courseId}/my-review`);
      return response;
    } catch (error) {
      // If no review found, return null
      return null;
    }
  },

  // Get all reviews by a user
  getUserReviews: async (userId?: string): Promise<Rating[]> => {
    if (isDemo()) {
      const reviews = DemoDataStore.get('reviews', demoReviews);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const targetUserId = userId || currentUser.id;
      
      return reviews.filter((review: Rating) => review.user_id === targetUserId)
        .sort((a: Rating, b: Rating) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Production mode - real API call
    const endpoint = userId ? `/users/${userId}/reviews` : '/my-reviews';
    const response = await ApiAdapter.authenticatedRequest<Rating[]>(endpoint);
    return response;
  },
};

// Export individual functions for easier importing
export const {
  getCourseReviews,
  getCourseRatingStats,
  submitReview,
  updateReview,
  deleteReview,
  getUserCourseReview,
  getUserReviews,
} = reviewService;
