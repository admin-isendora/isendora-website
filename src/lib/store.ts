import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store state type
interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // User preferences
  userPreferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  updateUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  
  // UI state
  ui: {
    sidebarOpen: boolean;
    currentView: string;
    lastNotificationTime: number | null;
  };
  updateUI: (ui: Partial<AppState['ui']>) => void;
  toggleSidebar: () => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Dark mode state
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      
      // User preferences
      userPreferences: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
      },
      updateUserPreferences: (preferences) => 
        set((state) => ({ 
          userPreferences: { ...state.userPreferences, ...preferences } 
        })),
      
      // UI state
      ui: {
        sidebarOpen: false,
        currentView: 'home',
        lastNotificationTime: null,
      },
      updateUI: (ui) => 
        set((state) => ({ 
          ui: { ...state.ui, ...ui } 
        })),
      toggleSidebar: () => 
        set((state) => ({ 
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } 
        })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        userPreferences: state.userPreferences,
      }),
    }
  )
);