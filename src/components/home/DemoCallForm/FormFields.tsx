import React from 'react';
import { motion } from 'framer-motion';
import { FormError } from '@/components/ui/form-error';
import { formFields } from './types';
import { FormData } from './types';

interface FormFieldsProps {
  formData: FormData;
  formErrors: Record<string, string | undefined>;
  formSuccess: Record<string, boolean | undefined>;
  isDarkMode: boolean;
  touchedFields: Record<string, boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handlePhoneInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  formErrors,
  formSuccess,
  isDarkMode,
  touchedFields,
  handleInputChange,
  handlePhoneInput,
  handlePhoneBlur,
  handleBlur,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {formFields.map((field, index) => (
        <motion.div 
          key={field.id} 
          className="flex flex-col"
          variants={fieldVariants}
          custom={index}
        >
          <label 
            htmlFor={field.id} 
            className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {field.label} {field.required && <span className="text-red-500">*</span>}
            {field.hint && (
              <span className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {field.hint}
              </span>
            )}
          </label>
          
          {field.type === 'select' ? (
            <div className="relative">
              <select
                id={field.id}
                value={formData[field.id]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required={field.required}
                className={`w-full p-3 rounded-md appearance-none ${
                  isDarkMode 
                    ? 'bg-[#252525] text-white border-gray-700 focus:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-200 focus:border-gray-400'
                } border focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors ${
                  touchedFields[field.id] && formErrors[field.id] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="relative">
              <motion.input
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={field.id === 'phoneNumber' ? handlePhoneInput : handleInputChange}
                onBlur={field.id === 'phoneNumber' ? handlePhoneBlur : handleBlur}
                required={field.required}
                className={`w-full p-3 rounded-md ${
                  isDarkMode 
                    ? 'bg-[#252525] text-white border-gray-700 focus:border-gray-500' 
                    : 'bg-white text-gray-900 border-gray-200 focus:border-gray-400'
                } border focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors ${
                  touchedFields[field.id] && formErrors[field.id] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                } ${
                  formSuccess[field.id] ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''
                }`}
                whileFocus={{ 
                  scale: 1.005,
                  transition: { duration: 0.2 }
                }}
              />
            </div>
          )}
          
          {touchedFields[field.id] && formErrors[field.id] && (
            <FormError message={formErrors[field.id] || ''} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};