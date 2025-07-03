import { useEffect } from 'react';
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

/**
 * Reports web vitals metrics
 * @param onPerfEntry - Callback function to handle performance entries
 */
export const reportWebVitals = (
  onPerfEntry?: (metric: { name: string; value: number }) => void
) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getLCP(onPerfEntry); // Largest Contentful Paint
    getFCP(onPerfEntry); // First Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
};

/**
 * Hook to report web vitals metrics
 * @param onPerfEntry - Callback function to handle performance entries
 */
export const useWebVitals = (
  onPerfEntry?: (metric: { name: string; value: number }) => void
) => {
  useEffect(() => {
    reportWebVitals(onPerfEntry);
  }, [onPerfEntry]);
};

/**
 * Checks if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Lazy loads an image with proper error handling
 */
export const lazyLoadImage = (
  src: string,
  options: {
    onLoad?: () => void;
    onError?: (error: Error) => void;
  } = {}
): void => {
  const img = new Image();
  img.src = src;
  
  if (options.onLoad) {
    img.onload = options.onLoad;
  }
  
  if (options.onError) {
    img.onerror = () => {
      options.onError?.(new Error(`Failed to load image: ${src}`));
    };
  }
};

export default {
  reportWebVitals,
  useWebVitals,
  prefersReducedMotion,
  lazyLoadImage
};