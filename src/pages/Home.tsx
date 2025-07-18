import React from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  isDarkMode: boolean;
  handleScroll: (id: string) => void;
}

function Home({ isDarkMode, handleScroll }: HomeProps) {
  return (
    <div className="w-full bg-[#f5f5f7]">
      <motion.section 
        className="container mx-auto px-4 flex flex-col justify-center items-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-center"
          style={{
            background: 'linear-gradient(90deg, #FF7A00 0%, #FF4D4D 50%, #9333EA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Home Page
        </motion.h1>
      </motion.section>
    </div>
  );
}

export default Home;