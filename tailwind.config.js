/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          bg: 'rgb(var(--primary-bg) / <alpha-value>)',
          text: 'rgb(var(--primary-text) / <alpha-value>)',
        },
        secondary: {
          bg: 'rgb(var(--secondary-bg) / <alpha-value>)',
          text: 'rgb(var(--secondary-text) / <alpha-value>)',
        },
        accent: {
          1: 'rgb(var(--accent-1) / <alpha-value>)',
          2: 'rgb(var(--accent-2) / <alpha-value>)',
          3: 'rgb(var(--accent-3) / <alpha-value>)',
        },
        border: 'rgb(var(--border-color) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        'base': 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
        'lg': 'clamp(1.2rem, 0.7vw + 1.2rem, 1.5rem)', 
        'xl': 'clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)',
      },
      spacing: {
        'xs': 'clamp(0.75rem, 0.69vw + 0.54rem, 1.13rem)',
        'sm': 'clamp(1rem, 0.92vw + 0.72rem, 1.5rem)',
        'md': 'clamp(1.5rem, 1.38vw + 1.08rem, 2.25rem)',
        'lg': 'clamp(2rem, 1.84vw + 1.44rem, 3rem)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};