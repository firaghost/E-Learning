import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description: string;
  tags?: string[];
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, tags, onClick, className = '', children }) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/70 dark:border-gray-700/50 p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-ethiopia-green/10 to-ethiopia-yellow/10 text-ethiopia-green dark:text-ethiopia-yellow"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
};

export default Card;