import { z } from 'zod';
import { phoneNumberSchema } from '@/lib/phone-validation';

export interface FormData {
  name: string;
  email: string;
  businessWebsite: string;
  voiceAvatar: string;
  phoneNumber: string;
  timeZone: string;
}

export const formFields = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your name',
    required: true
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'your.email@example.com',
    required: true
  },
  {
    id: 'businessWebsite',
    label: 'Business Website (Optional)',
    type: 'url',
    placeholder: 'https://your-business.com',
    required: false
  },
  {
    id: 'voiceAvatar',
    label: 'AI Voice Assistant',
    type: 'select',
    placeholder: 'Select a voice',
    required: true,
    options: [
      { value: '', label: 'Select...' },
      { value: 'receptionist', label: 'Receptionist' },
      { value: 'support-manager', label: 'Support Manager' },
      { value: 'sales-manager', label: 'Sales Manager' }
    ]
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(234) 567-8901',
    required: true
  },
  {
    id: 'timeZone',
    label: 'Time Zone',
    type: 'select',
    placeholder: 'Select your time zone',
    required: true,
    options: [
      { value: 'America/New_York', label: 'Eastern — New York, Miami' },
      { value: 'America/Chicago', label: 'Central — Chicago, Dallas' },
      { value: 'America/Denver', label: 'Mountain — Denver, Phoenix' },
      { value: 'America/Los_Angeles', label: 'Pacific — Los Angeles, Seattle' }
    ]
  }
];

// Validation schema
export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  businessWebsite: z.string()
    .transform(val => val.startsWith('http') ? val : `https://${val}`)
    .pipe(z.string().url({ message: 'Please enter a valid website URL' }))
    .optional()
    .or(z.literal('')),
  voiceAvatar: z.string().min(1, { message: 'Please select a voice assistant' }),
  phoneNumber: phoneNumberSchema,
  timeZone: z.string().min(1, { message: 'Please select your time zone' })
});