import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import { useAuth } from '../context/AuthContext';
import { getAllResources } from '../services/resourceService';
import { Resource } from '../types/Resource';
import Button from '../components/Button';

const Education: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
        setFilteredResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let result = resources;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(resource => resource.category === selectedCategory);
    }
    
    setFilteredResources(result);
  }, [searchQuery, selectedCategory, resources]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResource(null);
  };

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];

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
            <span className="text-ethiopia-green dark:text-ethiopia-yellow font-medium">Learning Resources</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Education <span className="bg-clip-text text-transparent bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow">Hub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our collection of free learning resources to advance your skills and knowledge in Ethiopia
          </p>
        </motion.div>

        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex-1 max-w-2xl">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search resources..." 
                className="w-full"
              />
            </div>
            {isAuthenticated && (
              <div className="flex-shrink-0">
                <Link to="/education/create">
                  <Button variant="primary">
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Resource
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="mb-8">
            <Filters
              options={categories.map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
              }))}
              onSelect={handleCategorySelect}
              selectedValue={selectedCategory}
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
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/70 dark:border-gray-700/50 p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleResourceClick(resource)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{resource.title}</h3>
                      </div>
                      <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-xs px-2 py-1 rounded-full">
                        FREE
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{resource.created_at?.toLocaleDateString() || 'N/A'}</span>
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

          {!loading && filteredResources.length === 0 && (
            <div className="mt-10 text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No resources found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-6">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
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

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {showModal && selectedResource && (
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedResource.title}
                    </h3>
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
                  <span className="inline-block bg-ethiopia-green/10 dark:bg-ethiopia-green/30 text-ethiopia-green dark:text-ethiopia-yellow text-sm px-3 py-1 rounded-full">
                    FREE RESOURCE
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {selectedResource.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedResource.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" className="w-full">
                      Access Free Resource
                    </Button>
                  </a>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Education;