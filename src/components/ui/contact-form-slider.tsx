import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { z } from 'zod';

interface ContactFormSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  companyWebsite: string;
  services: string;
  phoneNumber: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  companyWebsite: z.string()
    .transform(val => val.startsWith('http') ? val : `https://${val}`)
    .pipe(z.string().url({ message: 'Please enter a valid website URL' }))
    .optional()
    .or(z.literal('')),
  services: z.string().min(1, { message: 'Please select a service' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number' })
});

export function ContactFormSlider({ isOpen, onClose }: ContactFormSliderProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    companyWebsite: '',
    services: '',
    phoneNumber: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationResult = formSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would send to your webhook
      const webhookUrl = "https://hook.us2.make.com/your-contact-webhook"; // Replace with actual webhook
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'contact-form-slider'
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
          setFormData({
            name: '',
            email: '',
            companyWebsite: '',
            services: '',
            phoneNumber: ''
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const slideVariants = {
    hidden: { 
      x: '100%',
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          {/* Sliding form */}
          <motion.div
            className="fixed top-4 right-8 bottom-4 w-full max-w-md md:max-w-lg z-50 bg-[#f5f5f7] shadow-2xl rounded-2xl overflow-hidden"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6 md:p-8 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Tell us where you're at
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email - Desktop: side by side, Mobile: stacked */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        What is your name?
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        What is your email?
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="Enter company website"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                    {formErrors.companyWebsite && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.companyWebsite}</p>
                    )}
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      What services are you interested in?
                    </label>
                    <select
                      name="services"
                      value={formData.services}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 focus:outline-none"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="consulting">Consulting</option>
                      <option value="voice-agents">Voice Agents</option>
                      <option value="custom-ai">Developing custom AI solution</option>
                    </select>
                    {formErrors.services && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.services}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="(234) 567-8901"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                      required
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send inquiry'}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}