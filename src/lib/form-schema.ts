import { z } from 'zod';

// Demo request schema
export const demoRequestSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  businessWebsite: z.string()
    .url({ message: 'Please enter a valid website URL' })
    .optional()
    .or(z.literal('')),
  voiceAvatar: z.string().min(1, { message: 'Please select a voice avatar' }),
  referralSource: z.string().min(1, { message: 'Please select how you found us' }),
  whatsappNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, { 
      message: 'Please enter a valid WhatsApp number in international format (e.g., +1234567890)' 
    }),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, { 
      message: 'Please enter a valid phone number in international format (e.g., +1234567890)' 
    }),
  message: z.string().optional(),
});

// Export types derived from schemas
export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;