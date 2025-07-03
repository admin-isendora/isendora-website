import React, { useEffect, useRef } from 'react';
import { createSplitTextAnimation } from '@/lib/gsap-utils';
import { prefersReducedMotion } from '@/lib/performance-utils';

interface SplitTextRevealProps {
  children: string;
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  y?: number;
  ease?: string;
  className?: string;
  triggerOnScroll?: boolean;
  delay?: number;
}

const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  children,
  type = 'words',
  stagger = 0.02,
  duration = 0.7,
  y = 20,
  ease = 'power2.out',
  className = '',
  triggerOnScroll = true,
  delay = 0,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);
  
  useEffect(() => {
    if (!textRef.current) return;
    
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }
    
    // Create the split text animation
    const { animation, splitText } = createSplitTextAnimation(`#${textRef.current.id}`, {
      type,
      stagger,
      duration,
      y,
      ease,
      scrollTrigger: triggerOnScroll,
      trigger: `#${textRef.current.id}`,
      start: 'top 80%',
    });
    
    animationRef.current = { animation, splitText };
    
    // If not triggered on scroll, play after delay
    if (!triggerOnScroll && animation) {
      animation.delay(delay);
      animation.play();
    }
    
    return () => {
      if (animationRef.current && animationRef.current.splitText) {
        animationRef.current.splitText.revert();
      }
    };
  }, [children, type, stagger, duration, y, ease, triggerOnScroll, delay]);
  
  // Generate a unique ID for the element
  const id = useRef(`split-text-${Math.random().toString(36).substr(2, 9)}`).current;
  
  return (
    <div
      id={id}
      ref={textRef}
      className={className}
      aria-label={children}
    >
      {children}
    </div>
  );
};

export default SplitTextReveal;