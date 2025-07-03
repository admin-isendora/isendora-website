import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParallax } from '@/lib/hamo-utils';
import { prefersReducedMotion } from '@/lib/performance-utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  containerClassName?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.1,
  direction = 'up',
  className = '',
  containerClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get parallax effect from hamo
  const { elementRef, transform } = useParallax({
    speed,
    direction,
    clamp: true,
  });
  
  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }
    
    // Set the element ref from hamo
    if (containerRef.current) {
      elementRef.current = containerRef.current;
    }
    
    // Alternative GSAP implementation
    if (contentRef.current && containerRef.current) {
      gsap.registerPlugin(ScrollTrigger);
      
      const directionMultiplier = direction === 'down' || direction === 'right' ? 1 : -1;
      const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
      
      const parallaxEffect = gsap.fromTo(
        contentRef.current,
        { [axis]: 0 },
        {
          [axis]: `${100 * speed * directionMultiplier}px`,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
      
      return () => {
        parallaxEffect.kill();
      };
    }
  }, [speed, direction, elementRef]);
  
  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${containerClassName}`}
    >
      <div
        ref={contentRef}
        className={`transform ${className}`}
        style={{ transform }}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;