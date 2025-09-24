import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TutorFlipCardProps {
  tutor: {
    id: string;
    name: string;
    avatar: string;
    specialization: string;
    rating: number;
    experience: string;
    bio: string;
    skills: string[];
    hourlyRate: number;
    availability: string;
  };
  onBookSession?: (tutorId: string) => void;
  className?: string;
}

const TutorFlipCard: React.FC<TutorFlipCardProps> = ({
  tutor,
  onBookSession,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleBookSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookSession?.(tutor.id);
  };
  
  return (
    <div 
      className={`card-tutor ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div 
        className="card-tutor-inner"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Front of card */}
        <div className="card-tutor-front bg-white">
          <div className="flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-ethiopia-emerald">
              <img 
                src={tutor.avatar} 
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-h5 font-display font-bold text-charcoal mb-2">
              {tutor.name}
            </h3>
            
            <p className="text-body-sm text-slate mb-3">
              {tutor.specialization}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-ethiopia-gold">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(tutor.rating) ? 'text-ethiopia-gold' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-body-sm text-slate">
                {tutor.rating.toFixed(1)}
              </span>
            </div>
            
            <div className="badge badge-ethiopia mb-4">
              {tutor.experience}
            </div>
            
            <div className="mt-auto">
              <p className="text-caption text-ash">
                Hover to see more details
              </p>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div className="card-tutor-back" style={{ transform: 'rotateY(180deg)' }}>
          <div className="flex flex-col h-full">
            <h3 className="text-h5 font-display font-bold mb-3">
              About {tutor.name}
            </h3>
            
            <p className="text-body-sm mb-4 flex-grow">
              {tutor.bio}
            </p>
            
            <div className="mb-4">
              <h4 className="text-h6 font-semibold mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {tutor.skills.slice(0, 4).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {tutor.skills.length > 4 && (
                  <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                    +{tutor.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-body-sm font-semibold">
                  ${tutor.hourlyRate}/hour
                </p>
                <p className="text-caption opacity-80">
                  {tutor.availability}
                </p>
              </div>
            </div>
            
            <motion.button
              className="btn-accent w-full"
              onClick={handleBookSession}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Session
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorFlipCard;
