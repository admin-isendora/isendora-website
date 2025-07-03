import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardProps {
  id: number;
  content: React.ReactNode;
}

interface CarouselProps {
  cards: CardProps[];
  isDarkMode?: boolean;
  onCardChange?: (cardId: number) => void;
  activeCardId?: number;
  swipeSensitivity?: number;
  enableHapticFeedback?: boolean;
}

export function Carousel3D({ 
  cards, 
  isDarkMode = false, 
  onCardChange, 
  activeCardId,
  swipeSensitivity = 30,
  enableHapticFeedback = true 
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const rotationInProgressRef = useRef(false);
  const initialNotificationSent = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const isDraggingRef = useRef(false);
  const dragDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);
  const dragOffsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchTimeRef = useRef(0);
  const lastTouchVelocityRef = useRef(0);
  const isAudioPlayingRef = useRef(false);

  useEffect(() => {
    if (cards.length > 0) {
      if (activeCardId !== undefined) {
        const index = cards.findIndex(card => card.id === activeCardId);
        if (index !== -1) {
          setActiveIndex(index);
        } else {
          setActiveIndex(0);
        }
      } else if (activeIndex >= cards.length) {
        setActiveIndex(0);
      }

      if (!initialNotificationSent.current && onCardChange && cards.length > 0) {
        onCardChange(cards[activeIndex].id);
        initialNotificationSent.current = true;
      }
    }
  }, [cards, activeCardId, activeIndex, onCardChange]);

  useEffect(() => {
    if (activeCardId !== undefined && !rotationInProgressRef.current && cards.length > 0) {
      const newIndex = cards.findIndex(card => card.id === activeCardId);
      if (newIndex !== -1 && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  }, [activeCardId, cards, activeIndex]);

  useEffect(() => {
    const handleAudioPlay = () => {
      isAudioPlayingRef.current = true;
    };

    const handleAudioPause = () => {
      isAudioPlayingRef.current = false;
    };

    document.addEventListener('audioPlay', handleAudioPlay);
    document.addEventListener('audioPause', handleAudioPause);

    return () => {
      document.removeEventListener('audioPlay', handleAudioPlay);
      document.removeEventListener('audioPause', handleAudioPause);
    };
  }, []);

  const triggerHapticFeedback = () => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const rotateLeft = () => {
    if (rotationInProgressRef.current || cards.length < 2) return;
    
    rotationInProgressRef.current = true;
    const newIndex = (activeIndex - 1 + cards.length) % cards.length;
    setActiveIndex(newIndex);
    
    if (onCardChange) {
      onCardChange(cards[newIndex].id);
    }

    triggerHapticFeedback();
    
    setTimeout(() => {
      rotationInProgressRef.current = false;
    }, 500);
  };

  const rotateRight = () => {
    if (rotationInProgressRef.current || cards.length < 2) return;
    
    rotationInProgressRef.current = true;
    const newIndex = (activeIndex + 1) % cards.length;
    setActiveIndex(newIndex);
    
    if (onCardChange) {
      onCardChange(cards[newIndex].id);
    }

    triggerHapticFeedback();
    
    setTimeout(() => {
      rotationInProgressRef.current = false;
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Check if touch started on audio player or its children
    const target = e.target as HTMLElement;
    if (target.closest('[data-audio-player]') || target.style.touchAction === 'none') {
      return;
    }

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    dragDirectionRef.current = null;
    dragOffsetRef.current = 0;
    lastTouchTimeRef.current = Date.now();
    lastTouchVelocityRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    // Check if we're interacting with audio player
    const target = e.target as HTMLElement;
    if (target.closest('[data-audio-player]') || target.style.touchAction === 'none') {
      isDraggingRef.current = false;
      return;
    }

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!dragDirectionRef.current && (absX > 10 || absY > 10)) {
      dragDirectionRef.current = absX > absY ? 'horizontal' : 'vertical';
    }

    if (dragDirectionRef.current !== 'horizontal') {
      return;
    }

    e.preventDefault();

    const currentTime = Date.now();
    const timeDiff = currentTime - lastTouchTimeRef.current;
    if (timeDiff > 0) {
      lastTouchVelocityRef.current = deltaX / timeDiff;
    }
    lastTouchTimeRef.current = currentTime;

    dragOffsetRef.current = deltaX;

    touchEndX.current = currentX;
    touchEndY.current = currentY;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current || dragDirectionRef.current !== 'horizontal') {
      isDraggingRef.current = false;
      return;
    }

    const swipeDistance = touchEndX.current - touchStartX.current;
    const velocity = lastTouchVelocityRef.current;
    const isQuickSwipe = Math.abs(velocity) > 0.5;

    if (Math.abs(swipeDistance) > swipeSensitivity || isQuickSwipe) {
      if (swipeDistance > 0) {
        rotateLeft();
      } else {
        rotateRight();
      }
    }

    isDraggingRef.current = false;
    dragOffsetRef.current = 0;
  };

  const getCardPosition = (index: number) => {
    if (cards.length === 1) return 'center';
    
    if (cards.length === 2) {
      return index === activeIndex ? 'center' : (index > activeIndex ? 'right' : 'left');
    }
    
    const relativePosition = ((index - activeIndex) + cards.length) % cards.length;
    
    if (relativePosition === 0) return 'center';
    if (relativePosition === 1 || (relativePosition === cards.length - 1 && cards.length === 2)) return 'right';
    return 'left';
  };

  const getPositionStyles = (position: string) => {
    const baseScale = 0.85;
    const activeScale = 1;
    const baseOpacity = 0.6;
    const dragOffset = isDraggingRef.current ? dragOffsetRef.current : 0;

    switch (position) {
      case 'left':
        return {
          transform: `translate(-50%, -50%) scale(${baseScale}) translateX(${-50 + dragOffset * 0.1}%)`,
          left: '50%',
          top: '50%',
          zIndex: 1,
          opacity: baseOpacity
        };
      case 'center':
        return {
          transform: `translate(-50%, -50%) scale(${activeScale}) translateX(${dragOffset * 0.1}%)`,
          left: '50%',
          top: '50%',
          zIndex: 2,
          opacity: 1
        };
      case 'right':
        return {
          transform: `translate(-50%, -50%) scale(${baseScale}) translateX(${50 + dragOffset * 0.1}%)`,
          left: '50%',
          top: '50%',
          zIndex: 1,
          opacity: baseOpacity
        };
      default:
        return {};
    }
  };

  const showNavigation = cards.length > 1;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[450px] px-[10vw] sm:px-4 md:px-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {showNavigation && (
        <>
          <motion.div 
            className="absolute left-[calc(10vw_+_8px)] sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              onClick={rotateLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200/80 hover:bg-gray-300 text-gray-700'
              } shadow-md backdrop-blur-sm transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="absolute right-[calc(10vw_+_8px)] sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button 
              onClick={rotateRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200/80 hover:bg-gray-300 text-gray-700'
              } shadow-md backdrop-blur-sm transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </>
      )}

      <div className="relative w-full h-full perspective-1000">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const position = getCardPosition(index);
            const styles = getPositionStyles(position);
            
            return (
              <motion.div
                key={card.id}
                className={`absolute ${
                  position === 'center' 
                    ? 'cursor-default' 
                    : 'cursor-pointer'
                }`}
                initial={styles}
                animate={styles}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1
                }}
                onClick={() => {
                  if (position === 'left') {
                    rotateLeft();
                  } else if (position === 'right') {
                    rotateRight();
                  }
                }}
              >
                {card.content}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}