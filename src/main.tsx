import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { reportWebVitals } from './lib/performance-utils';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize GSAP
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Add console logging for debugging
console.log('Application starting...');

// Initialize the app
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

// Report web vitals with console logging
reportWebVitals((metric) => {
  console.log('Web Vital:', metric);
});