import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import Button from './Button';
import { Rating } from '../types/Rating';
import { submitReview, updateReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
  courseId: string;
  existingReview?: Rating | null;
  onReviewSubmitted: (review: Rating) => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  existingReview,
  onReviewSubmitted,
  onCancel,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let submittedReview: Rating;

      if (existingReview) {
        // Update existing review
        submittedReview = await updateReview(existingReview.id, {
          rating,
          review: reviewText.trim() || undefined,
        });
      } else {
        // Submit new review
        submittedReview = await submitReview({
          course_id: courseId,
          rating,
          review: reviewText.trim() || undefined,
        });
      }

      onReviewSubmitted(submittedReview);
      
      // Reset form if it's a new review
      if (!existingReview) {
        setRating(0);
        setReviewText('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please log in to submit a review for this course.
        </p>
        <Button variant="secondary" size="sm">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {existingReview ? 'Update Your Review' : 'Write a Review'}
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="lg"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review (Optional)
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this course..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            maxLength={500}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
            {reviewText.length}/500 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {existingReview ? 'Updating...' : 'Submitting...'}
              </div>
            ) : (
              existingReview ? 'Update Review' : 'Submit Review'
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
