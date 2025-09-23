import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createCourse } from '../services/courseService';
import { Course } from '../types/Course';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content_url: '',
    instructor_name: user?.name || '',
    duration: '',
    difficulty_level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    tags: '',
    thumbnail_url: '',
    price: 0,
    is_published: false
  });

  const categories = [
    'History',
    'Language Learning',
    'Culinary Arts',
    'Mathematics',
    'Business',
    'Technology',
    'Science',
    'Arts & Culture',
    'Health & Wellness',
    'Agriculture',
    'Engineering',
    'Literature'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a course');
      return;
    }

    setLoading(true);
    try {
      const courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        created_by: user.id,
        instructor_name: user.name,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        difficulty_level: formData.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced',
        price: parseFloat(formData.price.toString()),
        enrollment_count: 0,
        average_rating: 0,
        total_ratings: 0,
        is_published: true
      };

      const newCourse = await createCourse(courseData);
      alert('Course created successfully!');
      navigate(`/courses/${newCourse.id}`);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You must be logged in to create a course.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-ethiopia-green text-white rounded-lg hover:bg-ethiopia-yellow transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Course
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your knowledge with the GrowNet community by creating an engaging course.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe what students will learn in this course"
              />
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 4 weeks, 2 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (ETB)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0 for free"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor_name"
                value={formData.instructor_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your name as it will appear to students"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Content URL
              </label>
              <input
                type="url"
                name="content_url"
                value={formData.content_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Link to course materials, videos, or documents"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="URL to course thumbnail image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-ethiopia-green focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Separate tags with commas (e.g., history, culture, ethiopia)"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tags help students find your course more easily
              </p>
            </div>

            {/* Publishing Options */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-ethiopia-green focus:ring-ethiopia-green border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Publish course immediately
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                If unchecked, the course will be saved as a draft and can be published later
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Tips for Creating a Great Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Clear Description</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Write a detailed description that explains what students will learn and achieve.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Fair Pricing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Set a competitive price that reflects the value and quality of your course content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🏷️ Relevant Tags</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use relevant tags to help students discover your course through search.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Attractive Thumbnail</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use a high-quality, relevant image that represents your course content.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCourse;
