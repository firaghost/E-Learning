import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import Button from './Button';
import { Rating } from '../types/Rating';
import { deleteReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from '../utils/dateUtils';

interface ReviewCardProps {
  review: Rating;
  onReviewUpdated?: (review: Rating) => void;
  onReviewDeleted?: (reviewId: string) => void;
  onEditClick?: (review: Rating) => void;
  showActions?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReviewUpdated,
  onReviewDeleted,
  onEditClick,
  showActions = true,
}) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwnReview = user?.id === review.user_id;
  const reviewDate = new Date(review.created_at);
  const updatedDate = review.updated_at ? new Date(review.updated_at) : null;

  const handleDelete = async () => {
    if (!isOwnReview) return;

    setIsDeleting(true);
    try {
      await deleteReview(review.id);
      onReviewDeleted?.(review.id);
    } catch (error) {
      console.error('Failed to delete review:', error);
      // You might want to show an error message here
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    if (isOwnReview && onEditClick) {
      onEditClick(review);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-semibold">
            {review.user_name.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {review.user_name}
              {isOwnReview && (
                <span className="ml-2 text-xs bg-ethiopia-green/10 text-ethiopia-green dark:bg-ethiopia-yellow/10 dark:text-ethiopia-yellow px-2 py-1 rounded-full">
                  Your Review
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(reviewDate, { addSuffix: true })}
                {updatedDate && (
                  <span className="ml-1">(edited)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && isOwnReview && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              className="text-xs"
            >
              Edit
            </Button>
            
            {!showDeleteConfirm ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Confirm'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Content */}
      {review.review && (
        <div className="mt-3">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.review}
          </p>
        </div>
      )}

      {/* Helpful Actions (for future implementation) */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Helpful
          </button>
          
          <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
