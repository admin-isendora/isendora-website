import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessDialog({ open, onOpenChange }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-6 pt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF7A00] via-[#FF4D4D] to-[#9333EA] flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="text-center">
            <DialogTitle className="text-xl mb-2">
              Thank You!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Our AI assistant will be calling you shortly—pick up to experience it in action!
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}