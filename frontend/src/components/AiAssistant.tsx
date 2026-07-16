import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAiStore } from '../stores/aiStore';
import { playSound } from '../lib/sound';

const SUGGESTIONS = [
  'What projects has Om built?',
  'Tell me about SpendDay',
  "What are Om's skills?",
  'What tech stack does this portfolio use?',
  'Describe the recruiter mode',
  'What experience does Om have?',
];

export function AiAssistant() {
  const messages = useAiStore((s) => s.messages);
  const status = useAiStore((s) => s.status);
  const streamingContent = useAiStore((s) => s.streamingContent);
  const sendMessage = useAiStore((s) => s.sendMessage);
  const retry = useAiStore((s) => s.retry);
  const clearConversation = useAiStore((s) => s.clearConversation);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [dots, setDots] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    if (status !== 'loading') { setDots(''); return; }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'idle' && !streamingContent) inputRef.current?.focus();
  }, [status, streamingContent]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'loading') {
      playSound('open');
      sendMessage(input);
      setInput('');
    }
  };

  const handleSuggestion = (text: string) => {
    playSound('open');
    sendMessage(text);
  };

  const copyConversation = useCallback(() => {
    const text = messages
      .map((m) => `## ${m.role === 'user' ? 'You' : 'OM AI'}\n${m.content}`)
      .join('\n\n');
    navigator.clipboard?.writeText(text).then(() => {
      playSound('copy');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const isLastError = lastMessage?.role === 'assistant' && lastMessage.content.startsWith('Error:');
  const showSuggestions = messages.length > 0 && !isLastError && status === 'idle' && !streamingContent;

  return (
    <article className="ai-assistant">
      <p><span className="dialog-prompt">OM AI / PORTFOLIO ASSISTANT</span></p>
      <p className="ai-intro">
        Ask me anything about OmGanesh&apos;s projects, skills, experience, or background.
        {messages.length > 0 && (
          <button type="button" className="ai-export" onClick={copyConversation}>
            {copied ? 'copied' : 'copy chat'}
          </button>
        )}
      </p>
      <div className="ai-messages" ref={listRef} role="log" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <p>Hi, I&apos;m OM AI. I can help you explore this portfolio. Try asking:</p>
            <div className="ai-suggestions">
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button key={s} type="button" className="ai-chip" onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-message is-${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'OM AI'}</strong>
            {msg.role === 'assistant' && !msg.content.startsWith('Error:') ? (
              <div className="ai-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        {streamingContent && (
          <div className="ai-message is-assistant">
            <strong>OM AI</strong>
            <div className="ai-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {streamingContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
        {status === 'loading' && !streamingContent && (
          <div className="ai-message is-assistant ai-loading">
            <strong>OM AI</strong>
            <p className="ai-dots">Thinking<span>{dots}</span></p>
          </div>
        )}
        {isLastError && status === 'idle' && (
          <div className="ai-retry-bar">
            <span>Something went wrong.</span>
            <button type="button" onClick={() => { playSound('open'); retry(); }}>retry</button>
          </div>
        )}
      </div>
      {showSuggestions && (
        <div className="ai-suggestions ai-suggestions-bottom">
          {SUGGESTIONS.filter((s) => !messages.some((m) => m.content.includes(s.slice(0, 20)))).slice(0, 3).map((s) => (
            <button key={s} type="button" className="ai-chip" onClick={() => handleSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <form className="ai-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, skills, experience..."
          disabled={status === 'loading'}
          maxLength={2000}
        />
        <button type="submit" disabled={status === 'loading' || !input.trim()}>
          {status === 'loading' ? '…' : 'send'}
        </button>
        <button type="button" className="ai-clear" onClick={() => { playSound('close'); clearConversation(); }} disabled={messages.length === 0}>
          clear
        </button>
      </form>
    </article>
  );
}
