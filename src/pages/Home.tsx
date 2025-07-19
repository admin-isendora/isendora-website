import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {
  isDarkMode: boolean;
  handleScroll: (id: string) => void;
  onContactFormOpen: () => void;
}

function Home({ isDarkMode, handleScroll, onContactFormOpen }: HomeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['Consulting', 'Automation', 'Development'];

  // Cycle through words every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="w-full bg-[#f5f5f7] min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-4 flex flex-col justify-center items-center"
        style={{ minHeight: "calc(100vh - 72px)" }}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="text-center max-w-4xl">
          <motion.div 
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9]"
            variants={fadeInUp}
          >
            <div className="text-[#1a1a1a] mb-1">We are AI</div>
            
            <div className="relative h-[1.2em] flex items-center justify-center mb-1 text-6xl md:text-8xl lg:text-9xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWordIndex}
                  variants={wordVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute pb-3"
                  style={{
                    background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {words[currentWordIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="text-[#1a1a1a]">Company</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section - Second Block */}
      <motion.section 
        className="py-20 bg-[#f5f5f7]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div 
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={numberVariants}
            >
              <CountUpNumber target={300} suffix="+" className="text-6xl md:text-7xl font-bold text-[#1a1a1a] mb-4" />
              <p className="text-lg text-gray-600">business solutions found</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={numberVariants}
              transition={{ delay: 0.1 }}
            >
              <CountUpNumber target={30} suffix="%" className="text-6xl md:text-7xl font-bold text-[#1a1a1a] mb-4" />
              <p className="text-lg text-gray-600">revenue growth after implementation</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={numberVariants}
              transition={{ delay: 0.2 }}
            >
              <CountUpNumber target={15} suffix="+" className="text-6xl md:text-7xl font-bold text-[#1a1a1a] mb-4" />
              <p className="text-lg text-gray-600">unique solutions developed</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Third Block - We don't sell AI / We sell Results */}
      <motion.section 
        className="py-24 md:py-32 bg-[#f5f5f7] relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4D4D] blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#FF4D4D] to-[#9333EA] blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <div className="text-center space-y-8">
              {/* First line with subtle animation */}
              <motion.h2 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#1a1a1a] leading-[0.9]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                We don't sell AI
              </motion.h2>
              
              {/* Elegant divider */}
              <motion.div 
                className="flex items-center justify-center space-x-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4D4D]"></div>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </motion.div>
              
              {/* Second line with gradient */}
              <motion.h2 
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                We sell Results
              </motion.h2>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section - Fourth Block */}
      <motion.section 
        className="py-16 md:py-20 bg-[#f5f5f7] relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            {/* Subtle text above button */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to transform your business?
            </motion.p>
            
            <motion.button
              onClick={onContactFormOpen}
              className="group bg-transparent text-black border-[1.5px] border-[#1D1D1F] rounded-[999px] px-12 py-4 text-lg font-medium hover:bg-black hover:text-white transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10">
                Get your free consultation
              </span>
              {/* Subtle hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] via-[#FF4D4D] to-[#9333EA] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Voice AI Showcase Block - Fifth Block */}
      <motion.section 
        className="py-20 bg-[#161616]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Experience Our
            </h2>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              <span
                style={{
                  background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Voice AI Solution
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              See how our AI voice assistants transform business communications with natural, intelligent conversations.
            </p>
            <motion.button
              onClick={() => window.location.href = '/voice-ai'}
              className="bg-transparent text-white border-[1.5px] border-white rounded-[999px] px-12 py-4 text-lg font-medium hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Explore Voice AI
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

// Component for counting up numbers
function CountUpNumber({ target, suffix = '', className }: { target: number; suffix?: string; className?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    if (!hasStarted) return;
    
    const duration = 2400; // 2.4 seconds (20% slower)
    const steps = 60; // 60 steps for smooth animation
    const increment = target / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(Math.floor(increment * currentStep), target);
      setCount(newCount);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(target);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [target, hasStarted]);
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => setHasStarted(true)}
    >
      {count}{suffix}
    </motion.div>
  );
}
export default Home;