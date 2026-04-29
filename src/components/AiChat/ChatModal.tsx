// src/components/AiChat/ChatModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onClose: () => void;
  lang: 'zh' | 'en' | 'th';
}

export default function ChatModal({ onClose, lang }: Props): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, lang }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: '请求失败，请稍后重试。',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const placeholder = { zh: '输入问题...', en: 'Ask a question...', th: 'ถามคำถาม...' }[lang];
  const sendLabel = { zh: '发送', en: 'Send', th: 'ส่ง' }[lang];
  const title = { zh: 'FFM 智能客服', en: 'FFM Assistant', th: 'ผู้ช่วย FFM' }[lang];

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <span>{title}</span>
        <button onClick={onClose} aria-label="×" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            {msg.content || (msg.role === 'assistant' && loading ? '...' : '')}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label={sendLabel}
        >
          {sendLabel}
        </button>
      </div>
    </div>
  );
}
