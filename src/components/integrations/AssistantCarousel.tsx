import React, { useRef } from 'react';
import { Carousel3D } from '@/components/ui/3d-carousel';
import { AssistantCard } from '@/components/ui/assistant-card';
import { AIAssistant } from '@/lib/assistant-data';

interface AssistantCarouselProps {
  assistants: AIAssistant[];
  isDarkMode: boolean;
  activeAssistantId: number;
  onCardChange: (cardId: number) => void;
}

const AssistantCarousel: React.FC<AssistantCarouselProps> = ({ 
  assistants, 
  isDarkMode, 
  activeAssistantId, 
  onCardChange 
}) => {
  // Create a ref to store the currently playing audio card id
  const playingCardIdRef = useRef<number | null>(null);

  // Handle audio play event from a card
  const handleCardPlay = (cardId: number) => {
    playingCardIdRef.current = cardId;
  };

  // Handle audio pause event from a card
  const handleCardPause = () => {
    playingCardIdRef.current = null;
  };

  // Handle card change in carousel
  const handleCardChange = (cardId: number) => {
    // If there's a card playing audio and it's not the new active card, trigger pause
    if (playingCardIdRef.current !== null && playingCardIdRef.current !== cardId) {
      // We'll use a custom event to communicate with the audio player
      const pauseEvent = new CustomEvent('pauseAllAudio', {
        detail: { exceptCardId: cardId }
      });
      document.dispatchEvent(pauseEvent);
      
      // Reset the playing card reference
      playingCardIdRef.current = null;
    }
    
    // Notify parent component about the card change
    onCardChange(cardId);
  };

  // Create assistant card components for the 3D carousel
  const assistantCards = assistants.map(assistant => ({
    id: assistant.id,
    content: (
      <AssistantCard 
        assistant={assistant} 
        isDarkMode={isDarkMode} 
        onPlay={() => handleCardPlay(assistant.id)}
        onPause={handleCardPause}
      />
    )
  }));

  return (
    <div className="lg:col-span-8 relative">
      <Carousel3D 
        cards={assistantCards} 
        isDarkMode={isDarkMode} 
        onCardChange={handleCardChange}
        activeCardId={activeAssistantId}
      />
    </div>
  );
};

export default AssistantCarousel;