import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types/Course';
import { Comment } from '../types/Comment';
import { Rating } from '../types/Rating';
import { getCourseById, enrollInCourse } from '../services/courseService';
import { getCourseComments, createComment } from '../services/commentService';
import { getCourseRatings, submitRating, getCourseRatingStats } from '../services/ratingService';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      
      try {
        const [courseData, commentsData, ratingsData] = await Promise.all([
          getCourseById(id),
          getCourseComments(id),
          getCourseRatings(id)
        ]);
        
        setCourse(courseData || null);
        setComments(commentsData);
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user || !course) return;
    
    try {
      await enrollInCourse(course.id, user.id);
      setEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course || !newComment.trim()) return;

    try {
      const comment = await createComment({
        course_id: course.id,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar,
        content: newComment.trim(),
        parent_id: undefined
      });
      
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course || userRating === 0) return;

    try {
      const rating = await submitRating({
        course_id: course.id,
        user_id: user.id,
        user_name: user.name,
        rating: userRating,
        review: userReview.trim() || undefined
      });
      
      setRatings([rating, ...ratings.filter(r => r.user_id !== user.id)]);
      setShowRatingForm(false);
      setUserRating(0);
      setUserReview('');
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <svg
              className={`h-5 w-5 ${
                star <= rating ? 'text-ethiopia-yellow' : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethiopia-green"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
          <Link to="/education" className="text-ethiopia-green hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-green/10 text-ethiopia-green dark:bg-ethiopia-yellow/10 dark:text-ethiopia-yellow">
                  {course.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {course.difficulty_level}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold">
                    {course.instructor_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{course.instructor_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {renderStars(course.average_rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({course.total_ratings} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-ethiopia-green dark:text-ethiopia-yellow mb-2">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.enrollment_count} students enrolled
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Level:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{course.difficulty_level}</span>
                  </div>
                </div>
                
                {user ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolled}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      enrolled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white hover:shadow-lg'
                    }`}
                  >
                    {enrolled ? 'Enrolled' : 'Enroll Now'}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white text-center rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Login to Enroll
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ratings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ratings & Reviews</h2>
            {user && (
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="px-4 py-2 bg-ethiopia-green text-white rounded-lg hover:bg-ethiopia-yellow transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {showRatingForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleRatingSubmit}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                {renderStars(userRating, true, setUserRating)}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="Share your thoughts about this course..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={userRating === 0}
                  className="px-4 py-2 bg-ethiopia-green text-white rounded-lg hover:bg-ethiopia-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {rating.user_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{rating.user_name}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(rating.rating)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {rating.created_at.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {rating.review && (
                  <p className="text-gray-600 dark:text-gray-400 ml-11">{rating.review}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h2>

          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Join the discussion..."
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-ethiopia-green text-white rounded-lg hover:bg-ethiopia-yellow transition-colors"
              >
                Post Comment
              </button>
            </form>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="h-10 w-10 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.user_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{comment.user_name}</p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {comment.created_at.toLocaleDateString()}
                    </span>
                    {comment.is_edited && (
                      <span className="text-xs text-gray-400">(edited)</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-ethiopia-green transition-colors">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-2 4h2m0 0h2m-2 0v2m0-2v-2" />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-gray-500 hover:text-ethiopia-green transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;
