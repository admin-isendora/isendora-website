import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { formatTime, cleanupAudio } from '@/lib/audio-utils';

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
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    console.log('Initializing audio with src:', audioSrc);
    
    const audio = new Audio();
    
    // Set up event listeners
    const handleLoadStart = () => {
      console.log('Audio load started');
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
        setIsReadyToPlay(true);
      }
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoading(false);
      setIsReadyToPlay(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime !== undefined && audio.duration !== undefined) {
        const current = audio.currentTime;
        const total = audio.duration;
        
        setCurrentTime(current);
        if (total > 0 && !isNaN(total) && isFinite(total)) {
          setProgress((current / total) * 100);
        }
      }
    };

    const handleEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (onEnd) onEnd();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      const audioError = (e.target as HTMLAudioElement)?.error;
      let errorMessage = 'Error loading audio';
      
      if (audioError) {
        switch (audioError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported';
            break;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setIsReadyToPlay(false);
    };

    const handleLoadedData = () => {
      console.log('Audio data loaded');
      setIsLoading(false);
      setIsReadyToPlay(true);
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Store audio reference
    audioRef.current = audio;

    // Load audio directly without CORS issues
    try {
      console.log('Setting audio src directly:', audioSrc);
      // Don't set crossOrigin to avoid CORS issues
      audio.src = audioSrc;
      audio.load();
    } catch (error) {
      console.error('Error setting audio src:', error);
      setError('Error loading audio file');
      setIsLoading(false);
      setIsReadyToPlay(false);
    }

    return () => {
      console.log('Cleaning up audio');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      cleanupAudio(audio);
    };
  }, [audioSrc, onEnd]);

  // Register pause method for external control
  useEffect(() => {
    if (onRegister) {
      onRegister({ 
        pause: () => {
          if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            if (onPause) onPause();
          }
        }
      });
    }
  }, [onRegister, isPlaying, onPause]);

  // Custom time update interval for more responsive UI
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      intervalRef.current = window.setInterval(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused && !audio.ended) {
          const current = audio.currentTime;
          const total = audio.duration;
          
          if (!isNaN(current) && !isNaN(total) && total > 0) {
            setCurrentTime(current);
            setProgress((current / total) * 100);
          }
        }
      }, 100); // Update every 100ms for smooth progress
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isPlaying]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !isReadyToPlay) {
      console.log('Audio not ready:', { audio: !!audio, isReadyToPlay });
      return;
    }

    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audio.pause();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (onPause) onPause();
      } else {
        console.log('Playing audio');
        
        // Reset if ended
        if (audio.ended) {
          audio.currentTime = 0;
          setCurrentTime(0);
          setProgress(0);
        }

        // Set volume to ensure it's audible
        audio.volume = isMuted ? 0 : 1;
        
        // Try to play
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          if (onPlay) onPlay();
          console.log('Audio started playing successfully');
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      
      // Handle specific play errors
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            setError('Please interact with the page first to enable audio');
            break;
          case 'NotSupportedError':
            setError('Audio format not supported');
            break;
          default:
            setError('Error playing audio. Please try again.');
        }
      } else {
        setError('Error playing audio. Please try again.');
      }
      
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    audioRef.current.volume = newMutedState ? 0 : 1;
    setIsMuted(newMutedState);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || !duration || !isReadyToPlay) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercentage = clickPosition / progressWidth;
    const newTime = clickPercentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPercentage * 100);
  };

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
        onClick={togglePlayPause}
        className={`bg-transparent border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 ${
          !isReadyToPlay ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading || !isReadyToPlay}
      >
        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        ) : isPlaying ? (
          <Pause className="w-4 h-4 text-gray-600" />
        ) : (
          <Play className="w-4 h-4 text-gray-600 ml-0.5" />
        )}
      </button>
      
      <div 
        ref={progressRef}
        className={`${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} rounded-full h-2 flex-grow overflow-hidden cursor-pointer relative`}
        onClick={handleProgressClick}
      >
        <div 
          className={`bg-gray-600 h-full transition-all duration-100 relative ${isPlaying ? 'animate-progress-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        >
          {isPlaying && (
            <div className="absolute right-0 top-0 h-full w-1 bg-white animate-progress-glow"></div>
          )}
        </div>
      </div>
      
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} min-w-[40px] text-right`}>
        {formatTime(currentTime)}
      </span>
      
      <button 
        onClick={toggleMute}
        className={`bg-transparent border border-gray-600 rounded-full w-6 h-6 flex items-center justify-center hidden sm:flex transition-transform hover:scale-110 active:scale-90`}
      >
        {isMuted ? (
          <VolumeX className="w-3 h-3" />
        ) : (
          <Volume2 className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}