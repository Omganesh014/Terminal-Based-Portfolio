const API_BASE = import.meta.env.VITE_AI_API_URL ?? '';

export const CHAT_API = API_BASE
  ? `${API_BASE}/api/v1/chat`
  : '/api/v1/chat';

export const CONTACT_API = '/api/v1/contact';
