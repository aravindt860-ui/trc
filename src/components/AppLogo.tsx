import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import nativeLogo from '../assets/images/trc_logo_1780085219514.png';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function AppLogo({ className = '', size = 'md', showText = false }: AppLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'h-8 w-auto',
    sm: 'h-12 w-auto',
    md: 'h-24 w-auto max-w-[280px]',
    lg: 'h-36 w-auto max-w-[320px]',
    xl: 'h-48 w-auto max-w-[400px]',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div 
        className={`${sizeClasses[size]} relative flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-[1.015]`}
      >
        {!imgError ? (
          <img 
            src={nativeLogo} 
            alt="The Right Choice Logo" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center p-2 shadow-md">
            <ThumbsUp className="text-white w-8 h-8 drop-shadow" strokeWidth={2.5} />
          </div>
        )}
      </div>
      
      {showText && (
        <div className="text-center mt-1">
          <p className="text-[10px] uppercase font-mono tracking-widest text-sky-500 font-bold">
            Corporate Guest House & Stays
          </p>
        </div>
      )}
    </div>
  );
}
