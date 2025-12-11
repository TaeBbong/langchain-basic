import React from 'react';
import ChatPage from './pages/ChatPage.jsx';
import Header from './components/Header.jsx';

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <ChatPage />
    </div>
  );
}

