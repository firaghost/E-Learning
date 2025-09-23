import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingSummary from './RatingSummary';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import Button from './Button';
import { Rating, RatingStats } from '../types/Rating';
import { 
  getCourseReviews, 
  getCourseRatingStats, 
  getUserCourseReview 
} from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

interface CourseReviewsProps {
  courseId: string;
  className?: string;
  onCourseDataUpdate?: () => void; // Callback to refresh course data
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  courseId,
  className = '',
  onCourseDataUpdate,
}) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [userReview, setUserReview] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Rating | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    loadReviewsData();
  }, [courseId]);

  const loadReviewsData = async () => {
    setLoading(true);
    try {
      const [reviewsData, statsData, userReviewData] = await Promise.all([
        getCourseReviews(courseId),
        getCourseRatingStats(courseId),
        isAuthenticated ? getUserCourseReview(courseId) : Promise.resolve(null),
      ]);

      setReviews(reviewsData);
      setRatingStats(statsData);
      setUserReview(userReviewData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (review: Rating) => {
    if (editingReview) {
      // Update existing review
      setReviews(prev => prev.map(r => r.id === review.id ? review : r));
      setEditingReview(null);
    } else {
      // Add new review
      setReviews(prev => [review, ...prev]);
    }
    
    setUserReview(review);
    setShowReviewForm(false);
    
    // Reload stats to get updated averages
    getCourseRatingStats(courseId).then(setRatingStats);
    
    // Notify parent component to refresh course data
    onCourseDataUpdate?.();
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    setUserReview(null);
    
    // Reload stats to get updated averages
    getCourseRatingStats(courseId).then(setRatingStats);
    
    // Notify parent component to refresh course data
    onCourseDataUpdate?.();
  };

  const handleEditReview = (review: Rating) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const sortedAndFilteredReviews = React.useMemo(() => {
    let filtered = reviews;

    // Filter by rating
    if (filterBy !== 'all') {
      const rating = parseInt(filterBy);
      filtered = reviews.filter(review => review.rating === rating);
    }

    // Sort reviews
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  }, [reviews, sortBy, filterBy]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rating Summary */}
      {ratingStats && (
        <RatingSummary ratingStats={ratingStats} />
      )}

      {/* Review Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ethiopia-green"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>

          {/* Filter Options */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ethiopia-green"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Write Review Button */}
        {isAuthenticated && !userReview && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="whitespace-nowrap"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ReviewForm
              courseId={courseId}
              existingReview={editingReview}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* User's Review (if exists and not editing) */}
      {userReview && !showReviewForm && (
        <div className="border-l-4 border-ethiopia-green pl-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Review
          </h3>
          <ReviewCard
            review={userReview}
            onEditClick={handleEditReview}
            onReviewDeleted={handleReviewDeleted}
            showActions={true}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Reviews ({sortedAndFilteredReviews.length})
          </h3>
          
          {filterBy !== 'all' && (
            <button
              onClick={() => setFilterBy('all')}
              className="text-sm text-ethiopia-green dark:text-ethiopia-yellow hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {sortedAndFilteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400">
              {filterBy !== 'all' ? (
                <>
                  <p className="text-lg font-medium">No {filterBy}-star reviews found</p>
                  <p className="text-sm mt-1">Try adjusting your filter to see more reviews.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">No reviews yet</p>
                  <p className="text-sm mt-1">Be the first to share your experience with this course!</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ReviewCard
                  review={review}
                  onEditClick={handleEditReview}
                  onReviewDeleted={handleReviewDeleted}
                  showActions={false} // Don't show actions for other users' reviews
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
