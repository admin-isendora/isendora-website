import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormErrorProps {
  message: string;
  className?: string;
}

/**
 * FormError component for displaying consistent error messages across the application
 * 
 * @param message - The error message to display
 * @param className - Optional additional classes
 */
export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <motion.div 
      className={`flex items-center gap-1 mt-1 text-red-500 text-xs ${className}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </motion.div>
  );
}