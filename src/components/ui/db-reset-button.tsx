import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { clearAllUsers } from '@/lib/supabase';

interface DbResetButtonProps {
  isDarkMode: boolean;
  onSuccess?: () => void;
}

export function DbResetButton({ isDarkMode, onSuccess }: DbResetButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      const result = await clearAllUsers();
      
      if (result.success) {
        toast.success(result.message || 'Database has been reset successfully');
        setIsConfirmOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || 'Failed to reset database');
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error('An unexpected error occurred while resetting the database');
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div>
      {!isConfirmOpen ? (
        <Button
          variant="destructive"
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset Database</span>
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}
        >
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                Warning: This action cannot be undone
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                This will permanently delete all users and their data from the database.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-2"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Reset</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}