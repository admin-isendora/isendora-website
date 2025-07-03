import React from 'react';
import { Headphones } from 'lucide-react';
import { AIAssistant } from '@/lib/assistant-data';
import { motion } from 'framer-motion';

interface AssistantDescriptionProps {
  assistant: AIAssistant;
  isDarkMode: boolean;
}

export function AssistantDescription({ assistant, isDarkMode }: AssistantDescriptionProps) {
  const iconStyle = "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center";
  const iconStyleDark = "w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center";

  return (
    <motion.div 
      className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-xl shadow-sm max-w-[300px] mx-auto`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          className={`${isDarkMode ? iconStyleDark : iconStyle}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Headphones className="w-4 h-4 text-gray-600" />
        </motion.div>
        <h3 className="font-medium text-lg">{assistant.description.title}</h3>
      </div>
      
      {assistant.description.content.map((paragraph, index) => (
        <motion.p 
          key={index} 
          className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${
            index < assistant.description.content.length - 1 ? 'mb-4' : ''
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}