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
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/70 dark:border-gray-700/50 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
    >
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
};

export default Card;