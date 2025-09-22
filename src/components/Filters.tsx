import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
}

interface FiltersProps {
  options: FilterOption[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({ options, onSelect, selectedValue, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(option.value)}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedValue === option.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
};

export default Filters;