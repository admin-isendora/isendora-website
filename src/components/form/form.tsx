import React from 'react';
import { useForm, FormProvider, SubmitHandler, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  children: React.ReactNode;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  isSubmitting?: boolean;
  className?: string;
  submitClassName?: string;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitText = 'Submit',
  resetText = 'Reset',
  showReset = false,
  isSubmitting = false,
  className = '',
  submitClassName = '',
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });
  
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  const handleReset = () => {
    methods.reset(defaultValues);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={submitClassName}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              submitText
            )}
          </Button>
          
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              {resetText}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}