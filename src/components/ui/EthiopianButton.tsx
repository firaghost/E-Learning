import React from 'react';
import { motion } from 'framer-motion';

interface EthiopianButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const EthiopianButton: React.FC<EthiopianButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 transform focus-ring inline-flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:-translate-y-0.5';
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { y: 0 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading && (
        <div className="loading-coffee">
          <div className="coffee-bean"></div>
          <div className="coffee-bean"></div>
          <div className="coffee-bean"></div>
        </div>
      )}
      {!loading && children}
    </motion.button>
  );
};

export default EthiopianButton;
