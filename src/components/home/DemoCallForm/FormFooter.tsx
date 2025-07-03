import React from 'react';
import { motion } from 'framer-motion';

interface FormFooterProps {
  isDarkMode: boolean;
}

export const FormFooter: React.FC<FormFooterProps> = ({ isDarkMode }) => {
  return (
    <motion.div 
      className="mt-8 text-center text-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Your data is securely processed and stored in accordance with our <a href="#" className="underline hover:text-gray-800 dark:hover:text-white">Privacy Policy</a>.
      </p>
    </motion.div>
  );
};