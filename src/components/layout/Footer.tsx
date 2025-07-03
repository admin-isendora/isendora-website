import React from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '@/lib/lenis-utils';

interface FooterProps {
  isDarkMode: boolean;
}

export function Footer({ isDarkMode }: FooterProps) {
  const lenis = useLenis();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  };

  return (
    <footer className={`py-12 ${isDarkMode ? 'bg-[#1a1a1a]/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} relative z-10`}>
      <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
        <div className="hidden md:flex items-center justify-between">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <a href="#" onClick={handleLogoClick} className="block mb-2">
              <img 
                src="https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/logos/logo_website.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvcy9sb2dvX3dlYnNpdGUucG5nIiwiaWF0IjoxNzUxNTQxNjQxLCJleHAiOjIwNjY5MDE2NDF9.KHbxut1mSTpj0rEXczK5M_y1DOE38I7AwWwwQr-vj0Y"
                alt="iSendora Logo"
                className="w-28 h-28 -mt-8 -mb-8"
              />
            </a>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered voice assistant for businesses of all sizes.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-8"
          >
            <a 
              href="/privacy" 
              className={`text-sm hover:text-[#FF7A00] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className={`text-sm hover:text-[#FF7A00] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Terms of Service
            </a>
          </motion.div>
        </div>
        
        {/* Mobile Footer - Only Copyright */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © 2025 iSendora Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}