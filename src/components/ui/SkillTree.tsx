import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  prerequisites?: string[];
  description?: string;
  x: number;
  y: number;
}

interface SkillTreeProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
  className?: string;
}

const SkillTree: React.FC<SkillTreeProps> = ({
  skills,
  onSkillClick,
  className = '',
}) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    onSkillClick?.(skill);
  };
  
  const isSkillUnlocked = (skill: Skill): boolean => {
    if (!skill.prerequisites || skill.prerequisites.length === 0) return true;
    return skill.prerequisites.every(prereqId => 
      skills.find(s => s.id === prereqId)?.completed
    );
  };
  
  const getConnectionPath = (from: Skill, to: Skill): string => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const midX = from.x + dx / 2;
    const midY = from.y + dy / 2;
    
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  };
  
  return (
    <div className={`skill-tree relative ${className}`}>
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="skillConnection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ethiopia-emerald)" />
            <stop offset="100%" stopColor="var(--ethiopia-gold)" />
          </linearGradient>
        </defs>
        
        {skills.map(skill => 
          skill.prerequisites?.map(prereqId => {
            const prereq = skills.find(s => s.id === prereqId);
            if (!prereq) return null;
            
            return (
              <motion.path
                key={`${prereqId}-${skill.id}`}
                d={getConnectionPath(prereq, skill)}
                stroke="url(#skillConnection)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: isSkillUnlocked(skill) ? 1 : 0.3,
                  opacity: isSkillUnlocked(skill) ? 1 : 0.3
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            );
          })
        )}
      </svg>
      
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          className={`skill-node absolute ${
            skill.completed ? 'completed' : ''
          } ${
            !isSkillUnlocked(skill) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            left: `${skill.x}px`,
            top: `${skill.y}px`,
            zIndex: 10,
          }}
          onClick={() => isSkillUnlocked(skill) && handleSkillClick(skill)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          whileHover={isSkillUnlocked(skill) ? { 
            scale: 1.2,
            transition: { duration: 0.2 }
          } : {}}
          whileTap={isSkillUnlocked(skill) ? { scale: 0.95 } : {}}
        >
          <div className="text-2xl">{skill.icon}</div>
          
          {/* Skill name tooltip */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {skill.name}
          </div>
        </motion.div>
      ))}
      
      {/* Skill Details Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <div className="modal-backdrop" />
            <motion.div
              className="modal-content relative z-10 p-6 max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="icon-container">
                  <span className="text-2xl">{selectedSkill.icon}</span>
                </div>
                <div>
                  <h3 className="text-h4 font-display font-bold text-charcoal">
                    {selectedSkill.name}
                  </h3>
                  <div className={`badge ${
                    selectedSkill.completed ? 'badge-success' : 'badge-warning'
                  }`}>
                    {selectedSkill.completed ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
              
              {selectedSkill.description && (
                <p className="text-body text-slate mb-4">
                  {selectedSkill.description}
                </p>
              )}
              
              {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-h6 font-semibold text-charcoal mb-2">
                    Prerequisites:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.prerequisites.map(prereqId => {
                      const prereq = skills.find(s => s.id === prereqId);
                      return prereq ? (
                        <span
                          key={prereqId}
                          className={`badge ${
                            prereq.completed ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {prereq.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              <button
                className="btn-primary w-full"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillTree;
