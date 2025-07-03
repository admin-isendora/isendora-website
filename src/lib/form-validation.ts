import { AlertCircle } from 'lucide-react';
import React from 'react';

/**
 * Utility functions for form validation and error handling
 */

/**
 * Creates a consistent error message element
 * 
 * @param message - The error message to display
 * @param className - Optional additional classes
 * @returns JSX element with consistent error styling
 */
export const createErrorMessage = (message: string, className = '') => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-1 mt-1 text-red-500 text-xs ${className}`}>
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </div>
  );
};

/**
 * Validates if a field is empty
 * 
 * @param value - The field value to check
 * @param fieldName - Optional field name for the error message
 * @returns Error message if empty, empty string if valid
 */
export const validateRequired = (value: string, fieldName = 'field') => {
  if (!value || value.trim() === '') {
    return `Please fill in this field.`;
  }
  return '';
};

/**
 * Validates an email address format
 * 
 * @param email - The email to validate
 * @returns Error message if invalid, empty string if valid
 */
export const validateEmail = (email: string) => {
  if (!email) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return '';
};

/**
 * Validates a select field has a non-empty selection
 * 
 * @param value - The selected value
 * @returns Error message if invalid, empty string if valid
 */
export const validateSelect = (value: string) => {
  if (!value) {
    return 'Please select an item in the list.';
  }
  return '';
};

/**
 * Checks if a form has any validation errors
 * 
 * @param errors - Object containing form errors
 * @returns True if there are errors, false otherwise
 */
export const hasErrors = (errors: Record<string, string | undefined>) => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};