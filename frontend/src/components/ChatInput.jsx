import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const send = async () => {
    const text = value.trim();
    if (!text) return;
    setValue('');
    await onSend(text);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        placeholder="메시지를 입력하고 Enter를 누르세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        rows={2}
      />
      <button className="btn primary" onClick={send} disabled={disabled || !value.trim()}>
        Send
      </button>
    </div>
  );
}

