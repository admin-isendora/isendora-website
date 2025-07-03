import React, { useState, useEffect, useRef } from 'react';
import { AIAssistant } from '@/lib/assistant-data';
import { AudioPlayer } from '@/components/ui/audio-player';
import { motion } from 'framer-motion';

interface AssistantCardProps {
  assistant: AIAssistant;
  isDarkMode: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export function AssistantCard({ assistant, isDarkMode, onPlay, onPause }: AssistantCardProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioPlayerRef = useRef<{ pause: () => void } | null>(null);
  
  useEffect(() => {
    const handlePauseAllAudio = (e: Event) => {
      const customEvent = e as CustomEvent;
      const exceptCardId = customEvent.detail?.exceptCardId;
      
      if (exceptCardId !== assistant.id && isAudioPlaying && audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
    
    document.addEventListener('pauseAllAudio', handlePauseAllAudio);
    
    return () => {
      document.removeEventListener('pauseAllAudio', handlePauseAllAudio);
    };
  }, [assistant.id, isAudioPlaying]);

  const handlePlay = () => {
    setIsAudioPlaying(true);
    
    const pauseEvent = new CustomEvent('pauseAllAudio', {
      detail: { exceptCardId: assistant.id }
    });
    document.dispatchEvent(pauseEvent);
    
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setIsAudioPlaying(false);
    if (onPause) onPause();
  };

  const handleEnd = () => {
    setIsAudioPlaying(false);
    if (onPause) onPause();
  };

  const registerPlayer = (methods: { pause: () => void }) => {
    audioPlayerRef.current = methods;
  };

  return (
    <div className={`w-72 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-lg shadow-md p-5`}>
      <div className="text-center mb-3">
        <h3 className="font-medium text-lg">{assistant.name}</h3>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {assistant.gender} - {assistant.accent} Accent
        </div>
      </div>
      <motion.div 
        className={`aspect-square ${isDarkMode ? 'bg-[#252525]' : 'bg-gray-100'} rounded-lg overflow-hidden mb-4 relative`}
        animate={isAudioPlaying ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={assistant.image} 
          alt={assistant.name} 
          className="w-full h-full object-cover"
        />
        {isAudioPlaying && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="flex gap-1"
              animate={{
                scale: [1, 1.2, 1],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      
      <div data-audio-player>
        <AudioPlayer 
          audioSrc={assistant.audio}
          isDarkMode={isDarkMode}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
          onRegister={registerPlayer}
          cardId={assistant.id}
        />
      </div>
    </div>
  );
}