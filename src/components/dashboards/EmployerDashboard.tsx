import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getAllJobs } from '../../services/jobService';
import { Job } from '../../types/Job';

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock employer data
  const [employerStats] = useState({
    activeJobs: 5,
    totalApplications: 127,
    newApplications: 23,
    hiredCandidates: 8,
    viewsThisMonth: 1250,
    companyRating: 4.7,
    recentApplications: [
      { id: 1, candidate: 'Abebe Kebede', position: 'Software Developer', appliedDate: '2 hours ago', status: 'new' },
      { id: 2, candidate: 'Hanan Ahmed', position: 'Marketing Manager', appliedDate: '5 hours ago', status: 'reviewed' },
      { id: 3, candidate: 'Dawit Tesfaye', position: 'Data Analyst', appliedDate: '1 day ago', status: 'interviewed' }
    ]
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await getAllJobs();
        setJobs(jobsData.slice(0, 4)); // Show only first 4 jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Function to handle viewing job applications
  const handleViewApplications = (jobId: string) => {
    alert(`Viewing applications for job ID: ${jobId}`);
    // In a real app, this would navigate to the applications page for this job
  };

  // Function to handle reviewing an application
  const handleReviewApplication = (applicationId: number) => {
    alert(`Reviewing application ID: ${applicationId}`);
    // In a real app, this would open the application details
  };

  // Function to post a new job
  const handlePostNewJob = () => {
    alert('Navigating to job posting page');
    // In a real app, this would navigate to the job creation page
  };

  // Function to review all applications
  const handleReviewAllApplications = () => {
    alert('Opening applications review interface');
    // In a real app, this would navigate to the applications review page
  };

  // Function to update company profile
  const handleUpdateCompanyProfile = () => {
    alert('Opening company profile update interface');
    // In a real app, this would navigate to the company profile page
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
                Welcome, {user?.name}! 💼
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your job postings and find the best talent in Ethiopia
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                Employer
              </span>
              <div className="flex items-center text-ethiopia-yellow">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{employerStats.companyRating}</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employerStats.activeJobs}</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employerStats.totalApplications}</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Views This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employerStats.viewsThisMonth.toLocaleString()}</p>
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
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hired Candidates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{employerStats.hiredCandidates}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Job Postings</h2>
                <button 
                  onClick={handlePostNewJob}
                  className="bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Post New Job
                </button>
              </div>
              
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ethiopia-green/10 text-ethiopia-green">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.floor(Math.random() * 20) + 5} applications
                        </span>
                        <button 
                          onClick={() => handleViewApplications(job.id)}
                          className="text-ethiopia-green hover:text-ethiopia-yellow text-sm"
                        >
                          View
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Posted {Math.floor(Math.random() * 7) + 1} days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applications</h2>
                <span className="bg-ethiopia-green/10 text-ethiopia-green px-3 py-1 rounded-full text-sm font-medium">
                  {employerStats.newApplications} New
                </span>
              </div>
              
              <div className="space-y-4">
                {employerStats.recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold">
                        {application.candidate.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{application.candidate}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{application.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {application.status}
                        </span>
                        <button 
                          onClick={() => handleReviewApplication(application.id)}
                          className="text-ethiopia-green hover:text-ethiopia-yellow text-sm"
                        >
                          Review
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{application.appliedDate}</p>
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
              <h3 className="text-lg font-bold mb-4">Hiring Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-90">Open Positions:</span>
                  <span className="font-bold">{employerStats.activeJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">New Applications:</span>
                  <span className="font-bold">{employerStats.newApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Success Rate:</span>
                  <span className="font-bold">{Math.round((employerStats.hiredCandidates / employerStats.totalApplications) * 100)}%</span>
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
                  onClick={handlePostNewJob}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Post New Job</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Create a new job posting</div>
                </button>
                <button 
                  onClick={handleReviewAllApplications}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Review Applications</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Check pending applications</div>
                </button>
                <button 
                  onClick={handleUpdateCompanyProfile}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">Company Profile</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Update company information</div>
                </button>
              </div>
            </motion.div>

            {/* Hiring Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 Hiring Tips</h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  • Use clear job titles to attract the right candidates
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Include salary ranges to increase application rates
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Respond to applications within 48 hours
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  • Highlight company culture and benefits
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;