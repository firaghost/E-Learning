import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Define footer items based on user role
  const getFooterItems = () => {
    const baseItems = [
      { name: 'Home', path: '/' },
      { name: 'Education', path: '/education' },
      { name: 'Jobs', path: '/jobs' },
      { name: 'Tutoring', path: '/tutoring' },
      { name: 'Contact', path: '/contact' }
    ];

    if (!isAuthenticated) {
      return baseItems;
    }

    // Role-specific footer items
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Courses', path: '/education' },
          { name: 'Job Board', path: '/jobs' },
          { name: 'Find Tutors', path: '/tutoring' },
          { name: 'Contact', path: '/contact' }
        ];
      case 'tutor':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Sessions', path: '/tutoring' },
          { name: 'Resources', path: '/education' },
          { name: 'Contact', path: '/contact' }
        ];
      case 'employer':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Jobs', path: '/jobs' },
          { name: 'Post Job', path: '/jobs/create' },
          { name: 'Contact', path: '/contact' }
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Education', path: '/education' },
          { name: 'Jobs', path: '/jobs' },
          { name: 'Tutoring', path: '/tutoring' },
          { name: 'Contact', path: '/contact' }
        ];
      default:
        return baseItems;
    }
  };

  const footerItems = getFooterItems();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-ethiopia-green to-ethiopia-yellow opacity-20"></div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">
                GrowNet
              </span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
              Empowering Ethiopian learners with free access to quality education, job opportunities, and tutoring services.
            </p>
            
            {/* Enhanced social media section */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="flex space-x-6">
                <motion.a
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-ethiopia-green dark:hover:text-ethiopia-yellow transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-300">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-ethiopia-green to-ethiopia-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-ethiopia-green dark:hover:text-ethiopia-yellow transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-300">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-ethiopia-green to-ethiopia-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </motion.a>
                <motion.a
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-ethiopia-green dark:hover:text-ethiopia-yellow transition-colors duration-200"
                >
                  <span className="sr-only">GitHub</span>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-300">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-ethiopia-green to-ethiopia-yellow opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-2" aria-label="Footer">
              {footerItems.map((item) => (
                <motion.div 
                  key={item.path} 
                  whileHover={{ x: 5 }}
                  className="inline-block"
                >
                  <Link 
                    to={item.path} 
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-ethiopia-green dark:hover:text-ethiopia-yellow transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Enhanced copyright and additional info */}
          <div className="md:text-right space-y-4">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Subscribe to get updates on new courses and features.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-ethiopia-green dark:focus:ring-ethiopia-yellow focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-r-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Join
                </motion.button>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-base text-gray-500 dark:text-gray-400">
                &copy; 2025 E-Learning Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;