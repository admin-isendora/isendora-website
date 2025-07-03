declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any;
  export default ScrollTrigger;
}

declare module 'gsap/ScrollSmoother' {
  export const ScrollSmoother: any;
  export default ScrollSmoother;
}

declare module 'split-type' {
  export default class SplitType {
    constructor(elements: string | Element | Element[], options?: { types?: string[] });
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    revert(): void;
  }
}