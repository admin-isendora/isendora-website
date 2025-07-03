// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Clean up audio element
export const cleanupAudio = (audio: HTMLAudioElement) => {
  audio.pause();
  if (audio.src.startsWith('blob:')) {
    URL.revokeObjectURL(audio.src);
  }
  audio.src = '';
  audio.load();
};