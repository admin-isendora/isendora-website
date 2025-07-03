import React, { useEffect, useRef } from 'react';
import { trackMousePosition, createParallaxGradient, createNoiseOverlay } from '@/lib/gradient-utils';

interface GradientBackgroundProps {
  children: React.ReactNode;
  type?: 'mesh' | 'soft' | 'depth' | 'glow' | 'dynamic' | 'parallax' | 'animated';
  isDarkMode?: boolean;
  withNoise?: boolean;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'light' | 'medium' | 'strong';
  interactive?: boolean;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  type = 'mesh',
  isDarkMode = false,
  withNoise = false,
  className = '',
  style = {},
  intensity = 'medium',
  interactive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let cleanup: (() => void) | undefined;
    
    // Apply interactive effects if enabled
    if (interactive) {
      cleanup = trackMousePosition(element);
    }
    
    // Apply parallax effect for certain gradient types
    if (type === 'parallax') {
      const parallaxCleanup = createParallaxGradient(element, 0.1);
      
      // Combine cleanup functions
      const originalCleanup = cleanup;
      cleanup = () => {
        if (originalCleanup) originalCleanup();
        parallaxCleanup();
      };
    }
    
    // Apply noise overlay if enabled
    if (withNoise) {
      const noiseOpacity = intensity === 'light' ? 0.03 : intensity === 'medium' ? 0.05 : 0.08;
      const noiseCleanup = createNoiseOverlay(element, noiseOpacity);
      
      // Combine cleanup functions
      const originalCleanup = cleanup;
      cleanup = () => {
        if (originalCleanup) originalCleanup();
        noiseCleanup();
      };
    }
    
    return cleanup;
  }, [type, interactive, withNoise, intensity]);
  
  // Determine the gradient class based on type and dark mode
  const getGradientClass = () => {
    switch (type) {
      case 'mesh':
        return isDarkMode ? 'mesh-gradient-dark' : 'mesh-gradient-light';
      case 'soft':
        return isDarkMode ? 'gradient-soft-dark' : 'gradient-soft-light';
      case 'depth':
        return isDarkMode ? 'gradient-depth-dark' : 'gradient-depth-light';
      case 'glow':
        return isDarkMode ? 'gradient-glow-dark' : 'gradient-glow-light';
      case 'dynamic':
        return isDarkMode ? 'gradient-dynamic-dark' : 'gradient-dynamic-light';
      case 'parallax':
        return isDarkMode ? 'parallax-gradient-dark' : 'parallax-gradient-light';
      case 'animated':
        return isDarkMode ? 'animated-gradient-dark' : 'animated-gradient-light';
      default:
        return isDarkMode ? 'mesh-gradient-dark' : 'mesh-gradient-light';
    }
  };
  
  // Apply noise class if enabled
  const noiseClass = withNoise ? 'noise-overlay' : '';
  
  return (
    <div 
      ref={containerRef}
      className={`${getGradientClass()} ${noiseClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default GradientBackground;