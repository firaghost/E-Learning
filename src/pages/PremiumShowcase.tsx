import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PremiumShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Hero Section with Premium Design */}
      <section className="relative overflow-hidden">
        <div className="pattern-habesha-premium absolute inset-0"></div>
        <div className="relative container mx-auto px-6 py-24">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold gradient-text-premium mb-8">
              ሰላም
            </h1>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-obsidian mb-6">
              Ethiopian Learning Excellence
            </h2>
            <p className="font-body text-xl md:text-2xl text-slate max-w-3xl mx-auto mb-12 leading-relaxed">
              Where ancient wisdom meets modern innovation. A premium learning platform 
              designed for ambitious Ethiopian professionals ready to shape the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="btn-premium btn-premium-primary text-lg px-8 py-4">
                <span>🚀</span>
                Begin Your Journey
              </button>
              <button className="btn-premium btn-premium-outline text-lg px-8 py-4">
                <span>📚</span>
                Explore Courses
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 float-animation">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 float-animation" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 float-animation" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl font-bold text-obsidian mb-6">
              Premium Learning Experience
            </h2>
            <p className="font-body text-xl text-slate max-w-2xl mx-auto">
              Crafted with attention to every detail, designed for excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Personalized Learning Paths',
                description: 'AI-powered curriculum tailored to your career goals and learning style',
                gradient: 'from-emerald-500 to-blue-600'
              },
              {
                icon: '👨‍🏫',
                title: 'World-Class Ethiopian Mentors',
                description: 'Learn from successful professionals who understand your cultural context',
                gradient: 'from-yellow-500 to-red-500'
              },
              {
                icon: '🌍',
                title: 'Global Opportunities',
                description: 'Connect with international markets while staying rooted in Ethiopian values',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '💼',
                title: 'Career Acceleration',
                description: 'Direct pathways to high-paying jobs and entrepreneurial success',
                gradient: 'from-blue-500 to-indigo-600'
              },
              {
                icon: '🤝',
                title: 'Professional Network',
                description: 'Join an exclusive community of ambitious Ethiopian professionals',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                icon: '📈',
                title: 'Measurable Results',
                description: 'Track your progress with detailed analytics and achievement badges',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card-premium interactive-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-premium-colored`}>
                  {feature.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-obsidian mb-4">
                  {feature.title}
                </h3>
                <p className="font-body text-slate leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-5xl font-bold text-white mb-6">
                Explore Our Platform
              </h2>
              <p className="font-body text-xl text-gray-300 max-w-2xl mx-auto">
                Discover the features that make learning extraordinary
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { id: 'overview', label: 'Overview', icon: '🏠' },
                { id: 'courses', label: 'Courses', icon: '📚' },
                { id: 'mentors', label: 'Mentors', icon: '👨‍🏫' },
                { id: 'community', label: 'Community', icon: '🤝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-900 shadow-premium'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              className="card-premium-glass p-8 rounded-3xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="font-display text-4xl font-bold text-white mb-6">
                      Your Success Story Starts Here
                    </h3>
                    <p className="font-body text-gray-300 text-lg leading-relaxed mb-8">
                      Join thousands of Ethiopian professionals who have transformed their careers 
                      through our premium learning platform. From software engineering to business 
                      leadership, we provide the tools and community you need to excel.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold gradient-text-gold-premium">10,000+</div>
                        <div className="font-body text-gray-400">Active Learners</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold gradient-text-premium">500+</div>
                        <div className="font-body text-gray-400">Expert Mentors</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="pattern-diamond-premium w-full h-80 rounded-2xl flex items-center justify-center">
                      <div className="text-8xl animate-pulse">🇪🇹</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div>
                  <h3 className="font-display text-4xl font-bold text-white mb-8 text-center">
                    Premium Course Catalog
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Full-Stack Development', students: '2,500+', rating: 4.9, price: '$299' },
                      { title: 'Digital Marketing Mastery', students: '1,800+', rating: 4.8, price: '$199' },
                      { title: 'Data Science & AI', students: '3,200+', rating: 4.9, price: '$399' }
                    ].map((course, index) => (
                      <div key={index} className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="font-heading text-xl font-bold text-white mb-4">{course.title}</h4>
                        <div className="flex justify-between items-center text-gray-300 mb-4">
                          <span>{course.students} students</span>
                          <span>⭐ {course.rating}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-2xl gradient-text-gold-premium">{course.price}</span>
                          <button className="btn-premium btn-premium-primary px-4 py-2 text-sm">
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'mentors' && (
                <div>
                  <h3 className="font-display text-4xl font-bold text-white mb-8 text-center">
                    World-Class Ethiopian Mentors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { name: 'Dr. Almaz Tadesse', role: 'Senior Software Engineer @ Google', experience: '15+ years' },
                      { name: 'Dawit Mekonnen', role: 'Product Manager @ Microsoft', experience: '12+ years' },
                      { name: 'Hanan Ahmed', role: 'Data Scientist @ Netflix', experience: '10+ years' }
                    ].map((mentor, index) => (
                      <div key={index} className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                          👨‍💼
                        </div>
                        <h4 className="font-heading text-xl font-bold text-white mb-2">{mentor.name}</h4>
                        <p className="font-body text-gray-300 mb-2">{mentor.role}</p>
                        <p className="font-body text-gray-400 text-sm">{mentor.experience}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="text-center">
                  <h3 className="font-display text-4xl font-bold text-white mb-8">
                    Join Our Thriving Community
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="font-heading text-xl font-bold text-white mb-4">Weekly Networking Events</h4>
                        <p className="font-body text-gray-300">Connect with fellow learners and industry professionals</p>
                      </div>
                      <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="font-heading text-xl font-bold text-white mb-4">Career Support</h4>
                        <p className="font-body text-gray-300">Get help with job applications, interviews, and career planning</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                        <div className="text-6xl">🤝</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Skill Tree Visualization */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl font-bold text-obsidian mb-6">
              Your Learning Journey
            </h2>
            <p className="font-body text-xl text-slate max-w-2xl mx-auto">
              Visualize your progress through our structured learning paths
            </p>
          </motion.div>

          <div className="skill-tree-premium max-w-4xl mx-auto">
            <div className="relative h-96 flex items-center justify-center">
              {/* Skill Nodes */}
              <div className="absolute top-10 left-1/4">
                <div className="skill-node-premium completed">
                  🌱
                </div>
                <div className="text-center mt-4 font-semibold text-white">Foundations</div>
              </div>
              
              <div className="absolute top-10 right-1/4">
                <div className="skill-node-premium completed">
                  💻
                </div>
                <div className="text-center mt-4 font-semibold text-white">Programming</div>
              </div>
              
              <div className="absolute bottom-10 left-1/3">
                <div className="skill-node-premium">
                  🚀
                </div>
                <div className="text-center mt-4 font-semibold text-white">Advanced</div>
              </div>
              
              <div className="absolute bottom-10 right-1/3">
                <div className="skill-node-premium">
                  👑
                </div>
                <div className="text-center mt-4 font-semibold text-white">Mastery</div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                <path
                  d="M 200 80 Q 300 150 400 80"
                  stroke="url(#skillGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
                <path
                  d="M 200 80 Q 250 200 300 320"
                  stroke="url(#skillGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
                <path
                  d="M 400 80 Q 450 200 500 320"
                  stroke="url(#skillGradient)"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Transform Your Future?
            </h2>
            <p className="font-body text-xl text-white/90 mb-12 leading-relaxed">
              Join the next generation of Ethiopian leaders. Start your premium learning journey today 
              and unlock opportunities you never thought possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="btn-premium btn-premium-gold text-xl px-10 py-5 shimmer-effect">
                <span>🎯</span>
                Start Free Trial
              </button>
              <button className="btn-premium bg-white/20 text-white border-2 border-white/30 hover:bg-white hover:text-purple-900 text-xl px-10 py-5">
                <span>📞</span>
                Schedule Demo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="font-display text-3xl font-bold text-white mb-2">30-Day</div>
                <div className="font-body text-white/80">Money-Back Guarantee</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-white mb-2">24/7</div>
                <div className="font-body text-white/80">Premium Support</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-white mb-2">Lifetime</div>
                <div className="font-body text-white/80">Community Access</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loading Demo */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl font-bold text-obsidian mb-8">
            Premium Loading Experience
          </h3>
          <div className="loading-premium">
            <div className="coffee-bean-premium"></div>
            <div className="coffee-bean-premium"></div>
            <div className="coffee-bean-premium"></div>
          </div>
          <p className="font-body text-slate mt-4">Ethiopian coffee-inspired loading animation</p>
        </div>
      </section>
    </div>
  );
};

export default PremiumShowcase;
