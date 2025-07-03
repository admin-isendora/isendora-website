import { useEffect, useState, useRef, useCallback } from 'react';
import { useScroll, useResize, useRaf } from '@studio-freight/hamo';

/**
 * Hook for optimized scroll position tracking
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useScroll(({ y }) => {
    setScrollY(y.current);
  });
  
  return scrollY;
};

/**
 * Hook for tracking element position relative to viewport
 * @param options - Options for the hook
 */
export const useElementOnScreen = (options: {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
} = {}) => {
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;
  
  const [isIntersecting, setIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<Element | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        if (once) {
          if (isElementIntersecting && !hasIntersected) {
            setIntersecting(true);
            setHasIntersected(true);
            
            if (elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          }
        } else {
          setIntersecting(isElementIntersecting);
        }
      },
      { root, rootMargin, threshold }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [root, rootMargin, threshold, once, hasIntersected]);
  
  return { elementRef, isIntersecting };
};

/**
 * Hook for tracking window size changes
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useResize(({ width, height }) => {
    setSize({ width, height });
  });
  
  return size;
};

/**
 * Hook for creating smooth animations with requestAnimationFrame
 * @param callback - Animation callback function
 * @param dependencies - Dependencies array for the callback
 */
export const useSmoothAnimation = (
  callback: (time: number, deltaTime: number) => void,
  dependencies: any[] = []
) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);
  
  useRaf((time, deltaTime) => {
    callbackRef.current(time, deltaTime);
  });
};

/**
 * Hook for parallax effect on scroll
 * @param options - Parallax options
 */
export const useParallax = (options: {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  clamp?: boolean;
} = {}) => {
  const { speed = 0.1, direction = 'up', clamp = true } = options;
  
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  
  const scrollY = useScrollPosition();
  const { height: windowHeight } = useWindowSize();
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementHeight = rect.height;
    
    // Calculate how far the element is from the viewport center
    const distanceFromCenter = (elementTop + elementHeight / 2) - (scrollY + windowHeight / 2);
    
    // Calculate parallax offset based on distance from center
    let parallaxOffset = distanceFromCenter * speed;
    
    // Apply direction
    if (direction === 'down') parallaxOffset *= -1;
    
    // Clamp values if needed
    if (clamp) {
      const maxOffset = elementHeight * 0.5;
      parallaxOffset = Math.max(-maxOffset, Math.min(maxOffset, parallaxOffset));
    }
    
    setOffset(parallaxOffset);
  }, [scrollY, windowHeight, speed, direction, clamp]);
  
  return { elementRef, offset, transform: `translate3d(0, ${offset}px, 0)` };
};

export default {
  useScrollPosition,
  useElementOnScreen,
  useWindowSize,
  useSmoothAnimation,
  useParallax,
};