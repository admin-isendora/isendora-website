import React, { useState, useEffect, useRef } from 'react';
import { lazyLoadImage } from '@/lib/performance-utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  width,
  height,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!src) return;
    
    let isMounted = true;
    
    // Check if the image is already in the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the image
            lazyLoadImage(src, {
              onLoad: () => {
                if (isMounted) {
                  setCurrentSrc(src);
                  setLoaded(true);
                  if (onLoad) onLoad();
                }
              },
              onError: (error) => {
                if (isMounted && onError) {
                  onError(error);
                }
              },
            });
            
            // Unobserve once we start loading
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading when image is 200px from viewport
        threshold: 0.01,
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      isMounted = false;
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, onLoad, onError]);
  
  return (
    <img
      ref={imgRef}
      src={currentSrc || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default LazyImage;