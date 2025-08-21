import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, GeneratedProject, ChatMessage } from '@/types';

interface AppStore extends AppState {
  // Actions
  setCurrentProject: (project: GeneratedProject | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setSelectedModel: (model: string) => void;
  setError: (error: string | null) => void;
  resetProject: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProject: null,
      chatMessages: [],
      isGenerating: false,
      selectedModel: 'gpt-5',
      error: null,

      // Actions
      setCurrentProject: (project: GeneratedProject | null) => set({ currentProject: project }),
      
      addChatMessage: (message: ChatMessage) => set((state) => ({
        chatMessages: [...state.chatMessages, {
          ...message,
          timestamp: new Date(message.timestamp) // Ensure it's a Date object
        }]
      })),
      
      clearChat: () => set({ chatMessages: [] }),
      
      setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
      
      setSelectedModel: (model: string) => set({ selectedModel: model }),
      
      setError: (error: string | null) => set({ error }),
      
      resetProject: () => set({
        currentProject: null,
        chatMessages: [],
        error: null
      })
    }),
    {
      name: 'hyperion-ai-storage',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        currentProject: state.currentProject,
        chatMessages: state.chatMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString() // Store as ISO string
        }))
      }),
      // Transform data when loading from localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.chatMessages) {
          state.chatMessages = state.chatMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp) // Convert back to Date object
          }));
        }
      }
    }
  )
);
