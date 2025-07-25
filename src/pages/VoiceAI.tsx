import * as React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import BusinessBenefits from '@/components/home/BusinessBenefits';
import ProcessSteps from '@/components/home/ProcessSteps';
import PricingSection from '@/components/home/PricingSection';
import FAQ from '@/components/home/FAQ';
import DemoCallForm from '@/components/home/DemoCallForm';
import { IntegrationMarquee } from '@/components/ui/integration-marquee';
import VoiceAssistantsSection from '@/components/home/VoiceAssistantsSection';
import ROICalculator from '@/components/home/ROICalculator';

interface VoiceAIProps {
  isDarkMode: boolean;
  handleScroll: (id: string) => void;
}

function VoiceAI({ isDarkMode, handleScroll }: VoiceAIProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <HeroSection isDarkMode={isDarkMode} handleScroll={handleScroll} />
      
      {/* Integration Partners Marquee */}
      <IntegrationMarquee isDarkMode={isDarkMode} />

      {/* Voice Assistants Section */}
      <VoiceAssistantsSection isDarkMode={isDarkMode} />

      {/* ROI Calculator Section */}
      <ROICalculator isDarkMode={isDarkMode} />

      {/* Business Benefits Section */}
      <BusinessBenefits isDarkMode={isDarkMode} />

      {/* Process Steps Section */}
      <div id="process-steps">
        <ProcessSteps isDarkMode={isDarkMode} handleScroll={handleScroll} />
      </div>

      {/* Pricing Section - Hidden for now */}
      <div id="pricing" style={{ display: 'none' }}>
        <PricingSection isDarkMode={isDarkMode} />
      </div>

      {/* FAQ Section */}
      <FAQ isDarkMode={isDarkMode} />

      {/* AI Demo Call Section */}
      <div className="relative">
        {/* невидимый якорь */}
        <span id="demo-call" className="block absolute -top-[72px] h-0"></span>
      
        {/* сама форма */}
        <DemoCallForm isDarkMode={isDarkMode} />
      </div>
    </motion.div>
  );
}

export default VoiceAI;