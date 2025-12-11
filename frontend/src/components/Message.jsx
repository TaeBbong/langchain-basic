import React from 'react';

export default function Message({ role, content }) {
  const cls = role === 'user' ? 'msg msg-user' : 'msg msg-assistant';
  return (
    <div className={cls}>
      <div className="bubble">
        {content}
      </div>
    </div>
  );
}

