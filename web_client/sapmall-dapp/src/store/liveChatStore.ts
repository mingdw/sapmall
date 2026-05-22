import { create } from 'zustand';

export type LiveChatMessageRole = 'user' | 'agent';

export type LiveChatMessage = {
  id: string;
  role: LiveChatMessageRole;
  text: string;
  at: number;
};

type LiveChatState = {
  isOpen: boolean;
  isMinimized: boolean;
  messages: LiveChatMessage[];
  isAgentTyping: boolean;
  open: () => void;
  close: () => void;
  minimize: () => void;
  expand: () => void;
  addMessage: (role: LiveChatMessageRole, text: string) => void;
  sendUserMessage: (text: string, agentReply: string) => void;
  setAgentTyping: (typing: boolean) => void;
};

const newId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useLiveChatStore = create<LiveChatState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  messages: [],
  isAgentTyping: false,

  open: () => set({ isOpen: true, isMinimized: false }),

  close: () => set({ isOpen: false, isMinimized: false, isAgentTyping: false }),

  minimize: () => set({ isMinimized: true }),

  expand: () => set({ isMinimized: false }),

  addMessage: (role, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    set((state) => ({
      messages: [
        ...state.messages,
        { id: newId(), role, text: trimmed, at: Date.now() },
      ],
    }));
  },

  sendUserMessage: (text, agentReply) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    get().addMessage('user', trimmed);
    set({ isAgentTyping: true });

    window.setTimeout(() => {
      get().addMessage('agent', agentReply);
      set({ isAgentTyping: false });
    }, 900 + Math.min(trimmed.length * 20, 1200));
  },

  setAgentTyping: (typing) => set({ isAgentTyping: typing }),
}));
