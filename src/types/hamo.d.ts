declare module '@studio-freight/hamo' {
  export function useScroll(callback: (values: { y: { current: number; progress: number; target: number; last: number; direction: number }; x: { current: number; progress: number; target: number; last: number; direction: number } }) => void): void;
  
  export function useResize(callback: (values: { width: number; height: number }) => void): void;
  
  export function useRaf(callback: (time: number, deltaTime: number) => void): void;
  
  export function useFrame(callback: (time: number, deltaTime: number) => void): void;
}