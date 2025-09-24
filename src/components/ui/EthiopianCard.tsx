import React from 'react';
import { motion } from 'framer-motion';

interface EthiopianCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'feature' | 'course' | 'tutor';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const EthiopianCard: React.FC<EthiopianCardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}) => {
  const baseClasses = 'transition-all duration-300';
  
  const variantClasses = {
    default: 'card',
    feature: 'card-feature',
    course: 'card-course',
    tutor: 'card-tutor',
  };
  
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-medium cursor-pointer' : '';
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0
    },
    hover: hover ? { 
      y: -4
    } : {}
  };
  
  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default EthiopianCard;
