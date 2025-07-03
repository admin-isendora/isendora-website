import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlowingTitle } from '@/components/ui/glowing-title';

interface ProcessStepsProps {
  isDarkMode: boolean;
  handleScroll: (id: string) => void;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ isDarkMode, handleScroll }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      number: "01",
      title: "We Listen & Learn",
      description: "Tell us what AI should do; the iSendora team studies and reviews",
      gradient: "from-[#FF7A00] to-[#FF4D4D]",
      bgColor: isDarkMode ? "bg-[#1E1E1E]" : "bg-[#F5F5F7]"
    },
    {
      number: "02",
      title: "We Script",
      description: "Crafting tone, dialogues, and natural AI delivery",
      gradient: "from-[#FF4D4D] to-[#FF1493]",
      bgColor: "bg-white"
    },
    {
      number: "03",
      title: "We Build",
      description: "Integrations, flows, call setup — all tailored to you",
      gradient: "from-[#FF1493] to-[#9333EA]",
      bgColor: isDarkMode ? "bg-[#1E1E1E]" : "bg-[#F5F5F7]"
    },
    {
      number: "04",
      title: "You Try",
      description: "We test together, tune dialogues, improve logic",
      gradient: "from-[#FF4D4D] to-[#FF1493]",
      bgColor: "bg-white"
    },
    {
      number: "05",
      title: "You Launch",
      description: "Go live with full visibility and dashboard access",
      gradient: "from-[#FF1493] to-[#9333EA]",
      bgColor: isDarkMode ? "bg-[#1E1E1E]" : "bg-[#F5F5F7]"
    },
    {
      number: "06",
      title: "We Support",
      description: "Refining, improving, and staying in your corner",
      gradient: "from-[#9333EA] to-[#7C3AED]",
      bgColor: "bg-white"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section ref={ref} className={`${isDarkMode ? 'bg-[#121212]' : 'bg-gradient-light'} scroll-mt-[72px]`}>
      <div className="mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-28 2xl:px-32 max-w-[1600px] py-16 md:py-24">
        <div className="text-center mb-16">
          <GlowingTitle className="text-2xl md:text-4xl font-bold">
            How We Build It
          </GlowingTitle>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`${step.bgColor} rounded-2xl p-6`}
              initial={{ 
                opacity: 0,
                x: index % 2 === 0 ? -40 : 40,
                y: 20,
                scale: 0.9
              }}
              animate={isInView ? { 
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1
              } : {}}
              transition={{ 
                duration: 1.4,
                delay: index * 0.2,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              <div className="flex items-start gap-6">
                <motion.div 
                  className={`text-5xl font-bold leading-none mb-6 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                  initial={{ 
                    scale: 0.8,
                    opacity: 0,
                    y: 20
                  }}
                  animate={isInView ? { 
                    scale: 1,
                    opacity: 1,
                    y: 0
                  } : {}}
                  transition={{ 
                    duration: 1.4,
                    delay: 0.3 + (index * 0.2),
                    ease: [0.19, 1, 0.22, 1]
                  }}
                >
                  {step.number}
                </motion.div>
                <div>
                  <motion.h3 
                    className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: 1.2,
                      delay: 0.4 + (index * 0.2),
                      ease: [0.19, 1, 0.22, 1]
                    }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ 
                      duration: 1.2,
                      delay: 0.5 + (index * 0.2),
                      ease: [0.19, 1, 0.22, 1]
                    }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Layout */}
        <motion.div 
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ 
                opacity: 0,
                y: 40,
                scale: 0.9
              }}
              animate={isInView ? { 
                opacity: 1,
                y: 0,
                scale: 1
              } : {}}
              transition={{ 
                duration: 1.6,
                delay: index * 0.1,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              <motion.div 
                className={`text-[120px] font-bold leading-none mb-6 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                initial={{ 
                  scale: 0.8,
                  opacity: 0,
                  y: 20
                }}
                animate={isInView ? { 
                  scale: 1,
                  opacity: 1,
                  y: 0
                } : {}}
                transition={{ 
                  duration: 1.4,
                  delay: 0.3 + (index * 0.1),
                  ease: [0.19, 1, 0.22, 1]
                }}
              >
                {step.number}
              </motion.div>
              <motion.h3 
                className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 1.2,
                  delay: 0.4 + (index * 0.1),
                  ease: [0.19, 1, 0.22, 1]
                }}
              >
                {step.title}
              </motion.h3>
              <motion.p 
                className={`text-sm leading-tight max-w-[260px] mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ 
                  duration: 1.2,
                  delay: 0.5 + (index * 0.1),
                  ease: [0.19, 1, 0.22, 1]
                }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Get Started Button */}
        <motion.div 
          className="flex flex-col items-center gap-2 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button 
            onClick={() => handleScroll('demo-call')}
            className="bg-transparent text-black border-[1.5px] border-[#1D1D1F] rounded-[999px] px-6 py-2 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Get Started
          </motion.button>
          <p style={{
            background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-sm font-medium">
            Save time instantly with iSendora AI‑powered calls
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSteps;