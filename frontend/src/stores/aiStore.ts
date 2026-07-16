import { create } from 'zustand';
<<<<<<< HEAD
=======
import { searchPortfolio } from '../lib/portfolioSearch';
>>>>>>> 8fac277 (feat: local portfolio search with Fuse.js + switch to Groq API)

export type Message = { role: 'user' | 'assistant'; content: string };

type AiState = {
  messages: Message[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  streamingContent: string;
  sendMessage: (text: string) => Promise<void>;
  retry: () => Promise<void>;
  clearConversation: () => void;
};

const API_URL = import.meta.env.VITE_AI_API_URL || '/api/chat';
const STORAGE_KEY = 'om-ai-conversation';
<<<<<<< HEAD
=======
const MAX_HISTORY = 20;
>>>>>>> 8fac277 (feat: local portfolio search with Fuse.js + switch to Groq API)

function loadMessages(): Message[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch { /* quota exceeded, silently ignore */ }
}

export const useAiStore = create<AiState>((set, get) => ({
  messages: loadMessages(),
  status: 'idle',
  error: null,
  streamingContent: '',

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().status === 'loading') return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const nextMessages = [...get().messages, userMessage];
    set({ messages: nextMessages, status: 'loading', error: null, streamingContent: '' });
    saveMessages(nextMessages);

<<<<<<< HEAD
=======
    const localAnswer = searchPortfolio(trimmed);
    if (localAnswer) {
      const assistantMessage: Message = { role: 'assistant', content: localAnswer };
      const finalMessages = [...get().messages, assistantMessage];
      set({ messages: finalMessages, status: 'idle', streamingContent: '' });
      saveMessages(finalMessages);
      return;
    }

>>>>>>> 8fac277 (feat: local portfolio search with Fuse.js + switch to Groq API)
    const lastRetryMessage = get().messages[get().messages.length - 1];
    const historyMessages = lastRetryMessage?.role === 'assistant' && lastRetryMessage.content.startsWith('Error:')
      ? nextMessages.slice(0, -1) : nextMessages;

    try {
<<<<<<< HEAD
      const history = historyMessages.slice(0, -1).map((m) => ({
=======
      const history = historyMessages.slice(0, -1).slice(-MAX_HISTORY).map((m) => ({
>>>>>>> 8fac277 (feat: local portfolio search with Fuse.js + switch to Groq API)
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
        const is405 = res.status === 405;
        throw new Error(is405
          ? 'AI assistant is only available when the backend is running. Run the backend locally with `cd backend && npm run dev`.'
          : (body.error || `Request failed (${res.status})`));
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream') && !contentType.includes('text/plain')) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Unexpected response from AI server');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.text) {
              accumulated += data.text;
              set({ streamingContent: accumulated });
            }
            if (data.done) {
              const assistantMessage: Message = { role: 'assistant', content: data.fullText || accumulated };
              const finalMessages = [...get().messages, assistantMessage];
              set({ messages: finalMessages, status: 'idle', streamingContent: '' });
              saveMessages(finalMessages);
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      if (get().status === 'loading') {
        const assistantMessage: Message = { role: 'assistant', content: accumulated };
        const finalMessages = [...get().messages, assistantMessage];
        set({ messages: finalMessages, status: 'idle', streamingContent: '' });
        saveMessages(finalMessages);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      const errorMessages = [...get().messages, { role: 'assistant' as const, content: `Error: ${errorMsg}` }];
      set({ messages: errorMessages, status: 'error', error: errorMsg, streamingContent: '' });
      saveMessages(errorMessages);
    }
  },

  retry: async () => {
    const msgs = get().messages;
    const lastUserMsg = [...msgs].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      const withoutLastError = lastUserMsg.content.startsWith('Error:')
        ? msgs.slice(0, -2) : msgs.slice(0, -1);
      set({ messages: withoutLastError });
      await get().sendMessage(lastUserMsg.content);
    }
  },

  clearConversation: () => {
    set({ messages: [], status: 'idle', error: null, streamingContent: '' });
    saveMessages([]);
  },
}));
