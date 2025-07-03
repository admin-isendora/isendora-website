/**
 * Utility functions for working with dynamic gradients
 */

// Track mouse position for dynamic gradients
export const trackMousePosition = (element: HTMLElement) => {
  const handleMouseMove = (e: MouseEvent) => {
    // Calculate mouse position as percentage of element dimensions
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Set CSS variables for gradient positioning
    element.style.setProperty('--mouse-x', `${x}%`);
    element.style.setProperty('--mouse-y', `${y}%`);
  };
  
  // Add event listener
  element.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
  };
};

// Create a parallax gradient effect based on scroll position
export const createParallaxGradient = (element: HTMLElement, strength: number = 0.1) => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const elementPosition = element.offsetTop;
    const viewportHeight = window.innerHeight;
    
    // Calculate how far the element is from the viewport center
    const distanceFromCenter = (elementPosition - scrollPosition - viewportHeight / 2);
    
    // Calculate parallax offset
    const parallaxOffset = distanceFromCenter * strength;
    
    // Apply transform to create parallax effect
    element.style.backgroundPosition = `center ${parallaxOffset}px`;
  };
  
  // Add event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial calculation
  handleScroll();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Create a noise texture overlay
export const createNoiseOverlay = (element: HTMLElement, opacity: number = 0.05) => {
  // Create a noise overlay element
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '1';
  overlay.style.opacity = opacity.toString();
  overlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
  
  // Make sure the element has position relative
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  
  // Add the overlay to the element
  element.appendChild(overlay);
  
  // Return cleanup function
  return () => {
    element.removeChild(overlay);
  };
};

// Create a gradient glow behind an element
export const createGradientGlow = (
  element: HTMLElement, 
  color: string = 'rgba(150,150,150,0.3)', 
  radius: number = 70, 
  blur: number = 20
) => {
  // Create a glow element
  const glow = document.createElement('div');
  glow.style.position = 'absolute';
  glow.style.top = '-20px';
  glow.style.left = '-20px';
  glow.style.right = '-20px';
  glow.style.bottom = '-20px';
  glow.style.background = `radial-gradient(circle at center, ${color} 0%, transparent ${radius}%)`;
  glow.style.zIndex = '-1';
  glow.style.opacity = '0.7';
  glow.style.filter = `blur(${blur}px)`;
  glow.style.pointerEvents = 'none';
  
  // Make sure the element has position relative
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }
  
  // Add the glow to the element
  element.appendChild(glow);
  
  // Return cleanup function
  return () => {
    element.removeChild(glow);
  };
};

export default {
  trackMousePosition,
  createParallaxGradient,
  createNoiseOverlay,
  createGradientGlow
};