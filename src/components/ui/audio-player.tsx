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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercentage = clickPosition / progressWidth;
    const newTime = clickPercentage * duration;
    
    const audio = getAudioElement();
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercentage = Math.max(0, Math.min(1, clickPosition / progressWidth));
    const newTime = clickPercentage * duration;
    
    const audio = getAudioElement();
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
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
        className={`${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} rounded-full h-2 flex-grow overflow-hidden cursor-pointer relative`}
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
      >
        <div 
          className="bg-gray-600 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} min-w-[40px] text-right`}>
        {formatTime(currentTime)}
      </span>
    </div>
  );
}