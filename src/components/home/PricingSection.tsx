import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PricingSectionProps {
  isDarkMode: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ isDarkMode }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses. One-time integration fee from $2,500',
      monthlyPrice: 750,
      yearlyPrice: 687,
      features: [
        { name: '1 AI Voice Assistant', included: true },
        { name: 'Up to 200 min/month', included: true },
        { name: '1 language', included: true },
        { name: 'Email support', included: true },
        { name: 'Calendar integration', included: true },
        { name: 'Admin dashboard', included: true },
        { name: 'SMS notifications', included: false },
        { name: 'Advanced analytics', included: false },
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses with higher call volumes. One-time integration fee from $3,500',
      monthlyPrice: 950,
      yearlyPrice: 871,
      features: [
        { name: '1-3 AI Voice Assistants', included: true },
        { name: 'Up to 500 min/month', included: true },
        { name: 'Up to 2 languages', included: true },
        { name: 'Chat support', included: true },
        { name: 'CRM integration', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'SMS notifications', included: true },
        { name: 'Outbound Call Reminders', included: false },
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom requirements. One-time integration fee from $9,500',
      monthlyPrice: 1200,
      yearlyPrice: 1100,
      features: [
        { name: '1-5 AI Voice Assistants', included: true },
        { name: 'Up to 1000 min/month', included: true },
        { name: 'Up to 5 languages', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Custom voice training', included: true },
        { name: 'Call Personalization', included: true },
        { name: 'Outbound Call Reminders', included: true },
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cycleVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 10
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: (i: number) => ({ 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3 + (i * 0.1),
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    hover: {
      scale: 1.015,
      transition: {
        duration: 0.3,
        ease: [0.42, 0, 0.58, 1]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const accordionContentVariants = {
    hidden: { 
      height: 0,
      opacity: 0
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        },
        opacity: {
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }
  };

  return (
    <section className={`py-16 px-4 ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <motion.div 
        className="container mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-12"
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FF7A00] via-[#FF4D4D] to-[#9333EA] bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              Pricing
            </span>
          </h2>
          <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose the iSendora plan that’s right for your business
          </p>
          
          <motion.div 
            className="flex justify-center mt-8"
            variants={cycleVariants}
          >
            <div className={`p-1 rounded-full ${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} inline-flex`}>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-800 shadow-sm' 
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
                onClick={() => setBillingCycle('monthly')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Monthly
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-800 shadow-sm' 
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
                onClick={() => setBillingCycle('yearly')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Yearly <span className="text-xs text-green-500 font-normal">-20%</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Accordion View */}
        <div className="md:hidden">
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                className="hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]"
              >
                <Accordion.Item
                  value={plan.name}
                  className={cn(
                    'overflow-hidden rounded-xl transition-all duration-300',
                    isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
                    plan.name === 'Professional' ? 'gradient-border' : 'border',
                    isDarkMode ? 'border-gray-800' : 'border-gray-200'
                  )}
                >
                  <Accordion.Trigger className="w-full group">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-3">
                          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} group-data-[state=open]:rotate-90`} />
                          <div>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {plan.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-baseline">
                            <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                            </span>
                            <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} opacity-80 ml-0.5`}>
                              /mo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.Trigger>
                  <Accordion.Content asChild>
                    <motion.div
                      variants={accordionContentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                          {plan.description}
                        </p>
                        <div className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              {feature.included ? (
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-0.5 bg-current rounded-full" />
                                  </div>
                                </div>
                              )}
                              <span className={`text-sm ${feature.included ? isDarkMode ? 'text-gray-300' : 'text-gray-700' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline"
                          rounded="full"
                          className="w-full mt-4 bg-transparent text-black border-[1.5px] border-[#1D1D1F] hover:scale-105 active:scale-95 transition-transform duration-200"
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </motion.div>
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={cn(
                'rounded-xl overflow-hidden hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition duration-300 ease-[cubic-bezier(0.42,0,0.58,1)]',
                isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white',
                plan.name === 'Professional' ? 'gradient-border transform md:-translate-y-4' : 'border',
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              )}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              whileTap="tap"
              viewport={{ once: true }}
              variants={cardVariants}
              custom={index}
            >
              <div className="p-6">
                <h3 className={`text-base font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} opacity-80 ml-0.5`}>
                    /month
                  </span>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-500 mt-1">
                      Billed annually (${plan.yearlyPrice * 12}/year)
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline"
                  rounded="full"
                  className="w-full mb-6 bg-transparent text-black border-[1.5px] border-[#1D1D1F] hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  {plan.cta}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-0.5 bg-current rounded-full" />
                          </div>
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? isDarkMode ? 'text-gray-300' : 'text-gray-700' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PricingSection;