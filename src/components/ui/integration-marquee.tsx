import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface IntegrationMarqueeProps {
  isDarkMode: boolean;
}

export function IntegrationMarquee({ isDarkMode }: IntegrationMarqueeProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  
  useEffect(() => {
    const updateDimensions = () => {
      setTimeout(() => {
        if (contentRef.current) {
          const width = contentRef.current.scrollWidth;
          setContentWidth(width);
          setDuration(width * 0.01);
        }
      }, 0);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const integrationPartners = [
    "Salesforce", "HubSpot", "Zoho CRM", "Pipedrive", "Microsoft Dynamics 365", 
    "Monday.com", "Freshsales", "Insightly", "Copper", "Nimble", "Keap", "Close", 
    "SugarCRM", "Oracle NetSuite", "Zendesk Sell", "Bitrix24", "ActiveCampaign", 
    "Apptivo", "Streak", "Capsule", "Less Annoying CRM", "Creatio", "Agile CRM", 
    "SAP Sales Cloud", "Nutshell", "Salesmate", "Vtiger", "Highrise", "Odoo CRM", 
    "EngageBay", "GoHighLevel"
  ];

  return (
    <motion.div 
      className={`w-full py-4 md:py-7 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 mb-3 md:mb-4 text-center">
        <p className="text-sm text-gray-600 font-medium">
          Integrates with any CRM — anywhere.
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="relative max-w-6xl w-full overflow-hidden">
          <motion.div 
            ref={contentRef}
            className="flex"
            animate={{ 
              x: [0, -(contentWidth / 2 || 1500)]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: duration,
              ease: "linear",
              repeatDelay: 0
            }}
          >
            {/* First set of logos */}
            <div className="flex gap-12">
              {integrationPartners.map((partner, index) => (
                <motion.span 
                  key={`partner-1-${index}`} 
                  className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-bold whitespace-nowrap`}
                  whileHover={{ 
                    scale: 1.1, 
                    color: isDarkMode ? "#ffffff" : "#000000",
                    transition: { duration: 0.2 }
                  }}
                >
                  {partner}
                </motion.span>
              ))}
            </div>
            
            {/* Duplicate set for seamless scrolling */}
            <div className="flex gap-12">
              {integrationPartners.map((partner, index) => (
                <motion.span 
                  key={`partner-2-${index}`} 
                  className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-bold whitespace-nowrap`}
                  whileHover={{ 
                    scale: 1.1, 
                    color: isDarkMode ? "#ffffff" : "#000000",
                    transition: { duration: 0.2 }
                  }}
                >
                  {partner}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}