import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createJob } from '../services/jobService';
import { Job } from '../types/Job';

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    tags: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        posted_by: user.id
      };

      await createJob(jobData);
      
      alert('Job posted successfully! It will be visible to all job seekers for free.');
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to post job. Please try again.');
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
            <span className="text-ethiopia-green dark:text-ethiopia-yellow font-medium">Create Opportunity</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post <span className="bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">Job Opening</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with talented Ethiopian professionals - completely free job posting
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
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g. Software Developer, Marketing Manager"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g. Addis Ababa, Remote"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills/Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="React, JavaScript, Marketing, Design (comma separated)"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate multiple tags with commas
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
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
                    Free Job Posting
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your job posting will be visible to all job seekers on our platform at no cost. Help grow Ethiopia's job market!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate('/jobs')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateJob;
