import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantDescription } from '@/components/ui/assistant-description';
import { AIAssistant } from '@/lib/assistant-data';

interface AssistantDetailsProps {
  activeAssistant: AIAssistant | undefined;
  isDarkMode: boolean;
}

const AssistantDetails: React.FC<AssistantDetailsProps> = ({ 
  activeAssistant, 
  isDarkMode
}) => {
  // If no assistant is active, show a placeholder
  if (!activeAssistant) {
    return (
      <div className="lg:col-span-4 lg:pl-4">
        <motion.div
          className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-xl shadow-sm max-w-[300px] mx-auto`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No assistants available. Add assistants to the library to see their details here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4 lg:pl-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAssistant.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <AssistantDescription 
            assistant={activeAssistant}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssistantDetails;