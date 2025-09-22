import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createResource } from '../services/resourceService';
import { Resource } from '../types/Resource';
import Button from '../components/Button';

const CreateResource: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content_url: ''
  });

  const categories = [
    'Programming',
    'Mathematics',
    'Science',
    'Language',
    'Business',
    'Arts',
    'Technology',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        created_by: user.id
      };

      await createResource(resourceData);
      
      // Show success message
      alert('Resource created successfully! It will be available for all users to access for free.');
      
      // Navigate back to education page
      navigate('/education');
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-ethiopia-green/10 dark:bg-ethiopia-green/20 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-ethiopia-green rounded-full"></div>
            <span className="text-ethiopia-green dark:text-ethiopia-yellow font-medium">Share Knowledge</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">Learning Resource</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your knowledge with the Ethiopian learning community - completely free for everyone
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/70 dark:border-gray-700/50 p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter a descriptive title for your resource"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource URL *
              </label>
              <input
                type="url"
                id="content_url"
                name="content_url"
                required
                value={formData.content_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/your-resource"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Link to your educational content (PDF, video, website, etc.)
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe what learners will gain from this resource..."
              />
            </div>

            <div className="bg-ethiopia-green/5 dark:bg-ethiopia-green/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-ethiopia-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-ethiopia-green dark:text-ethiopia-yellow">
                    Free Resource Sharing
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your resource will be available to all Ethiopian learners completely free of charge. Help build our learning community!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/education')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Resource'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateResource;
