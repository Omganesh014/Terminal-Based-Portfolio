import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAiStore } from '../stores/aiStore';
import { playSound } from '../lib/sound';

export function AiAssistant() {
  const messages = useAiStore((s) => s.messages);
  const status = useAiStore((s) => s.status);
  const sendMessage = useAiStore((s) => s.sendMessage);
  const clearConversation = useAiStore((s) => s.clearConversation);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'loading') {
      playSound('open');
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <article className="ai-assistant">
      <p><span className="dialog-prompt">OM AI / PORTFOLIO ASSISTANT</span></p>
      <p className="ai-intro">Ask me anything about OmGanesh's projects, skills, experience, or background.</p>
      <div className="ai-messages" ref={listRef} role="log" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Hi, I'm OM AI. I can help you explore this portfolio. Try asking:</p>
            <ul>
              <li>"What projects has Om built?"</li>
              <li>"Tell me about SpendDay"</li>
              <li>"What are Om's skills?"</li>
              <li>"What tech stack does this portfolio use?"</li>
            </ul>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-message is-${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'OM AI'}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {status === 'loading' && (
          <div className="ai-message is-assistant ai-loading">
            <strong>OM AI</strong>
            <p>Thinking...</p>
          </div>
        )}
      </div>
      <form className="ai-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, skills, experience..."
          disabled={status === 'loading'}
          maxLength={2000}
        />
        <button type="submit" disabled={status === 'loading' || !input.trim()}>
          {status === 'loading' ? '...' : 'send'}
        </button>
        <button type="button" className="ai-clear" onClick={() => { playSound('close'); clearConversation(); }} disabled={messages.length === 0}>
          clear
        </button>
      </form>
    </article>
  );
}
