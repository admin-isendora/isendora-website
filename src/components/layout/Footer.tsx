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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <a href="#" onClick={handleLogoClick} className="block mb-2">
              <img 
                src="https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/logos/logo_website.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvcy9sb2dvX3dlYnNpdGUucG5nIiwiaWF0IjoxNzUxNTQxNjQxLCJleHAiOjIwNjY5MDE2NDF9.KHbxut1mSTpj0rEXczK5M_y1DOE38I7AwWwwQr-vj0Y"
                alt="iSendora Logo"
                className="w-28 h-28 -mt-8 -mb-8"
              />
            </a>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center md:text-left`}>
              AI-powered voice assistant for businesses of all sizes.
            </p>
          </motion.div>

          {/* Social Media and Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-end gap-4"
          >
            {/* Instagram Link */}
            <motion.a
              href="https://www.instagram.com/isendora.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-colors`}>
                @isendora.ai
              </span>
            </motion.a>

            {/* Links */}
            <div className="flex items-center gap-6">
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
            </div>
          </motion.div>
        </div>
        
        {/* Copyright */}
        <motion.div 
          className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
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