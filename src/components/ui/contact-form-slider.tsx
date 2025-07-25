import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { z } from 'zod';
import { cleanPhoneNumber, formatPhoneForDisplay, validatePhoneNumber } from '../../lib/phone-validation';

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

// Validation schema matching demo form
export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  companyWebsite: z.string()
    .optional()
    .or(z.literal(''))
    .transform(val => val.startsWith('http') ? val : `https://${val}`)
    .pipe(z.string().url({ message: 'Please enter a valid website URL' }))
    .optional()
    .or(z.literal('')),
  services: z.string().min(1, { message: 'Please select a service' }),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, { 
      message: 'Please enter a valid phone number in international format (e.g., +1234567890)' 
    })
});

export function ContactFormSlider({ isOpen, onClose }: ContactFormSliderProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    companyWebsite: '',
    services: '',
    phoneNumber: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [formSuccess, setFormSuccess] = useState<Record<string, boolean>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

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
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle phone number input with formatting
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
      setFormSuccess(prev => ({
        ...prev,
        [name]: false
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle phone number blur with validation
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    if (!value) return;
    
    const validation = validatePhoneNumber(value, sessionId);
    
    if (!validation.isValid) {
      setFormErrors(prev => ({
        ...prev,
        [name]: validation.message
      }));
      setFormSuccess(prev => ({
        ...prev,
        [name]: false
      }));
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
      setFormSuccess(prev => ({
        ...prev,
        [name]: true
      }));
      
      if (validation.formattedNumber) {
        e.target.value = validation.formattedNumber;
        setFormData(prev => ({
          ...prev,
          [name]: validation.formattedNumber
        }));
      }
    }
  };

  // Handle blur for other fields
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    if (!value) return;

    // Validate email on blur
    if (name === 'email' && value) {
      const emailResult = z.string().email().safeParse(value);
      if (!emailResult.success) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Please enter a valid email address'
        }));
        return;
      }
    }

    // Validate website URL on blur with auto-https
    if (name === 'companyWebsite' && value) {
      const urlToValidate = value.startsWith('http') ? value : `https://${value}`;
      try {
        const url = new URL(urlToValidate);
        if (!url.hostname.includes('.')) {
          throw new Error('Invalid domain');
        }
        setFormData(prev => ({
          ...prev,
          [name]: urlToValidate
        }));
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      } catch {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Please enter a valid website URL (e.g., example.com)'
        }));
      }
      return;
    }
  };

  // Clear submit error when user starts typing
  const clearSubmitError = () => {
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouchedFields(allTouched);

    // Validate form data with transformations
    const validationResult = formSchema.safeParse({
      ...formData,
      companyWebsite: formData.companyWebsite 
        ? formData.companyWebsite.startsWith('http') 
          ? formData.companyWebsite 
          : `https://${formData.companyWebsite}`
        : '',
      phoneNumber: cleanPhoneNumber(formData.phoneNumber)
    });
    
    if (!validationResult.success) {
      const errors: Record<string, string | undefined> = {};
      validationResult.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Get contact form webhook URL from environment variable
      const webhookUrl = import.meta.env.DEV 
        ? '/api/contact-webhook'
        : import.meta.env.VITE_WEBHOOK_CONTACT_URL;
      
      if (!webhookUrl) {
        throw new Error('Contact webhook URL not configured');
      }
      
      console.log('Submitting to webhook:', webhookUrl);
      console.log('Validated data being sent:', validationResult.data);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...validationResult.data,
          submittedAt: new Date().toISOString(),
          source: 'contact-form-slider',
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Unable to read error response';
        }
        console.error('Server response:', response.status, errorText);
        
        // Provide more specific error messages based on status code
        if (response.status === 500) {
          throw new Error(`Webhook server error (500). This is likely a configuration issue on the N8N webhook. Please check the webhook logs and ensure it can process the data format being sent.`);
        } else if (response.status === 403) {
          throw new Error(`Access forbidden (403). The webhook may not be configured to accept requests from this domain.`);
        } else if (response.status === 404) {
          throw new Error(`Webhook not found (404). Please verify the webhook URL is correct.`);
        } else {
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }
      
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
        setFormErrors({});
        setFormSuccess({});
        setTouchedFields({});
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setSubmitError('Network error: Unable to connect to the server. This may be due to CORS issues or network problems. Please try again later.');
      } else if (error instanceof Error && error.message === 'Contact webhook URL not configured') {
        setSubmitError('Configuration error: Contact form is not properly configured. Please contact support.');
      } else {
        setSubmitError(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      }
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
            className="fixed top-4 right-4 md:right-8 bottom-4 left-4 md:left-auto w-auto md:w-full md:max-w-md lg:max-w-lg z-50 bg-[#f5f5f7] shadow-2xl rounded-2xl overflow-hidden"
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
                        onBlur={handleBlur}
                        onFocus={clearSubmitError}
                        placeholder="Name"
                        className={`w-full px-3 py-2 border rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none ${
                          touchedFields.name && formErrors.name ? 'border-red-500' : 'border-gray-300'
                        } ${
                          formSuccess.name ? 'border-green-500' : ''
                        }`}
                        required
                      />
                      {touchedFields.name && formErrors.name && (
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
                        onBlur={handleBlur}
                        onFocus={clearSubmitError}
                        placeholder="Email"
                        className={`w-full px-3 py-2 border rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none ${
                          touchedFields.email && formErrors.email ? 'border-red-500' : 'border-gray-300'
                        } ${
                          formSuccess.email ? 'border-green-500' : ''
                        }`}
                        required
                      />
                      {touchedFields.email && formErrors.email && (
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
                      onBlur={handleBlur}
                      onFocus={clearSubmitError}
                      placeholder="Enter company website"
                      className={`w-full px-3 py-2 border rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none ${
                        touchedFields.companyWebsite && formErrors.companyWebsite ? 'border-red-500' : 'border-gray-300'
                      } ${
                        formSuccess.companyWebsite ? 'border-green-500' : ''
                      }`}
                    />
                    {touchedFields.companyWebsite && formErrors.companyWebsite && (
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
                      onBlur={handleBlur}
                      onFocus={clearSubmitError}
                      className={`w-full px-3 py-2 border rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 focus:outline-none ${
                        touchedFields.services && formErrors.services ? 'border-red-500' : 'border-gray-300'
                      } ${
                        formSuccess.services ? 'border-green-500' : ''
                      }`}
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="ai-consulting">AI Consulting</option>
                      <option value="voice-ai-agents">Voice AI Agents</option>
                      <option value="custom-ai-solution">Developing custom AI solution</option>
                    </select>
                    {touchedFields.services && formErrors.services && (
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
                      onChange={handlePhoneInput}
                      onBlur={handlePhoneBlur}
                      onFocus={clearSubmitError}
                      placeholder="(234) 567-8901"
                      className={`w-full px-3 py-2 border rounded-md focus:border-gray-500 focus:ring-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none ${
                        touchedFields.phoneNumber && formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      } ${
                        formSuccess.phoneNumber ? 'border-green-500' : ''
                      }`}
                      required
                    />
                    {touchedFields.phoneNumber && formErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  )}

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