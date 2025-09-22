import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ButtonProps extends MotionProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  whileHover,
  whileTap,
  ...props
}) => {
  // Base classes
  let baseClasses = 'font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none ';
  
  // Variant classes
  switch (variant) {
    case 'primary':
      baseClasses += 'bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white hover:from-ethiopia-yellow hover:to-ethiopia-green ';
      break;
    case 'secondary':
      baseClasses += 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ';
      break;
    case 'outline':
      baseClasses += 'border border-ethiopia-green dark:border-ethiopia-yellow text-ethiopia-green dark:text-ethiopia-yellow hover:bg-ethiopia-green/10 dark:hover:bg-ethiopia-yellow/10 ';
      break;
  }
  
  // Size classes
  switch (size) {
    case 'sm':
      baseClasses += 'px-3 py-1.5 text-sm ';
      break;
    case 'md':
      baseClasses += 'px-4 py-2 text-base ';
      break;
    case 'lg':
      baseClasses += 'px-6 py-3 text-lg ';
      break;
  }
  
  // Disabled state
  if (disabled) {
    baseClasses += 'opacity-50 cursor-not-allowed ';
  }
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${className}`;
  
  return (
    <motion.button
      whileHover={disabled ? {} : (whileHover || { scale: 1.05 })}
      whileTap={disabled ? {} : (whileTap || { scale: 0.95 })}
      className={combinedClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;