import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import logo from '../Logo.png'; // Import your custom logo

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Education', path: '/education' },
      { name: 'Tutoring', path: '/tutoring' },
      { name: 'News', path: '/news' }
    ];

    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Education', path: '/education' },
        { name: 'Tutoring', path: '/tutoring' },
        { name: 'News', path: '/news' }
      ];
    }

    // Role-specific navigation items
    switch (user?.role) {
      case 'student':
        return baseItems;
      case 'tutor':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Sessions', path: '/tutoring' },
          { name: 'Resources', path: '/education' },
          { name: 'News', path: '/news' },
          { name: 'Create Course', path: '/create-course' }
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Education', path: '/education' },
          { name: 'Tutoring', path: '/tutoring' },
          { name: 'News', path: '/news' },
          { name: 'Create Course', path: '/create-course' },
          { name: 'Create Resource', path: '/education/create' },
          { name: 'Create Tutor', path: '/tutoring/create' }
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
                  <div className="relative">
                    <img src={logo} className="h-12 w-12 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300" alt="E-Learning Platform Logo" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-ethiopia-green to-ethiopia-yellow opacity-20"></div>
                  </div>
                  <div className="ml-3">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">
                      GrowNet
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
              {navItems.map((item) => (
                <motion.div key={item.path} whileHover={{ y: -2 }}>
                  <Link
                    to={item.path}
                    className="relative px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-ethiopia-green dark:hover:text-ethiopia-yellow font-medium transition-all duration-300 group flex items-center"
                  >
                    {item.name}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gradient-to-r from-ethiopia-green/10 to-ethiopia-yellow/10 hover:from-ethiopia-green/20 hover:to-ethiopia-yellow/20 text-ethiopia-green dark:text-ethiopia-yellow transition-all duration-300 focus:outline-none shadow-lg"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.button>
            {isAuthenticated ? (
              <div className="ml-4 relative">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/30 dark:border-gray-700/30">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white shadow-sm">
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user?.name}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow hover:from-ethiopia-yellow hover:to-ethiopia-green shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <motion.div whileHover={{ y: -2 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-ethiopia-green dark:text-ethiopia-yellow hover:text-ethiopia-yellow dark:hover:text-ethiopia-green font-medium transition-all duration-300 rounded-lg hover:bg-ethiopia-green/10 dark:hover:bg-ethiopia-yellow/10"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2, scale: 1.05 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-ethiopia-yellow hover:to-ethiopia-green transition-all duration-300"
                  >
                    Join Free
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;