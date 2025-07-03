import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isDarkMode: boolean;
  iconStyle: string;
  iconStyleDark: string;
}

export function AudioVisualizer({ isDarkMode, iconStyle, iconStyleDark }: AudioVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30); // Fixed duration for demo
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const barCount = 20; // Number of visualization bars
  
  // Generate random heights for visualization bars
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: barCount }, () => Math.random() * 0.8 + 0.2)
  );

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Update progress bar when clicked
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const progressRect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - progressRect.left;
    const progressWidth = progressRect.width;
    const percentage = clickPosition / progressWidth;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
  };

  // Animation for the audio visualization
  useEffect(() => {
    if (isPlaying) {
      const updateVisualization = () => {
        setBarHeights(prev => 
          prev.map(() => {
            // Create a smooth transition by keeping some of the previous value
            const randomFactor = Math.random() * 0.3;
            return Math.min(1, Math.max(0.1, Math.random() * 0.8 + 0.2 + randomFactor));
          })
        );
        
        animationRef.current = requestAnimationFrame(updateVisualization);
      };
      
      animationRef.current = requestAnimationFrame(updateVisualization);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);

  // Update current time when playing
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  return (
    <div className="w-full">
      {/* Visualization bars */}
      <div className={`w-full h-16 mb-4 flex items-end justify-between ${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} rounded-lg overflow-hidden p-2`}>
        {barHeights.map((height, index) => (
          <motion.div
            key={index}
            className="bg-gray-600 w-1.5 rounded-t-sm mx-0.5"
            initial={{ height: '10%' }}
            animate={{ 
              height: isPlaying ? `${height * 100}%` : '10%',
              opacity: isPlaying ? 0.7 + (height * 0.3) : 0.5
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.button 
          onClick={togglePlayPause}
          className={`${isDarkMode ? iconStyleDark : iconStyle} bg-gray-600 border-gray-600 p-1`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </motion.button>
        
        <div 
          ref={progressRef}
          className={`flex-1 ${isDarkMode ? 'bg-[#252525]' : 'bg-gray-200'} h-2 rounded-full overflow-hidden cursor-pointer`}
          onClick={handleProgressChange}
        >
          <div 
            className="bg-gray-600 h-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} min-w-[40px] text-right`}>
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
}