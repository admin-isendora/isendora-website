import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  isDarkMode: boolean;
  cardId?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onRegister?: (methods: { pause: () => void }) => void;
  className?: string;
}

export function AudioPlayer({ 
  audioSrc, 
  isDarkMode,
  cardId,
  onPlay, 
  onPause, 
  onEnd,
  onRegister,
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Create audio element only when needed
  const getAudioElement = () => {
    if (!audioRef.current) {
      console.log('Creating new audio element for:', audioSrc);
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "metadata";
      
      // Event listeners
      audio.addEventListener('loadedmetadata', () => {
        console.log('Metadata loaded, duration:', audio.duration);
        setDuration(audio.duration);
        setError(null);
      });

      audio.addEventListener('timeupdate', () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      });

      audio.addEventListener('ended', () => {
        console.log('Audio ended');
        setIsPlaying(false);
        setCurrentTime(0);
        if (onEnd) onEnd();
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Error loading audio');
      });

      audio.src = audioSrc;
      audioRef.current = audio;
    }
    return audioRef.current;
  };

  // Register pause method
  useEffect(() => {
    if (onRegister) {
      onRegister({
        pause: () => {
          const audio = audioRef.current;
          if (audio && isPlaying) {
            audio.pause();
            setIsPlaying(false);
            if (onPause) onPause();
          }
        }
      });
    }
  }, [onRegister, isPlaying, onPause]);

  const handlePlayPause = async () => {
    const audio = getAudioElement();
    
    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audio.pause();
        setIsPlaying(false);
        if (onPause) onPause();
      } else {
        console.log('Attempting to play audio');
        
        // Reset if ended
        if (audio.ended) {
          audio.currentTime = 0;
        }

        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Play successful');
              setIsPlaying(true);
              if (onPlay) onPlay();
            })
            .catch((error) => {
              console.error('Play failed:', error);
              setError(`Play failed: ${error.message}`);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Click handler error:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const updateProgress = (clientX: number) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const progressWidth = rect.width;
    const percentage = Math.max(0, Math.min(1, position / progressWidth));
    const newTime = percentage * duration;
    
    const audio = getAudioElement();
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    updateProgress(e.clientX);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    updateProgress(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();
    updateProgress(e.clientX);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updateProgress(touch.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    updateProgress(touch.clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false);
  };

  // Add global mouse and touch events for dragging
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, duration]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-red-500 text-xs">{error}</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePlayPause}
        className="bg-transparent border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-gray-600" />
        ) : (
          <Play className="w-4 h-4 text-gray-600 ml-0.5" />
        )}
      </button>
      
      <div 
        ref={progressRef}
        className={`${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} rounded-full h-2 flex-grow overflow-hidden cursor-pointer relative touch-none`}
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ touchAction: 'none' }}
      >
        <div 
          className="bg-gray-600 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        {/* Visual indicator for better mobile UX */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full shadow-md opacity-0 transition-opacity duration-200"
          style={{ 
            left: `calc(${progress}% - 8px)`,
            opacity: isDragging ? 1 : 0
          }}
        />
      </div>
      
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} min-w-[40px] text-right`}>
        {formatTime(currentTime)}
      </span>
    </div>
  );
}