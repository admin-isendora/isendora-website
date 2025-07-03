import { useState } from 'react';
import { cleanPhoneNumber, formatPhoneForDisplay, validatePhoneNumber } from '@/lib/phone-validation';
import { z } from 'zod';
import { FormData, formSchema } from './types';

const initialFormData: FormData = {
  name: '',
  email: '',
  businessWebsite: '',
  voiceAvatar: '',
  phoneNumber: '',
  timeZone: 'America/New_York'
};

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [formSuccess, setFormSuccess] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouchedFields(allTouched);

    // Validate form data
    const validationResult = formSchema.safeParse({
      ...formData,
      businessWebsite: formData.businessWebsite 
        ? formData.businessWebsite.startsWith('http') 
          ? formData.businessWebsite 
          : `https://${formData.businessWebsite}`
        : ''
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    const cleanedPhoneNumber = cleanPhoneNumber(formData.phoneNumber);
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send data to webhook with proper error handling and timeout
      const webhookUrl = "https://hook.us2.make.com/hn5v6oeq4bpvr4m5ywnr2u0pyjbmvgr1";
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          ...formData,
          businessWebsite: formData.businessWebsite 
            ? formData.businessWebsite.startsWith('http') 
              ? formData.businessWebsite 
              : `https://${formData.businessWebsite}`
            : '',
          phoneNumber: cleanedPhoneNumber,
          submittedAt: new Date().toISOString(),
          source: 'website-demo-request',
          sessionId
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
      }
      
      setSubmitSuccess(true);
      setFormData(initialFormData);
      setFormErrors({});
      setFormSuccess({});
      setTouchedFields({});
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('Failed to submit form:')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle phone number input
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    const cleanedValue = cleanPhoneNumber(value);
    const formattedValue = formatPhoneForDisplay(cleanedValue);
    
    setFormData(prev => ({
      ...prev,
      [id]: cleanedValue
    }));
    
    e.target.value = formattedValue;
    
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  // Handle phone number blur
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [id]: true
    }));

    if (!value) return;
    
    const cleanedValue = cleanPhoneNumber(value);
    const formattedValue = formatPhoneForDisplay(cleanedValue);
    
    setFormData(prev => ({
      ...prev,
      [id]: cleanedValue
    }));
    
    e.target.value = formattedValue;
    
    if (cleanedValue) {
      const validation = validatePhoneNumber(cleanedValue, sessionId);
      
      if (!validation.isValid) {
        setFormErrors(prev => ({
          ...prev,
          [id]: validation.message
        }));
        setFormSuccess(prev => ({
          ...prev,
          [id]: false
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          [id]: undefined
        }));
        setFormSuccess(prev => ({
          ...prev,
          [id]: true
        }));
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle blur for other fields
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setTouchedFields(prev => ({
      ...prev,
      [id]: true
    }));

    if (!value) return;

    // Validate email on blur
    if (id === 'email' && value) {
      const emailResult = z.string().email().safeParse(value);
      if (!emailResult.success) {
        setFormErrors(prev => ({
          ...prev,
          [id]: 'Please enter a valid email address'
        }));
        return;
      }
    }

    // Validate website URL on blur
    if (id === 'businessWebsite' && value) {
      const urlToValidate = value.startsWith('http') ? value : `https://${value}`;
      try {
        const url = new URL(urlToValidate);
        if (!url.hostname.includes('.')) {
          throw new Error('Invalid domain');
        }
        setFormData(prev => ({
          ...prev,
          [id]: urlToValidate
        }));
        setFormErrors(prev => ({
          ...prev,
          [id]: undefined
        }));
      } catch {
        setFormErrors(prev => ({
          ...prev,
          [id]: 'Please enter a valid website URL (e.g., example.com)'
        }));
      }
      return;
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = () => {
    if (isSubmitting) {
      return true;
    }
    
    return Object.values(formErrors).some(error => error !== undefined);
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    formSuccess,
    setFormSuccess,
    isSubmitting,
    submitSuccess,
    submitError,
    touchedFields,
    handleInputChange,
    handlePhoneInput,
    handlePhoneBlur,
    handleBlur,
    handleSubmit,
    isButtonDisabled,
    sessionId
  };
};