import { create } from 'zustand';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AppState {
    // UI state
    isExpanded: boolean;
    setExpanded: (expanded: boolean) => void;

    // Voice state
    isListening: boolean;
    isSpeaking: boolean;
    setListening: (listening: boolean) => void;
    setSpeaking: (speaking: boolean) => void;

    // Chat state
    messages: Message[];
    addMessage: (role: 'user' | 'assistant', content: string) => void;
    clearMessages: () => void;

    // Settings
    settings: {
        voiceEnabled: boolean;
        alwaysOnTop: boolean;
    };
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // UI state
    isExpanded: false,
    setExpanded: (expanded) => set({ isExpanded: expanded }),

    // Voice state
    isListening: false,
    isSpeaking: false,
    setListening: (listening) => set({ isListening: listening }),
    setSpeaking: (speaking) => set({ isSpeaking: speaking }),

    // Chat state
    messages: [],
    addMessage: (role, content) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id: crypto.randomUUID(),
                    role,
                    content,
                    timestamp: new Date(),
                },
            ],
        })),
    clearMessages: () => set({ messages: [] }),

    // Settings
    settings: {
        voiceEnabled: true,
        alwaysOnTop: true,
    },
    updateSettings: (newSettings) =>
        set((state) => ({
            settings: { ...state.settings, ...newSettings },
        })),
}));
