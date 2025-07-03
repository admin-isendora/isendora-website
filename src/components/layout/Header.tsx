import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import FocusTrap from 'focus-trap-react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  handleScroll: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const LOGO_URL = "https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/logos/logo_website.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvcy9sb2dvX3dlYnNpdGUucG5nIiwiaWF0IjoxNzUxNTQxNjQxLCJleHAiOjIwNjY5MDE2NDF9.KHbxut1mSTpj0rEXczK5M_y1DOE38I7AwWwwQr-vj0Y";

export function Header({ isMenuOpen, setIsMenuOpen, handleScroll, isDarkMode, toggleDarkMode }: HeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Preload logo image
    const preloadImage = new Image();
    preloadImage.src = LOGO_URL;
    
    if (logoRef.current) {
      logoRef.current.style.opacity = '0';
      
      preloadImage.onload = () => {
        if (logoRef.current) {
          logoRef.current.style.opacity = '1';
          logoRef.current.style.transition = 'opacity 0.3s ease';
        }
      };
    }

    let overflowId: number | null = null;

    if (isMenuOpen) {
      overflowId = window.setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 280);

      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };

      const handleTouchOutside = (event: TouchEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleTouchOutside, { passive: true });
      document.addEventListener('keydown', handleEscape);

      return () => {
        if (overflowId) clearTimeout(overflowId);
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleTouchOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isMenuOpen, setIsMenuOpen]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Only toggle menu if clicking header background, not its children
    if (e.target === headerRef.current) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.28, ease: 'easeInOut' }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 20,
        restDelta: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.24, ease: 'easeInOut' }
    }
  };

  const burgerIconVariants = {
    closed: { 
      rotate: 0,
      scale: 1
    },
    open: { 
      rotate: 45,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  const navLinks = [
    { label: 'How We Build It', id: 'process-steps' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Demo Call', id: 'demo-call' }
  ];

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f7]"
      onClick={handleHeaderClick}
    >
      <div className="container mx-auto px-4 py-4">
        <motion.div 
          className="flex justify-between items-center"
          variants={staggerContainer}
        >
          <motion.div 
            className="flex items-center gap-2"
            variants={fadeIn}
          >
            <Link to="/" className="block" onClick={handleLogoClick}>
              <img 
                ref={logoRef}
                src={LOGO_URL}
                alt="iSendora Logo"
                className="w-28 h-28 -mt-8 -mb-8 transform-gpu"
                loading="eager"
                decoding="async"
                style={{ 
                  opacity: 0,
                  willChange: 'transform, opacity'
                }}
              />
            </Link>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2"
            variants={staggerContainer}
          >
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className="text-[#1a1a1a] font-semibold text-sm hover:text-gray-900 transition-colors"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            variants={staggerContainer}
          >
            {/* Sign In button is now hidden */}
            
            <motion.button 
              className="md:hidden touch-manipulation relative w-6 h-6 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                WebkitTapHighlightColor: 'transparent',
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)',
                transformOrigin: 'center center',
                WebkitTransformOrigin: 'center center'
              }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
                variants={burgerIconVariants}
                style={{
                  transform: 'translate3d(0,0,0)',
                  WebkitTransform: 'translate3d(0,0,0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transformOrigin: 'center center',
                  WebkitTransformOrigin: 'center center'
                }}
              >
                {isMenuOpen ? 
                  <X className="w-6 h-6" /> : 
                  <Menu className="w-6 h-6" />
                }
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <FocusTrap>
            <motion.div 
              ref={menuRef}
              id="mobile-nav"
              className="md:hidden bg-[#f5f5f7] border-t border-gray-200"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              style={{
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform, opacity'
              }}
            >
              <div className="px-4 py-2 space-y-1">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => {
                      handleScroll(link.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-[#1a1a1a] font-semibold text-sm hover:text-gray-900 transition-colors py-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
                {/* Sign In button is also hidden in mobile menu */}
              </div>
            </motion.div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </header>
  );
}