import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const TutorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock tutor data
  const [tutorStats] = useState({
    totalStudents: 24,
    activeStudents: 18,
    totalSessions: 156,
    thisWeekSessions: 8,
    earnings: 2450,
    rating: 4.9,
    upcomingSessions: [
      { id: 1, student: 'Abebe Kebede', subject: 'Mathematics', time: 'Today 2:00 PM', duration: '1 hour' },
      { id: 2, student: 'Hanan Ahmed', subject: 'English', time: 'Tomorrow 10:00 AM', duration: '45 min' },
      { id: 3, student: 'Dawit Tesfaye', subject: 'Physics', time: 'Tomorrow 3:00 PM', duration: '1.5 hours' }
    ],
    recentStudents: [
      { id: 1, name: 'Abebe Kebede', subject: 'Mathematics', progress: 85, lastSession: '2 days ago' },
      { id: 2, name: 'Hanan Ahmed', subject: 'English', progress: 72, lastSession: '1 day ago' },
      { id: 3, name: 'Dawit Tesfaye', subject: 'Physics', progress: 91, lastSession: '3 days ago' }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Function to handle session actions
  const handleJoinSession = (sessionId: number) => {
    alert(`Joining session ID: ${sessionId}`);
    // In a real app, this would navigate to the session or open a video call
  };

  // Function to schedule a new session
  const handleScheduleSession = () => {
    alert('Opening session scheduling interface');
    // In a real app, this would open a scheduling modal or navigate to scheduling page
  };

  // Function to update profile
  const handleUpdateProfile = () => {
    alert('Navigating to profile update page');
    // In a real app, this would navigate to the profile update page
  };

  // Function to view earnings
  const handleViewEarnings = () => {
    alert('Opening earnings report');
    // In a real app, this would open an earnings report or navigate to payments page
  };

  // Function to update availability
  const handleUpdateAvailability = () => {
    alert('Opening availability settings');
    // In a real app, this would open availability settings
  };

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
                Welcome, {user?.name}! 👨‍🏫
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your tutoring sessions and help students succeed
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                Tutor
              </span>
              <div className="flex items-center text-ethiopia-yellow">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{tutorStats.rating}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tutorStats.totalStudents}</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tutorStats.thisWeekSessions}</p>
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
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">ETB {tutorStats.earnings}</p>
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
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tutorStats.activeStudents}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Sessions</h2>
                <button 
                  onClick={handleScheduleSession}
                  className="text-ethiopia-green hover:text-ethiopia-yellow font-medium"
                >
                  Schedule New
                </button>
              </div>
              
              <div className="space-y-4">
                {tutorStats.upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold">
                        {session.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{session.student}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{session.subject} • {session.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{session.time}</p>
                      <button 
                        onClick={() => handleJoinSession(session.id)}
                        className="text-xs text-ethiopia-green hover:text-ethiopia-yellow"
                      >
                        Join Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Student Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Progress</h2>
                <Link to="/tutoring" className="text-ethiopia-green hover:text-ethiopia-yellow font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {tutorStats.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{student.progress}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{student.lastSession}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-90">Total Sessions:</span>
                  <span className="font-bold">{tutorStats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Earnings:</span>
                  <span className="font-bold">ETB {tutorStats.earnings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Rating:</span>
                  <span className="font-bold">⭐ {tutorStats.rating}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleScheduleSession}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Schedule Session</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Book a new tutoring session</div>
                </button>
                <button 
                  onClick={handleUpdateProfile}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Update Profile</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Edit your tutoring profile</div>
                </button>
                <button 
                  onClick={handleViewEarnings}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">View Earnings</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Check payment history</div>
                </button>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Availability Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Currently Available</span>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              <button 
                onClick={handleUpdateAvailability}
                className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Update Availability
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;