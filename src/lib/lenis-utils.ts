import Lenis from '@studio-freight/lenis';
import { useEffect, useState } from 'react';

/**
 * Initialize Lenis smooth scrolling
 * @param options - Lenis options
 */
export const initLenis = (options: {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
  syncTouch?: boolean;
  syncTouchLerp?: number;
} = {}) => {
  const {
    duration = 1.2,
    easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation = 'vertical',
    smoothWheel = true,
    smoothTouch = false,
    touchMultiplier = 2,
    infinite = false,
  } = options;

  // Create Lenis instance
  const lenis = new Lenis({
    duration,
    easing,
    orientation,
    gestureOrientation: orientation,
    smoothWheel,
    smoothTouch,
    touchMultiplier,
    infinite,
  });

  // Set up the animation frame
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  // Start the animation loop
  requestAnimationFrame(raf);

  // Add event listener for reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleReducedMotionChange = () => {
    if (mediaQuery.matches) {
      lenis.destroy();
    } else {
      requestAnimationFrame(raf);
    }
  };

  mediaQuery.addEventListener('change', handleReducedMotionChange);
  handleReducedMotionChange();

  return lenis;
};

/**
 * React hook for using Lenis in components
 * @param options - Lenis options
 */
export const useLenis = (options = {}) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const lenisInstance = initLenis(options);
    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return lenis;
};

/**
 * Scroll to a specific element smoothly
 * @param lenis - Lenis instance
 * @param target - Target element or selector
 * @param options - Scroll options
 */
export const scrollTo = (
  lenis: Lenis,
  target: string | HTMLElement,
  options: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    lock?: boolean;
    onComplete?: () => void;
  } = {}
) => {
  lenis.scrollTo(target, options);
};

export default {
  initLenis,
  useLenis,
  scrollTo,
};