// Types for AI assistants
export interface AIAssistant {
  id: number;
  name: string;
  gender: string;
  accent: string;
  image: string;
  audio: string;
  description: {
    title: string;
    content: string[];
  };
}

// Library of AI assistants with images and descriptions
export const assistants: AIAssistant[] = [
  { 
    id: 1, 
    name: "Receptionist", 
    gender: "Female", 
    accent: "American",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    audio: "https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/voice.audio/Mia_American%20Beauty.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2b2ljZS5hdWRpby9NaWFfQW1lcmljYW4gQmVhdXR5Lm1wMyIsImlhdCI6MTc1MTU0MTUxMiwiZXhwIjoyMDY2OTAxNTEyfQ.aaPKrt5pGlyj_MxXKh8uisOMnhuFe1r9fu8PpUeuJWY",
    description: {
      title: "Your 24/7 Virtual Receptionist",
      content: [
        "Never miss a customer call, even at 3 AM. iSendora's Receptionist handles everything from quick questions to full bookings.",
        "It transfers calls to staff when needed, answers pricing queries, updates records, and schedules appointments in real time."
      ]
    }
  },
  { 
    id: 2, 
    name: "Support Agent", 
    gender: "Male", 
    accent: "British",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    audio: "https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/voice.audio/Mia_American%20Beauty.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2b2ljZS5hdWRpby9NaWFfQW1lcmljYW4gQmVhdXR5Lm1wMyIsImlhdCI6MTc1MTU0MTUxMiwiZXhwIjoyMDY2OTAxNTEyfQ.aaPKrt5pGlyj_MxXKh8uisOMnhuFe1r9fu8PpUeuJWY",
    description: {
      title: "Instant Customer Support Anytime",
      content: [
        "No more long hold times. iSendora Support helps customers right away, solving their issues in seconds.",
        "It fields FAQs, troubleshoots common problems, checks account details, and escalates calls so your team can focus on bigger tasks."
      ]
    }
  },
  { 
    id: 3, 
    name: "Sales Manager", 
    gender: "Female", 
    accent: "Australian",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    audio: "https://psymmxfknulxspcbvqmr.supabase.co/storage/v1/object/sign/voice.audio/Mia_American%20Beauty.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNTI1NmExNi01MjY0LTQ3ZTgtODZiMi02MGIxNDk1MDQ4MTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2b2ljZS5hdWRpby9NaWFfQW1lcmljYW4gQmVhdXR5Lm1wMyIsImlhdCI6MTc1MTU0MTUxMiwiZXhwIjoyMDY2OTAxNTEyfQ.aaPKrt5pGlyj_MxXKh8uisOMnhuFe1r9fu8PpUeuJWY",
    description: {
      title: "Effortless Sales Management",
      content: [
        "Say goodbye to missed bookings and scheduling delays. The iSendora Sales Manager confirms reservations, cancellations, and reminders in seconds.",
        "It checks availability, secures appointments, and syncs with your system so customers get what they need without the wait."
      ]
    }
  }
];

// Function to add a new assistant to the library
export const addAssistant = (assistant: Omit<AIAssistant, 'id'>): AIAssistant => {
  const newId = Math.max(0, ...assistants.map(a => a.id)) + 1;
  const newAssistant: AIAssistant = {
    id: newId,
    ...assistant
  };
  assistants.push(newAssistant);
  return newAssistant;
};

// Function to remove an assistant from the library
export const removeAssistant = (id: number): boolean => {
  const index = assistants.findIndex(assistant => assistant.id === id);
  if (index !== -1) {
    assistants.splice(index, 1);
    return true;
  }
  return false;
};

// Function to update an existing assistant
export const updateAssistant = (id: number, updates: Partial<Omit<AIAssistant, 'id'>>): AIAssistant | null => {
  const index = assistants.findIndex(assistant => assistant.id === id);
  if (index !== -1) {
    assistants[index] = {
      ...assistants[index],
      ...updates
    };
    return assistants[index];
  }
  return null;
};