import { useState, useEffect } from 'react';

export const useBlockedState = (sessionId: string) => {
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!blockedUntil) return;
    
    const updateTimer = () => {
      const now = Date.now();
      if (now >= blockedUntil) {
        setBlockedUntil(null);
        setTimeRemaining(0);
        return;
      }
      
      setTimeRemaining(Math.ceil((blockedUntil - now) / 1000));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [blockedUntil]);

  return {
    blockedUntil,
    timeRemaining,
    setBlockedUntil
  };
};