declare module '@studio-freight/lenis' {
  export default class Lenis {
    constructor(options?: {
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
    });
    
    raf(time: number): void;
    scrollTo(target: string | HTMLElement, options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      lock?: boolean;
      onComplete?: () => void;
    }): void;
    destroy(): void;
  }
}