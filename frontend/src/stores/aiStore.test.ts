import { beforeEach, describe, expect, it } from 'vitest';
import { useAiStore } from './aiStore';

describe('aiStore', () => {
  beforeEach(() => {
    useAiStore.setState({ messages: [], status: 'idle', error: null, streamingContent: '' });
    window.localStorage.clear();
  });

  it('starts with empty messages', () => {
    expect(useAiStore.getState().messages).toEqual([]);
  });

  it('starts idle', () => {
    expect(useAiStore.getState().status).toBe('idle');
  });

  it('retry requires a user message', async () => {
    await useAiStore.getState().retry();
    expect(useAiStore.getState().status).toBe('idle');
  });

  it('clears conversation', () => {
    useAiStore.setState({ messages: [{ role: 'user', content: 'hello' }], status: 'error', error: 'fail' });
    useAiStore.getState().clearConversation();
    const state = useAiStore.getState();
    expect(state.messages).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
    expect(state.streamingContent).toBe('');
  });

  it('manages message flow', () => {
    const state = useAiStore.getState();
    expect(state.messages).toHaveLength(0);
  });

  it('stores user message in state when sendMessage starts', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(null, { status: 405 });

    await useAiStore.getState().sendMessage('test question');
    const state = useAiStore.getState();
    expect(state.messages.length).toBeGreaterThanOrEqual(1);
    expect(state.messages[0].role).toBe('user');

    globalThis.fetch = originalFetch;
  });
});
