import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllTutors } from '../services/tutorService';
import { Tutor } from '../types/Tutor';
import BookingModal from '../components/BookingModal';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';

const Tutoring: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getAllTutors();
        setTutors(data);
        setFilteredTutors(data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  useEffect(() => {
    let result = tutors;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(tutor => 
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      result = result.filter(tutor => tutor.subject === selectedSubject);
    }
    
    setFilteredTutors(result);
  }, [searchQuery, selectedSubject, tutors]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTutor(null);
    setShowBookingModal(false);
  };

  const handleBookSession = () => {
    setShowBookingModal(true);
  };

  // Get unique subjects for filter
  const subjects = ['all', ...Array.from(new Set(tutors.map(t => t.subject)))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-ethiopia-green/10 dark:bg-ethiopia-green/20 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-ethiopia-green rounded-full"></div>
            <span className="text-ethiopia-green dark:text-ethiopia-yellow font-medium">Skills Exchange</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tutoring & <span className="bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">Skills Exchange</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with tutors and exchange skills to accelerate your learning journey in Ethiopia
          </p>
        </motion.div>

        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search tutors..." 
                className="w-full"
              />
            </div>
            <div className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/tutoring/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Become a Tutor
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="mb-8">
            <Filters
              options={subjects.map(subject => ({
                value: subject,
                label: subject.charAt(0).toUpperCase() + subject.slice(1)
              }))}
              onSelect={handleSubjectSelect}
              selectedValue={selectedSubject}
            />
          </div>

          {loading ? (
            <div className="mt-10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethiopia-green"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTutors.map((tutor) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/70 dark:border-gray-700/50 p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleTutorClick(tutor)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{tutor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{tutor.subject} • {tutor.level}</p>
                      </div>
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{tutor.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-xs px-2 py-1 rounded-full">
                        {tutor.subject}
                      </span>
                      <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-xs px-2 py-1 rounded-full">
                        {tutor.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{tutor.created_at?.toLocaleDateString() || 'N/A'}</span>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-ethiopia-green dark:text-ethiopia-yellow hover:text-ethiopia-green/80 dark:hover:text-ethiopia-yellow/80 text-sm font-medium flex items-center"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filteredTutors.length === 0 && (
            <div className="mt-10 text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No tutors found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubject('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Tutor Detail Modal */}
      <AnimatePresence>
        {showModal && selectedTutor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative top-20 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/5 shadow-2xl rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border-white/50 dark:border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                {!showBookingModal ? (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedTutor.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedTutor.subject} • {selectedTutor.level}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-sm px-3 py-1 rounded-full">
                          {selectedTutor.subject}
                        </span>
                        <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-sm px-3 py-1 rounded-full">
                          {selectedTutor.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {selectedTutor.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong>Contact:</strong> {selectedTutor.contact_info}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <button
                          onClick={handleBookSession}
                          className="block w-full text-center bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Book Free Session
                        </button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <button
                          onClick={() => {
                            window.open(`mailto:${selectedTutor.contact_info}`, '_blank');
                          }}
                          className="block w-full text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
                        >
                          Contact Tutor
                        </button>
                      </motion.div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All tutoring sessions are completely free. No payment required.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Book Session with {selectedTutor.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedTutor.subject} • {selectedTutor.level}
                        </p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Preferred Time
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>9:00 AM</option>
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>2:00 PM</option>
                          <option>3:00 PM</option>
                          <option>4:00 PM</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Session Duration
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option>1 hour</option>
                          <option>1.5 hours</option>
                          <option>2 hours</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ethiopia-green focus:border-ethiopia-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Any specific topics or questions you'd like to focus on..."
                        />
                      </div>
                    </form>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <button
                          onClick={() => {
                            alert('Booking request sent! The tutor will contact you soon. All sessions are completely free.');
                            closeModal();
                          }}
                          className="block w-full text-center bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Send Booking Request
                        </button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <button
                          onClick={() => setShowBookingModal(false)}
                          className="block w-full text-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
                        >
                          Back
                        </button>
                      </motion.div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All tutoring sessions are completely free. No payment required.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tutoring;