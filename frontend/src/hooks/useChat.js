import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { sendChat } from '../services/api.js';

let idSeq = 0;
const mkId = () => `${Date.now()}-${idSeq++}`;

export function useChat() {
  const [history, setHistory] = useLocalStorage('chat:history', []);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const messages = useMemo(() => history, [history]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: mkId(), role: 'user', content: text };
    setHistory((prev) => [...prev, userMsg]);
    setSending(true);
    setError(null);
    try {
      const reply = await sendChat(text);
      const asstMsg = { id: mkId(), role: 'assistant', content: reply };
      setHistory((prev) => [...prev, asstMsg]);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSending(false);
    }
  }, [setHistory]);

  const clear = useCallback(() => {
    setHistory([]);
    setError(null);
  }, [setHistory]);

  return { messages, sending, error, sendMessage, clear };
}

