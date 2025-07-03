import React from 'react';
import { motion } from 'framer-motion';
import { FormFields } from './FormFields';
import { FormHeader } from './FormHeader';
import { FormSubmitButton } from './FormSubmitButton';
import { FormFooter } from './FormFooter';
import { SuccessDialog } from './SuccessDialog';
import { useFormState } from './hooks/useFormState';
import { useBlockedState } from './hooks/useBlockedState';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface DemoCallFormProps {
  isDarkMode: boolean;
  formRef?: React.RefObject<HTMLElement>;
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcuEFErAAAAALEx_t_ZpNeGbl5rqZZGAnDxzfPS';

const DemoFormContent: React.FC<DemoCallFormProps> = ({ isDarkMode, formRef }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const {
    formData,
    formErrors,
    formSuccess,
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
  } = useFormState({ executeRecaptcha });

  const { blockedUntil, timeRemaining } = useBlockedState(sessionId);

  return (
    <motion.section 
      ref={formRef} 
      className={`py-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <FormHeader isDarkMode={isDarkMode} />
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm`}
            initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            whileInView={{ 
              boxShadow: isDarkMode 
                ? "0 20px 40px -5px rgba(0, 0, 0, 0.3), 0 8px 15px -6px rgba(0, 0, 0, 0.2)" 
                : "0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 8px 15px -6px rgba(0, 0, 0, 0.05)" 
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="p-8" noValidate>
              <FormFields 
                formData={formData}
                formErrors={formErrors}
                formSuccess={formSuccess}
                isDarkMode={isDarkMode}
                touchedFields={touchedFields}
                handleInputChange={handleInputChange}
                handlePhoneInput={handlePhoneInput}
                handlePhoneBlur={handlePhoneBlur}
                handleBlur={handleBlur}
              />

              <FormSubmitButton 
                isSubmitting={isSubmitting}
                blockedUntil={blockedUntil}
                timeRemaining={timeRemaining}
                isButtonDisabled={isButtonDisabled()}
                submitSuccess={submitSuccess}
                submitError={submitError}
              />
            </form>
          </motion.div>
        </motion.div>

        <FormFooter isDarkMode={isDarkMode} />
      </div>

      <SuccessDialog 
        open={submitSuccess} 
        onOpenChange={(open) => {
          if (!open) {
            window.location.reload();
          }
        }}
      />
    </motion.section>
  );
};

const DemoCallForm: React.FC<DemoCallFormProps> = (props) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <DemoFormContent {...props} />
    </GoogleReCaptchaProvider>
  );
};

export default DemoCallForm;