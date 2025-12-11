import React, { useEffect, useRef } from 'react';
import Message from './Message.jsx';

export default function ChatWindow({ messages, loading, error, onClear }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <section className="chat-window">
      <div className="toolbar">
        <button className="btn" onClick={onClear} title="Clear chat">Clear</button>
      </div>
      <div className="messages" ref={listRef}>
        {messages.map((m) => (
          <Message key={m.id} role={m.role} content={m.content} />
        ))}
        {loading && <div className="msg msg-assistant pending">…</div>}
        {error && <div className="error">{String(error)}</div>}
      </div>
    </section>
  );
}

