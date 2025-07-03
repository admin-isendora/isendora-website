import { z } from 'zod';

// Clean phone number by removing spaces, brackets, dashes, etc.
export const cleanPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/[^\d]/g, '');
  
  // For US/Canada numbers (10 digits)
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // For US/Canada numbers with country code
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // For international numbers, add + if missing
  return `+${digits}`;
};

// Format phone number for display
export const formatPhoneForDisplay = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/[^\d]/g, '');
  
  if (digits.length === 0) return '';
  
  // US/Canada format: +1 (XXX) XXX-XXXX
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6);
    return `+1 (${areaCode}) ${prefix}-${line}`;
  }
  
  // US/Canada format with country code: +1 (XXX) XXX-XXXX
  if (digits.length === 11 && digits.startsWith('1')) {
    const areaCode = digits.slice(1, 4);
    const prefix = digits.slice(4, 7);
    const line = digits.slice(7);
    return `+1 (${areaCode}) ${prefix}-${line}`;
  }
  
  // International format: +XX XXX XXX XXX
  return `+${digits}`;
};

// Simple rate limiting for demo purposes (in-memory)
const attemptTracker = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

export const checkAttemptLimits = (phoneNumber: string, sessionId: string) => {
  const key = phoneNumber || sessionId;
  const now = Date.now();
  const maxAttempts = 3;
  const timeWindow = 60000; // 1 minute
  const blockDuration = 300000; // 5 minutes
  
  const tracker = attemptTracker.get(key) || { count: 0, lastAttempt: 0 };
  
  // Check if currently blocked
  if (tracker.blockedUntil && now < tracker.blockedUntil) {
    return {
      allowed: false,
      message: 'Too many attempts. Please try again later.',
      blockedUntil: tracker.blockedUntil
    };
  }
  
  // Reset counter if time window has passed
  if (now - tracker.lastAttempt > timeWindow) {
    tracker.count = 0;
  }
  
  tracker.count++;
  tracker.lastAttempt = now;
  
  // Block if too many attempts
  if (tracker.count > maxAttempts) {
    tracker.blockedUntil = now + blockDuration;
    attemptTracker.set(key, tracker);
    return {
      allowed: false,
      message: 'Too many attempts. Please try again later.',
      blockedUntil: tracker.blockedUntil
    };
  }
  
  attemptTracker.set(key, tracker);
  return { allowed: true };
};

// Validate phone number format
export const validatePhoneNumber = (
  phoneNumber: string,
  sessionId: string
): { isValid: boolean; message?: string; formattedNumber?: string } => {
  if (!phoneNumber) return { isValid: true };
  
  // Check rate limits first
  const rateCheck = checkAttemptLimits(phoneNumber, sessionId);
  if (!rateCheck.allowed) {
    return {
      isValid: false,
      message: rateCheck.message
    };
  }
  
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/[^\d]/g, '');
  
  // Check for invalid characters in original input
  if (/[^\d\s()+\-]/.test(phoneNumber)) {
    return {
      isValid: false,
      message: "Please use only numbers, spaces, and common phone symbols"
    };
  }
  
  // Check minimum length
  if (digits.length < 10) {
    return { 
      isValid: false, 
      message: "Phone number is incomplete" 
    };
  }
  
  // Handle US/Canada numbers (10 digits)
  if (digits.length === 10) {
    return { 
      isValid: true,
      formattedNumber: formatPhoneForDisplay(digits)
    };
  }
  
  // Handle US/Canada numbers with country code (11 digits)
  if (digits.length === 11 && digits.startsWith('1')) {
    return { 
      isValid: true,
      formattedNumber: formatPhoneForDisplay(digits)
    };
  }
  
  // For international numbers
  if (digits.length >= 10 && digits.length <= 15) {
    return { 
      isValid: false,
      message: "Sorry, we currently only support US and Canadian phone numbers",
      formattedNumber: `+${digits}`
    };
  }
  
  // If number is too long
  return { 
    isValid: false, 
    message: "Phone number is too long" 
  };
};

// Phone number schema for form validation
export const phoneNumberSchema = z.string()
  .min(1, "Phone number is required")
  .transform(value => value.replace(/[^\d]/g, ''))
  .refine(
    (digits) => {
      return (digits.length === 10) || (digits.length === 11 && digits.startsWith('1'));
    },
    { message: "Please enter a valid US or Canadian phone number" }
  )
  .transform(digits => {
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    return `+${digits}`;
  });