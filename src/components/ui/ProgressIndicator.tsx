import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bar' | 'circle' | 'skill';
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'bar',
  label,
  showPercentage = true,
  animated = true,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);
  
  const sizeClasses = {
    sm: { bar: 'h-1', circle: 'w-12 h-12', text: 'text-xs' },
    md: { bar: 'h-2', circle: 'w-16 h-16', text: 'text-sm' },
    lg: { bar: 'h-3', circle: 'w-20 h-20', text: 'text-base' },
    xl: { bar: 'h-4', circle: 'w-24 h-24', text: 'text-lg' },
  };
  
  if (variant === 'circle') {
    const radius = size === 'sm' ? 20 : size === 'md' ? 28 : size === 'lg' ? 36 : 44;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (displayValue / 100) * circumference;
    
    return (
      <div className={`progress-circle ${sizeClasses[size].circle} ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="ethiopiaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--ethiopia-emerald)" />
              <stop offset="100%" stopColor="var(--ethiopia-gold)" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="progress-circle-bg"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className="progress-circle-fill"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {showPercentage && (
              <div className={`font-bold text-charcoal ${sizeClasses[size].text}`}>
                {Math.round(displayValue)}%
              </div>
            )}
            {label && (
              <div className={`text-slate ${sizeClasses[size].text === 'text-xs' ? 'text-xs' : 'text-xs'}`}>
                {label}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'skill') {
    return (
      <div className={`${className}`}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <span className={`font-medium text-charcoal ${sizeClasses[size].text}`}>
              {label}
            </span>
            {showPercentage && (
              <span className={`text-slate ${sizeClasses[size].text}`}>
                {Math.round(displayValue)}%
              </span>
            )}
          </div>
        )}
        
        <div className={`progress-bar ${sizeClasses[size].bar}`}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${displayValue}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>
    );
  }
  
  // Default bar variant
  return (
    <div className={`${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={`font-medium text-charcoal ${sizeClasses[size].text}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-slate ${sizeClasses[size].text}`}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`progress-bar ${sizeClasses[size].bar}`}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
