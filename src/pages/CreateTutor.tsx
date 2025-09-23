import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createTutor } from '../services/tutorService';
import { Tutor } from '../types/Tutor';

const CreateTutor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    level: '',
    description: '',
    contact_info: '',
    experience: '',
    rating: 5.0,
    hourly_rate: 500,
    availability: [] as string[],
    specializations: [] as string[],
    languages: [] as string[]
  });

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Amharic',
    'History',
    'Geography',
    'Programming',
    'Computer Science',
    'Business',
    'Economics',
    'Art',
    'Music',
    'Other'
  ];

  const levels = [
    'Elementary',
    'High School',
    'University',
    'Professional',
    'All Levels'
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
      const tutorData: Omit<Tutor, 'id' | 'created_at' | 'updated_at'> = {
        ...formData,
        created_by: user.id,
        // Set default values for new required fields
        availability: formData.availability.length > 0 ? formData.availability : ['Monday', 'Wednesday', 'Friday'],
        specializations: formData.specializations.length > 0 ? formData.specializations : [formData.subject],
        languages: formData.languages.length > 0 ? formData.languages : ['Amharic', 'English']
      };

      await createTutor(tutorData);
      
      alert('Tutor profile created successfully! Students can now find and book sessions with you for free.');
      navigate('/tutoring');
    } catch (error) {
      console.error('Error creating tutor profile:', error);
      alert('Failed to create tutor profile. Please try again.');
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
            <span className="text-ethiopia-green dark:text-ethiopia-yellow font-medium">Become an Educator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">Tutor Profile</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your expertise and help Ethiopian students learn - all tutoring sessions are completely free
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your full name as you'd like students to see it"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select your subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject.toLowerCase()}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teaching Level *
                </label>
                <select
                  id="level"
                  name="level"
                  required
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select teaching level</option>
                  {levels.map(level => (
                    <option key={level} value={level.toLowerCase()}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Information *
              </label>
              <input
                type="email"
                id="contact_info"
                name="contact_info"
                required
                value={formData.contact_info}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="your.email@example.com"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Students will use this to contact you for sessions
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About You *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell students about your background, teaching experience, and what makes you a great tutor..."
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
                    Free Tutoring Community
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    All tutoring sessions on our platform are completely free. You're contributing to Ethiopia's educational growth by sharing your knowledge!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate('/tutoring')}
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
                {loading ? 'Creating Profile...' : 'Create Tutor Profile'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTutor;
