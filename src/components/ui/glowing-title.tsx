import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowingTitle({ children, className = '' }: GlowingTitleProps) {
  return (
    <div className="relative inline-block">
      <motion.div
        className="absolute inset-0 rounded-[28px] opacity-0"
        style={{
          background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
          filter: 'blur(40px)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      />
      
      <motion.div
        className={`relative z-10 px-8 py-4 rounded-2xl bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm border border-gray-500/10 shadow-xl ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <span 
          style={{
            background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent',
            display: 'inline-block',
            width: 'fit-content',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          {children}
        </span>
      </motion.div>
    </div>
  );
}