import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import BusinessBenefits from '@/components/home/BusinessBenefits';
import ProcessSteps from '@/components/home/ProcessSteps';
import PricingSection from '@/components/home/PricingSection';
import FAQ from '@/components/home/FAQ';
import DemoCallForm from '@/components/home/DemoCallForm';
import { IntegrationMarquee } from '@/components/ui/integration-marquee';
import VoiceAssistantsSection from '@/components/home/VoiceAssistantsSection';

interface HomeProps {
  isDarkMode: boolean;
  handleScroll: (id: string) => void;
}

<script defer data-relevanceai-share-id="d7b62b/2c73ad07-fa19-4bad-9c1d-00396f5a1329/0be6b2d8-e458-4a29-8435-8b75ec6e1683" src="https://app.relevanceai.com/embed/chat-bubble.js" data-share-styles="starting_message_prompts=Whats+up%21&hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=icon&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false" ></script>

function Home({ isDarkMode, handleScroll }: HomeProps) {
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

      {/* Business Benefits Section */}
      <BusinessBenefits isDarkMode={isDarkMode} />

      {/* Process Steps Section */}
      <div id="process-steps">
        <ProcessSteps isDarkMode={isDarkMode} handleScroll={handleScroll} />
      </div>

      {/* Pricing Section */}
      <div id="pricing">
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

export default Home;