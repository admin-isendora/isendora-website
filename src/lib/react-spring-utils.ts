import { useSpring, useTrail, useChain, useSpringRef, animated } from '@react-spring/web';
import { ReactNode } from 'react';

/**
 * Creates a fade-in animation with React Spring
 * @param options - Animation options
 */
export const useFadeIn = (options: {
  delay?: number;
  duration?: number;
  from?: { opacity?: number; y?: number };
} = {}) => {
  const { delay = 0, duration = 500, from = { opacity: 0, y: 20 } } = options;

  return useSpring({
    from,
    to: { opacity: 1, y: 0 },
    delay,
    config: { duration },
  });
};

/**
 * Creates a staggered animation for multiple elements
 * @param items - Array of items to animate
 * @param options - Animation options
 */
export const useStaggeredAnimation = <T,>(
  items: T[],
  options: {
    delay?: number;
    staggerDelay?: number;
    from?: object;
    to?: object;
    config?: object;
  } = {}
) => {
  const {
    delay = 0,
    staggerDelay = 50,
    from = { opacity: 0, y: 20 },
    to = { opacity: 1, y: 0 },
    config = { mass: 1, tension: 280, friction: 60 },
  } = options;

  return useTrail(items.length, {
    from,
    to,
    delay,
    config,
    trail: staggerDelay,
  });
};

/**
 * Creates a sequence of animations
 * @param animations - Array of animation configs
 */
export const useAnimationSequence = (
  animations: {
    ref: React.MutableRefObject<null>;
    config?: object;
  }[]
) => {
  useChain(animations.map((a) => a.ref), animations.map((_, i) => i * 0.2));
};

/**
 * Creates a parallax scroll effect with React Spring
 * @param options - Parallax options
 */
export const useParallaxScroll = (options: {
  strength?: number;
  clamp?: boolean;
} = {}) => {
  const { strength = 100, clamp = true } = options;
  
  const [springProps, api] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 280, friction: 60 },
  }));
  
  const handleScroll = (scrollY: number, elementTop: number, viewportHeight: number) => {
    const offsetY = elementTop - scrollY;
    const progress = 1 - (offsetY / viewportHeight);
    
    let value = progress * strength;
    if (clamp) {
      value = Math.max(0, Math.min(strength, value));
    }
    
    api.start({ y: value });
  };
  
  return { springProps, handleScroll };
};

/**
 * Animated component with React Spring
 */
export const AnimatedElement = ({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: object;
  className?: string;
}) => {
  return (
    <animated.div style={style} className={className}>
      {children}
    </animated.div>
  );
};

export default {
  useFadeIn,
  useStaggeredAnimation,
  useAnimationSequence,
  useParallaxScroll,
  AnimatedElement,
};