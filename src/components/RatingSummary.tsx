import React from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { RatingStats } from '../types/Rating';

interface RatingSummaryProps {
  ratingStats: RatingStats;
  className?: string;
  showDistribution?: boolean;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  ratingStats,
  className = '',
  showDistribution = true,
}) => {
  const { average_rating, total_ratings, rating_distribution } = ratingStats;

  if (total_ratings === 0) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to review this course!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {/* Overall Rating */}
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {average_rating.toFixed(1)}
          </div>
          <StarRating rating={average_rating} size="lg" showValue={false} />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total_ratings} review{total_ratings !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-ethiopia-green dark:text-ethiopia-yellow">
                {Math.round((rating_distribution[5] + rating_distribution[4]) / total_ratings * 100)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Positive Reviews
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                {Math.round(rating_distribution[5] / total_ratings * 100)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                5-Star Reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {showDistribution && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rating Distribution
          </h4>
          
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = rating_distribution[stars as keyof typeof rating_distribution];
            const percentage = total_ratings > 0 ? (count / total_ratings) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{stars}</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow h-2 rounded-full"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {((rating_distribution[5] + rating_distribution[4]) / total_ratings * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Recommend this course
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {average_rating >= 4.5 ? 'Excellent' : average_rating >= 4 ? 'Very Good' : average_rating >= 3 ? 'Good' : average_rating >= 2 ? 'Fair' : 'Poor'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Overall Quality
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {total_ratings >= 100 ? '100+' : total_ratings}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Reviews
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RatingSummary;
