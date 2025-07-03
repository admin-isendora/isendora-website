import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormError } from '@/components/ui/form-error';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  options,
  children,
}: FormFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message as string | undefined;
  
  return (
    <div className={`flex flex-col ${className}`}>
      <label 
        htmlFor={name} 
        className="text-sm font-medium mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // If children are provided, clone them with field props
          if (children) {
            return React.cloneElement(children as React.ReactElement, {
              ...field,
              id: name,
              disabled,
            });
          }
          
          // Render select input
          if (type === 'select' && options) {
            return (
              <div className="relative">
                <select
                  {...field}
                  id={name}
                  disabled={disabled}
                  className={`w-full p-3 rounded-md appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors ${
                    errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  } ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            );
          }
          
          // Render textarea
          if (type === 'textarea') {
            return (
              <textarea
                {...field}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors ${
                  errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                } ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                rows={4}
              />
            );
          }
          
          // Render checkbox
          if (type === 'checkbox') {
            return (
              <div className="flex items-center">
                <input
                  {...field}
                  type="checkbox"
                  id={name}
                  checked={field.value}
                  disabled={disabled}
                  className={`h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 ${
                    errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  } ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <label htmlFor={name} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  {placeholder}
                </label>
              </div>
            );
          }
          
          // Render default input
          return (
            <input
              {...field}
              type={type}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors ${
                errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              } ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          );
        }}
      />
      
      {/* Error message */}
      <FormError message={errorMessage || ''} />
    </div>
  );
}