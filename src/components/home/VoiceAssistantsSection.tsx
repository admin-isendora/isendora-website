import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assistants } from '@/lib/assistant-data';
import AssistantCarousel from '@/components/integrations/AssistantCarousel';
import AssistantDetails from '@/components/integrations/AssistantDetails';

interface VoiceAssistantsSectionProps {
  isDarkMode: boolean;
}

const VoiceAssistantsSection: React.FC<VoiceAssistantsSectionProps> = ({ isDarkMode }) => {
  const [activeAssistantId, setActiveAssistantId] = React.useState<number>(
    assistants.length > 0 ? assistants[0].id : 0
  );
  
  const activeAssistant = assistants.find(assistant => assistant.id === activeAssistantId);

  const handleCardChange = (cardId: number) => {
    setActiveAssistantId(cardId);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.6
      }
    }
  };

  const fadeInVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const fadeInDelayedVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const carouselVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const mobileTitleVariants = {
    enter: { 
      opacity: 0
    },
    center: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.section 
      className="py-16 bg-[#161616]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-6"
          variants={fadeInVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Meet Your iSendora Voice AI Team
          </h2>
          <motion.p 
            className="text-base font-bold"
            variants={fadeInDelayedVariants}
            style={{
              background: 'linear-gradient(180deg, #FF7A00 0%, #FF4D4D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Feels natural. Works non-stop.
          </motion.p>
        </motion.div>

        <motion.div 
          className="relative py-4 overflow-hidden"
          variants={carouselVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <AssistantCarousel 
              assistants={assistants}
              isDarkMode={isDarkMode}
              activeAssistantId={activeAssistantId}
              onCardChange={handleCardChange}
            />
            
            {/* Mobile Title */}
            <AnimatePresence mode="wait">
              <motion.div 
                className="lg:hidden text-center mt-1"
                initial="enter"
                animate="center"
                exit="exit"
                variants={mobileTitleVariants}
                key={activeAssistant?.id}
              >
                <h3 className="text-sm text-white font-medium">
                  {activeAssistant?.description.title}
                </h3>
              </motion.div>
            </AnimatePresence>
            
            <div className="hidden lg:block lg:col-span-4">
              <AssistantDetails 
                activeAssistant={activeAssistant}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default VoiceAssistantsSection;