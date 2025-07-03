import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQProps {
  isDarkMode?: boolean;
}

const FAQ: React.FC<FAQProps> = ({ isDarkMode = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqs = [
    {
      question: "How much does it cost to implement the AI assistant?",
      answer:
        "Pricing depends on scope and integrations. An iSendora pilot typically starts around $3,500",
    },
    {
      question: "How long does setup take?",
      answer:
        "Usually 1-3 weeks from kickoff to live pilot. Timeline varies by your CRM and desired functionality",
    },
    {
      question: "Which systems do you integrate with?",
      answer:
        "iSendora can integrate with any CRM or calendar you use — no limitations",
    },
    {
      question: "How natural is the AI assistant's voice?",
      answer:
        "Extremely natural, warm and human-like. We can even match your tone",
    },
    {
      question: "Do I need to train the AI myself?",
      answer:
        "Nope. The iSendora team handles all the training — you just tell us how you want it to talk and what it needs to know",
    },
    {
      question: "Can the assistant be tailored to my business?",
      answer:
        "Absolutely. Every assistant we build is custom-made for your business, services, and customers",
    },
    {
      question: "What support do you provide post-launch?",
      answer:
        "Real people on the iSendora team monitor, update, and support your assistant — we're always here to help",
    },
    {
      question: "How do I track results?",
      answer:
        "You'll get access to a private dashboard with call logs, transcripts, and performance metrics in real time",
    },
    {
      question: "Is there a free trial or pilot?",
      answer:
        "We don't offer generic trials — each assistant is custom-built. But you can try a live iSendora demo assistant first",
    },
    {
      question: "What happens if multiple people call at once?",
      answer:
        "No worries — your assistant can handle up to 20 calls simultaneously without ever being \"busy\".",
    },
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.clear();
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 0.6, 0.2],
      scale: [0.8, 1.2, 1],
      transition: { duration: 2, ease: [0.22, 1, 0.36, 1], times: [0, 0.6, 1] },
    },
  };

  const midPoint = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, midPoint);
  const rightColumnFaqs = faqs.slice(midPoint);

  const AccordionItem: React.FC<{ 
    faq: { question: string; answer: string }; 
    index: number;
    isOpen: boolean;
    onToggle: () => void;
  }> = ({ faq, index, isOpen, onToggle }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
      <div
        className={`overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-700 ${
          isDarkMode 
            ? `bg-[#1a1a1a]/80 border-gray-800 ${isOpen ? 'border-gray-700 shadow-lg' : 'hover:border-gray-700'}` 
            : `bg-white/80 border-gray-200 ${isOpen ? 'border-gray-300 shadow-lg' : 'hover:border-gray-300'}`
        }`}
      >
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full px-6 py-4 text-left group transition-all duration-500 ${
            isDarkMode 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-900 hover:text-black'
          }`}
        >
          <span className="text-base font-semibold pr-4">{faq.question}</span>
          <motion.div
            initial={false}
            animate={{ 
              rotate: isOpen ? 45 : 0,
              scale: isOpen ? 1.1 : 1
            }}
            transition={{ 
              duration: 0.7,
              ease: [0.32, 0, 0.67, 0]
            }}
          >
            <Plus
              className={`h-5 w-5 shrink-0 transition-colors duration-500 ${
                isDarkMode 
                  ? 'text-gray-400 group-hover:text-gray-300' 
                  : 'text-gray-500 group-hover:text-gray-900'
              }`}
            />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{
            height: {
              duration: 0.7,
              ease: [0.32, 0, 0.67, 0]
            },
            opacity: {
              duration: 0.5,
              delay: isOpen ? 0.2 : 0
            }
          }}
          style={{ overflow: "hidden" }}
        >
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{
              y: isOpen ? 0 : -20,
              opacity: isOpen ? 1 : 0
            }}
            transition={{
              duration: 0.7,
              ease: [0.32, 0, 0.67, 0]
            }}
            className="px-6 pb-4"
          >
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {faq.answer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-24 bg-[#161616] min-h-screen">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 max-w-6xl">
        <motion.div
          className="text-center mb-16 relative"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="absolute inset-0 -z-10"
            variants={glowVariants}
            style={{
              background: "linear-gradient(90deg, #FF7A00, #FF4D4D, #9333EA)",
              WebkitBackgroundClip: "padding-box",
              backgroundClip: "padding-box",
              WebkitMaskImage: "radial-gradient(circle at center, black, transparent 70%)",
              maskImage: "radial-gradient(circle at center, black, transparent 70%)",
              filter: "blur(120px)",
              transform: "translate3d(0,0,0)",
              WebkitTransform: "translate3d(0,0,0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />

          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-2 text-white relative" 
            variants={titleVariants}
          >
            Got questions about iSendora? We've got answers
          </motion.h2>

          <motion.p
            className="text-lg font-medium relative"
            variants={subtitleVariants}
            style={{
              background: "linear-gradient(90deg, #FF7A00 0%, #FF4D4D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transform: "translate3d(0,0,0)",
              WebkitTransform: "translate3d(0,0,0)",
            }}
          >
            Everything you want to know before getting started
          </motion.p>
        </motion.div>

        {/* Мобильная версия */}
        <div className="md:hidden space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.8,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
                  : {}
              }
            >
              <AccordionItem 
                faq={faq} 
                index={index} 
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            </motion.div>
          ))}
        </div>

        {/* Десктоп версия */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8">
          <div className="space-y-4">
            {leftColumnFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                          duration: 1,
                          delay: index * 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : {}
                }
              >
                <AccordionItem 
                  faq={faq} 
                  index={index} 
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {rightColumnFaqs.map((faq, index) => (
              <motion.div
                key={index + midPoint}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: {
                          duration: 1,
                          delay: (index + midPoint) * 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : {}
                }
              >
                <AccordionItem 
                  faq={faq} 
                  index={index + midPoint} 
                  isOpen={openItems.has(index + midPoint)}
                  onToggle={() => toggleItem(index + midPoint)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;