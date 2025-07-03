import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import SplitTextReveal from '@/components/SplitTextReveal';

interface BusinessBenefitsProps {
  isDarkMode: boolean;
}

const BusinessBenefits: React.FC<BusinessBenefitsProps> = ({ isDarkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Counter animation states
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [counter4, setCounter4] = useState(0);
  
  // Target values for counters
  const targetValues = [95, 24, 100, 20];
  
  // Counter animation effect
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 2000; // 2 seconds
      
      // Calculate current counts based on progress
      const progressRatio = Math.min(progress / duration, 1);
      setCounter1(Math.floor(progressRatio * targetValues[0]));
      setCounter2(Math.floor(progressRatio * targetValues[1]));
      setCounter3(Math.floor(progressRatio * targetValues[2]));
      setCounter4(Math.floor(progressRatio * targetValues[3]));
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };
    
    // Start animation after a delay
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animateCount);
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView]);

  return (
    <section ref={ref} className={`px-5 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-16 md:pt-20 ${isDarkMode ? 'bg-[#121212]' : 'bg-gradient-light'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <SplitTextReveal
            type="words"
            stagger={0.03}
            duration={0.5}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Business Benefits
          </SplitTextReveal>
          <motion.p 
            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            iSendora voice system helps your business save time, improve customer service, and boost revenue
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-4 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {counter1}%
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customer Satisfaction
            </p>
          </motion.div>
          
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-4 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {counter2}/7
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Always On
            </p>
          </motion.div>
          
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-4 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {counter3}%
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Answer Rate
            </p>
          </motion.div>
          
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-4 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {counter4}
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Simultaneous Calls
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-5 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Instant Response</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No waiting. No missed leads. Every call answered in real-time
            </p>
          </motion.div>

          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-5 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Revenue Insights</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track buyer behavior, spot drop-offs, boost conversion
            </p>
          </motion.div>

          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-5 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Managed Setup</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We handle the integration — zero effort on your side
            </p>
          </motion.div>

          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-5 rounded-xl text-center border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]`}
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.015 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0, ease: [0.33, 1, 0.68, 1] }}
          >
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Human-Like Voice</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customers talk to AI that sounds natural, helpful, and real
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BusinessBenefits;