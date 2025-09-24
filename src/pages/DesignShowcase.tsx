import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EthiopianButton from '../components/ui/EthiopianButton';
import EthiopianCard from '../components/ui/EthiopianCard';
import SkillTree from '../components/ui/SkillTree';
import TutorFlipCard from '../components/ui/TutorFlipCard';
import ProgressIndicator from '../components/ui/ProgressIndicator';

const DesignShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Sample data for components
  const sampleSkills = [
    {
      id: 'html',
      name: 'HTML Basics',
      icon: '🌐',
      completed: true,
      x: 100,
      y: 150,
      description: 'Learn the fundamentals of HTML markup and structure'
    },
    {
      id: 'css',
      name: 'CSS Styling',
      icon: '🎨',
      completed: true,
      prerequisites: ['html'],
      x: 300,
      y: 150,
      description: 'Master CSS for beautiful and responsive web designs'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '⚡',
      completed: false,
      prerequisites: ['html', 'css'],
      x: 500,
      y: 150,
      description: 'Add interactivity and dynamic behavior with JavaScript'
    },
    {
      id: 'react',
      name: 'React Framework',
      icon: '⚛️',
      completed: false,
      prerequisites: ['javascript'],
      x: 300,
      y: 300,
      description: 'Build modern user interfaces with React'
    }
  ];

  const sampleTutor = {
    id: '1',
    name: 'Dr. Almaz Tadesse',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    specialization: 'Software Engineering',
    rating: 4.9,
    experience: '8+ years',
    bio: 'Experienced software engineer with expertise in full-stack development, cloud architecture, and mentoring. Passionate about helping students achieve their career goals.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript'],
    hourlyRate: 45,
    availability: 'Available weekends'
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-pattern-habesha">
      {/* Hero Section */}
      <section className="container-responsive py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-display font-display font-bold gradient-text-ethiopia mb-6">
            Ethiopian Learning Platform
          </h1>
          <p className="text-h4 font-body text-slate max-w-3xl mx-auto mb-8">
            A modern, culturally-resonant design system that empowers young Ethiopian professionals, 
            students, and early-career job seekers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <EthiopianButton variant="primary" size="lg">
              Explore Courses
            </EthiopianButton>
            <EthiopianButton variant="secondary" size="lg">
              Find Tutors
            </EthiopianButton>
            <EthiopianButton variant="accent" size="lg">
              Join Community
            </EthiopianButton>
          </div>
        </motion.div>
      </section>

      {/* Color Palette Section */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Ethiopian Heritage Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <EthiopianCard className="text-center">
            <div className="w-16 h-16 bg-ethiopia-emerald rounded-xl mx-auto mb-4"></div>
            <h3 className="text-h5 font-display font-semibold mb-2">Emerald</h3>
            <p className="text-body-sm text-slate">#00A651</p>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <div className="w-16 h-16 bg-ethiopia-gold rounded-xl mx-auto mb-4"></div>
            <h3 className="text-h5 font-display font-semibold mb-2">Gold</h3>
            <p className="text-body-sm text-slate">#F4B942</p>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <div className="w-16 h-16 bg-ethiopia-crimson rounded-xl mx-auto mb-4"></div>
            <h3 className="text-h5 font-display font-semibold mb-2">Crimson</h3>
            <p className="text-body-sm text-slate">#E63946</p>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <div className="w-16 h-16 bg-ethiopia-sapphire rounded-xl mx-auto mb-4"></div>
            <h3 className="text-h5 font-display font-semibold mb-2">Sapphire</h3>
            <p className="text-body-sm text-slate">#2E86AB</p>
          </EthiopianCard>
        </div>
      </section>

      {/* Button Showcase */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Interactive Buttons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center space-y-4">
            <h3 className="text-h5 font-display font-semibold">Primary</h3>
            <EthiopianButton variant="primary">Enroll Now</EthiopianButton>
            <EthiopianButton variant="primary" size="sm">Small</EthiopianButton>
            <EthiopianButton variant="primary" size="lg">Large</EthiopianButton>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-h5 font-display font-semibold">Secondary</h3>
            <EthiopianButton variant="secondary">Learn More</EthiopianButton>
            <EthiopianButton variant="secondary" size="sm">Small</EthiopianButton>
            <EthiopianButton variant="secondary" size="lg">Large</EthiopianButton>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-h5 font-display font-semibold">Accent</h3>
            <EthiopianButton variant="accent">Book Session</EthiopianButton>
            <EthiopianButton variant="accent" size="sm">Small</EthiopianButton>
            <EthiopianButton variant="accent" size="lg">Large</EthiopianButton>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-h5 font-display font-semibold">Ghost</h3>
            <EthiopianButton variant="ghost">Browse</EthiopianButton>
            <EthiopianButton variant="ghost" size="sm">Small</EthiopianButton>
            <EthiopianButton variant="ghost" size="lg">Large</EthiopianButton>
          </div>
        </div>
        
        <div className="text-center">
          <EthiopianButton 
            variant="primary" 
            loading={loading}
            onClick={handleLoadingDemo}
          >
            {loading ? 'Processing...' : 'Demo Loading State'}
          </EthiopianButton>
        </div>
      </section>

      {/* Card Showcase */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Card Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EthiopianCard variant="default">
            <div className="icon-container">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-h4 font-display font-bold mb-3">Default Card</h3>
            <p className="text-body text-slate">
              Clean and simple card design with subtle hover effects and Ethiopian color accents.
            </p>
          </EthiopianCard>
          
          <EthiopianCard variant="feature">
            <div className="icon-container secondary">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-h4 font-display font-bold mb-3">Feature Card</h3>
            <p className="text-body text-slate">
              Special gradient border effect that highlights important features and services.
            </p>
          </EthiopianCard>
          
          <EthiopianCard variant="course">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop" 
              alt="Course" 
              className="w-full h-48 object-cover rounded-t-2xl -m-6 mb-4"
            />
            <div className="px-6 pb-6">
              <h3 className="text-h4 font-display font-bold mb-2">Course Card</h3>
              <p className="text-body text-slate mb-4">
                Enhanced hover animations perfect for course listings and educational content.
              </p>
              <div className="flex justify-between items-center">
                <span className="badge badge-ethiopia">Beginner</span>
                <span className="text-h5 font-bold text-ethiopia-emerald">$29</span>
              </div>
            </div>
          </EthiopianCard>
        </div>
      </section>

      {/* Progress Indicators */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Progress Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EthiopianCard>
            <h3 className="text-h5 font-display font-semibold mb-6">Skill Progress</h3>
            <div className="space-y-4">
              <ProgressIndicator value={85} label="React Development" variant="skill" />
              <ProgressIndicator value={70} label="Node.js Backend" variant="skill" />
              <ProgressIndicator value={60} label="Database Design" variant="skill" />
              <ProgressIndicator value={45} label="DevOps & Deployment" variant="skill" />
            </div>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <h3 className="text-h5 font-display font-semibold mb-6">Overall Progress</h3>
            <ProgressIndicator 
              value={75} 
              variant="circle" 
              size="xl"
              label="Course Completion"
            />
          </EthiopianCard>
          
          <EthiopianCard>
            <h3 className="text-h5 font-display font-semibold mb-6">Learning Goals</h3>
            <div className="space-y-4">
              <ProgressIndicator value={100} label="HTML & CSS" variant="bar" size="sm" />
              <ProgressIndicator value={80} label="JavaScript" variant="bar" size="sm" />
              <ProgressIndicator value={65} label="React Framework" variant="bar" size="sm" />
              <ProgressIndicator value={30} label="Backend Development" variant="bar" size="sm" />
            </div>
          </EthiopianCard>
        </div>
      </section>

      {/* Tutor Flip Cards */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Interactive Tutor Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TutorFlipCard 
            tutor={sampleTutor}
            onBookSession={(id) => alert(`Booking session with tutor ${id}`)}
          />
          
          <TutorFlipCard 
            tutor={{
              ...sampleTutor,
              id: '2',
              name: 'Eng. Dawit Mekonnen',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              specialization: 'Data Science',
              rating: 4.8,
              skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'TensorFlow'],
              hourlyRate: 50,
              bio: 'Data scientist with 6+ years of experience in machine learning, analytics, and AI solutions for Ethiopian businesses.'
            }}
            onBookSession={(id) => alert(`Booking session with tutor ${id}`)}
          />
          
          <TutorFlipCard 
            tutor={{
              ...sampleTutor,
              id: '3',
              name: 'Dr. Hanan Ahmed',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
              specialization: 'Digital Marketing',
              rating: 4.7,
              skills: ['SEO', 'Social Media', 'Content Strategy', 'Analytics', 'PPC'],
              hourlyRate: 40,
              availability: 'Available evenings',
              bio: 'Digital marketing expert helping Ethiopian businesses grow their online presence and reach global markets.'
            }}
            onBookSession={(id) => alert(`Booking session with tutor ${id}`)}
          />
        </div>
        <p className="text-center text-body text-slate mt-8">
          Hover over the cards to see the flip animation and detailed information
        </p>
      </section>

      {/* Skill Tree */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Interactive Skill Tree
        </h2>
        <EthiopianCard variant="feature" className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-h3 font-display font-bold mb-4">
              Web Development Learning Path
            </h3>
            <p className="text-body text-slate max-w-2xl mx-auto">
              Track your progress through our structured learning path. Complete prerequisites 
              to unlock advanced skills and build your expertise step by step.
            </p>
          </div>
          
          <div className="relative" style={{ height: '400px' }}>
            <SkillTree 
              skills={sampleSkills}
              onSkillClick={(skill) => {
                alert(`Clicked on ${skill.name}: ${skill.description}`);
              }}
            />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-body-sm text-slate">
              Click on any skill node to learn more about the requirements and curriculum
            </p>
          </div>
        </EthiopianCard>
      </section>

      {/* Typography Showcase */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Typography System
        </h2>
        <EthiopianCard>
          <div className="space-y-6">
            <div>
              <h1 className="text-display font-display font-bold gradient-text-ethiopia">
                Display Text
              </h1>
              <p className="text-body-sm text-slate">64px - Hero titles and major headings</p>
            </div>
            
            <div>
              <h1 className="text-h1 font-display font-bold">Heading 1</h1>
              <p className="text-body-sm text-slate">48px - Page titles</p>
            </div>
            
            <div>
              <h2 className="text-h2 font-display font-semibold">Heading 2</h2>
              <p className="text-body-sm text-slate">36px - Section titles</p>
            </div>
            
            <div>
              <h3 className="text-h3 font-display font-medium">Heading 3</h3>
              <p className="text-body-sm text-slate">30px - Subsection titles</p>
            </div>
            
            <div>
              <p className="text-body-lg font-body">
                Large body text (18px) - Important content and introductions
              </p>
            </div>
            
            <div>
              <p className="text-body font-body">
                Regular body text (16px) - Standard content and descriptions
              </p>
            </div>
            
            <div>
              <p className="text-body-sm font-body text-slate">
                Small body text (14px) - Secondary information and metadata
              </p>
            </div>
            
            <div>
              <p className="text-caption font-body text-ash">
                Caption text (12px) - Labels, captions, and fine print
              </p>
            </div>
          </div>
        </EthiopianCard>
      </section>

      {/* Animation Examples */}
      <section className="container-responsive py-16">
        <h2 className="text-h2 font-display font-bold text-center mb-12">
          Micro-Interactions & Animations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <EthiopianCard className="text-center hover-bounce">
            <div className="animate-float mb-4">
              <span className="text-6xl">🚀</span>
            </div>
            <h3 className="text-h4 font-display font-bold mb-3">Hover Bounce</h3>
            <p className="text-body text-slate">
              Gentle bounce animation on hover for interactive elements
            </p>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <div className="loading-coffee mb-6">
              <div className="coffee-bean"></div>
              <div className="coffee-bean"></div>
              <div className="coffee-bean"></div>
            </div>
            <h3 className="text-h4 font-display font-bold mb-3">Coffee Loading</h3>
            <p className="text-body text-slate">
              Playful Ethiopian coffee-inspired loading animation
            </p>
          </EthiopianCard>
          
          <EthiopianCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 loading-pulse gradient-ethiopia rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">✨</span>
            </div>
            <h3 className="text-h4 font-display font-bold mb-3">Pulse Glow</h3>
            <p className="text-body text-slate">
              Subtle pulsing glow effect for highlighting important elements
            </p>
          </EthiopianCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-responsive py-16 text-center">
        <div className="gradient-ethiopia rounded-2xl p-8 text-white">
          <h2 className="text-h2 font-display font-bold mb-4">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-body-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Ethiopian learners who are advancing their careers with our 
            modern, culturally-resonant platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <EthiopianButton variant="accent" size="lg">
              Get Started Today
            </EthiopianButton>
            <EthiopianButton variant="ghost" size="lg" className="text-white border-white hover:bg-white hover:text-ethiopia-emerald">
              Learn More
            </EthiopianButton>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignShowcase;
