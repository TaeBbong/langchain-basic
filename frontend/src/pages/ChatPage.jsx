import React from 'react';
import ChatWindow from '../components/ChatWindow.jsx';
import ChatInput from '../components/ChatInput.jsx';
import { useChat } from '../hooks/useChat.js';

export default function ChatPage() {
  const { messages, sending, error, sendMessage, clear } = useChat();

  return (
    <main className="chat-page">
      <ChatWindow messages={messages} loading={sending} error={error} onClear={clear} />
      <ChatInput onSend={sendMessage} disabled={sending} />
    </main>
  );
}

