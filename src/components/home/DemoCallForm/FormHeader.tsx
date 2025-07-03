import React from 'react';
import { motion } from 'framer-motion';

interface FormHeaderProps {
  isDarkMode: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isDarkMode }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center"
      >
        <h2 
          className="text-3xl md:text-4xl font-bold relative"
          style={{
            background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Try iSendora AI Assistants Now
        </h2>
      </motion.div>
      
      <motion.p
        className={`text-lg max-w-2xl mx-auto mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Fill out the form and get a live demo call.
      </motion.p>
    </>
  );
};