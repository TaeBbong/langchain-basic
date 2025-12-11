import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="brand">LLM Chat</div>
      <div className="spacer" />
      <a className="gh" href="#" aria-label="Help" title="Help"
         onClick={(e) => { e.preventDefault(); alert('Type a message and press Enter.'); }}>
        ?
      </a>
    </header>
  );
}

