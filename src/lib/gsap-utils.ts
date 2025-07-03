import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Lazy load ScrollTrigger
let scrollTriggerLoaded = false;

const loadScrollTrigger = async () => {
  if (!scrollTriggerLoaded) {
    await import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerLoaded = true;
    });
  }
};

/**
 * Creates a text splitting animation with GSAP
 */
export const createSplitTextAnimation = (
  selector: string,
  options: {
    type?: 'chars' | 'words' | 'lines';
    stagger?: number;
    duration?: number;
    y?: number;
    ease?: string;
    scrollTrigger?: boolean;
    trigger?: string;
    start?: string;
  } = {}
) => {
  const {
    type = 'chars',
    stagger = 0.02,
    duration = 0.7,
    y = 20,
    ease = 'power2.out',
    scrollTrigger = false,
    trigger,
    start = 'top 80%',
  } = options;

  // Create the split text
  const splitText = new SplitType(selector, {
    types: [type],
  });

  // Get the split elements
  const elements = splitText[type];

  if (!elements) return { animation: null, splitText };

  // Set initial state
  gsap.set(elements, {
    y,
    opacity: 0,
  });

  // Create animation configuration
  const animConfig = {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease,
  };

  // Add ScrollTrigger if enabled
  if (scrollTrigger && trigger) {
    loadScrollTrigger();
    Object.assign(animConfig, {
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none reverse',
      },
    });
  }

  // Create and return the animation
  const animation = gsap.to(elements, animConfig);

  return {
    animation,
    splitText,
  };
};

/**
 * Creates a scroll-triggered animation
 */
export const createScrollTriggerAnimation = async (
  element: string | Element,
  animation: gsap.TweenVars,
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    toggleActions?: string;
  } = {}
) => {
  await loadScrollTrigger();

  const {
    trigger = element,
    start = 'top center',
    end = 'bottom center',
    scrub = false,
    markers = false,
    toggleActions = 'play none none reverse',
  } = options;

  return gsap.to(element, {
    ...animation,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      markers,
      toggleActions,
    },
  });
};

/**
 * Creates a parallax scroll effect
 */
export const createParallaxEffect = async (
  element: string | Element,
  options: {
    speed?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) => {
  await loadScrollTrigger();

  const {
    speed = 1,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
  } = options;

  return gsap.to(element, {
    y: () => speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub,
    },
  });
};

export default {
  createSplitTextAnimation,
  createScrollTriggerAnimation,
  createParallaxEffect,
};