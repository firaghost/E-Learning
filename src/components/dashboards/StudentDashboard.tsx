import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getAllResources } from '../../services/resourceService';
import { getAllTutors } from '../../services/tutorService';
import { Resource } from '../../types/Resource';
import { Tutor } from '../../types/Tutor';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock student progress data
  const [studentProgress] = useState({
    coursesEnrolled: 3,
    coursesCompleted: 1,
    totalHours: 24,
    certificates: 1,
    currentStreak: 7,
    nextSession: 'Tomorrow at 2:00 PM'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesData, tutorsData] = await Promise.all([
          getAllResources(),
          getAllTutors()
        ]);
        
        setResources(resourcesData.slice(0, 3)); // Show only first 3
        setTutors(tutorsData.slice(0, 3)); // Show only first 3
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethiopia-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}! 📚
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Continue your learning journey and achieve your goals
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                Student
              </span>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-ethiopia-green/10">
                <svg className="h-6 w-6 text-ethiopia-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses Enrolled</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentProgress.coursesEnrolled}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-ethiopia-yellow/10">
                <svg className="h-6 w-6 text-ethiopia-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentProgress.coursesCompleted}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentProgress.totalHours}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentProgress.certificates}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                <Link to="/education" className="text-ethiopia-green hover:text-ethiopia-yellow font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div key={resource.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-lg flex items-center justify-center text-white font-bold">
                        {resource.title.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{resource.category}</p>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow h-2 rounded-full" 
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 100)}% Complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Available Tutors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Tutors</h2>
                <Link to="/tutoring" className="text-ethiopia-green hover:text-ethiopia-yellow font-medium">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tutors.map((tutor) => (
                  <div key={tutor.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {tutor.name.charAt(0)}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{tutor.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.subject}</p>
                    <p className="text-xs text-ethiopia-green mt-1">{tutor.level}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Session */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">Next Session</h3>
              <p className="text-sm opacity-90 mb-4">{studentProgress.nextSession}</p>
              <button className="w-full bg-white text-ethiopia-green font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Join Session
              </button>
            </motion.div>

            {/* Learning Streak */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Learning Streak 🔥</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-ethiopia-green mb-2">{studentProgress.currentStreak}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days in a row</p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/education" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Browse Courses</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Find new learning materials</div>
                </Link>
                <Link to="/tutoring" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Book Tutor</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Schedule a learning session</div>
                </Link>
                <Link to="/jobs" className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="font-medium text-gray-900 dark:text-white">Find Jobs</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Explore career opportunities</div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
