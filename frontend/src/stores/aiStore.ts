import { create } from 'zustand';

type Message = { role: 'user' | 'assistant'; content: string };

type AiState = {
  messages: Message[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
};

const API_URL = import.meta.env.VITE_AI_API_URL || '/api/chat';

export const useAiStore = create<AiState>((set, get) => ({
  messages: [],
  status: 'idle',
  error: null,

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().status === 'loading') return;

    const userMessage: Message = { role: 'user', content: trimmed };
    set((s) => ({ messages: [...s.messages, userMessage], status: 'loading', error: null }));

    try {
      const history = get().messages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      set((s) => ({ messages: [...s.messages, assistantMessage], status: 'idle' }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      set((s) => ({
        messages: [...s.messages, { role: 'assistant', content: `Error: ${errorMsg}` }],
        status: 'error',
        error: errorMsg,
      }));
    }
  },

  clearConversation: () => set({ messages: [], status: 'idle', error: null }),
}));
