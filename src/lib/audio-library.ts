// Типы для голосов
export interface Voice {
  id: number;
  name: string;
  gender: string;
  accent: string;
  image: string;
}

// Библиотека голосов с изображениями
export const voices: Voice[] = [
  { 
    id: 1, 
    name: "Sara Wilson", 
    gender: "Female", 
    accent: "American",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  { 
    id: 2, 
    name: "David Wood", 
    gender: "Male", 
    accent: "American",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  },
  { 
    id: 3, 
    name: "Sophia Kim", 
    gender: "Female", 
    accent: "Korean",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
  }
];