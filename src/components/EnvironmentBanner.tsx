import React from 'react';
import { isDemo, config } from '../config/environment';

const EnvironmentBanner: React.FC = () => {
  if (!isDemo()) {
    return null; // Don't show banner in production
  }

  return (
    <div className="bg-gradient-to-r from-ethiopia-yellow to-ethiopia-green text-white py-2 px-4 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">🚀</span>
        <span>
          <strong>Demo Mode</strong> - This is a showcase version. 
          Try logging in with: <code className="bg-black/20 px-1 rounded">admin@grownet.et</code> / <code className="bg-black/20 px-1 rounded">admin123</code>
        </span>
        <span className="text-lg">✨</span>
      </div>
    </div>
  );
};

export default EnvironmentBanner;
