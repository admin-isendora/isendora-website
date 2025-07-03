import React from 'react';
import { motion } from 'framer-motion';

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  blockedUntil: number | null;
  timeRemaining: number;
  isButtonDisabled: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isSubmitting,
  blockedUntil,
  timeRemaining,
  isButtonDisabled,
  submitSuccess,
  submitError
}) => {
  return (
    <div className="flex flex-col items-center">
      <motion.button 
        type="submit"
        className={`bg-transparent text-black border-[1.5px] border-[#1D1D1F] rounded-[999px] px-6 py-2 text-sm font-medium ${
          isButtonDisabled ? 'opacity-50' : 'hover:scale-105 active:scale-95'
        }`}
        disabled={isButtonDisabled}
        whileHover={{ scale: isButtonDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isButtonDisabled ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {isSubmitting ? (
          <span>Scheduling Your Demo</span>
        ) : blockedUntil !== null && Date.now() < blockedUntil ? (
          <span>Please Wait {timeRemaining}s</span>
        ) : (
          <span>Get Your Free AI Demo Call</span>
        )}
      </motion.button>
      
      {/* Error message */}
      {submitError && (
        <motion.div 
          className="mt-6 text-red-500 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {submitError}
        </motion.div>
      )}
    </div>
  );
};