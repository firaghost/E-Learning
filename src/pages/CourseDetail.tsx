import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Course } from '../types/Course';
import { Comment } from '../types/Comment';
import { getCourseById, enrollInCourse } from '../services/courseService';
import { getCourseComments, createComment } from '../services/commentService';
import { isUserEnrolled } from '../services/enrollmentService';
import CourseReviews from '../components/CourseReviews';
import StarRating from '../components/StarRating';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Function to refresh course data
  const refreshCourseData = async () => {
    if (!id) return;
    
    try {
      const updatedCourse = await getCourseById(id);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
    } catch (error) {
      console.error('Error refreshing course data:', error);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      
      try {
        const [courseData, commentsData] = await Promise.all([
          getCourseById(id),
          getCourseComments(id)
        ]);
        
        setCourse(courseData || null);
        setComments(commentsData);
        
        // Check if user is already enrolled
        if (user && courseData) {
          const userEnrolled = await isUserEnrolled(id, user.id);
          setEnrolled(userEnrolled);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user || !course) return;
    
    try {
      await enrollInCourse(course.id, user.id);
      setEnrolled(true);
      
      // Refresh course data to get updated enrollment count
      await refreshCourseData();
      
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
                    {course.instructor_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{course.instructor_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <StarRating rating={course.average_rating} size="sm" />
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

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <CourseReviews courseId={course.id} onCourseDataUpdate={refreshCourseData} />
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
                  {comment.user_name.split(' ').map((n: string) => n[0]).join('')}
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
