const API_BASE = import.meta.env.VITE_AI_API_URL ?? '';

export const API = {
  CHAT: API_BASE
    ? `${API_BASE}/api/v1/chat`
    : '/api/v1/chat',

  HEALTH: API_BASE
    ? `${API_BASE}/api/v1/health`
    : '/api/v1/health',
};

export const CONTACT_API = '/api/v1/contact';
