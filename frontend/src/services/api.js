export async function sendChat(message, opts = {}) {
  // Sends a simple payload to /chat and tries to parse common response keys.
  // Backend expects { user_message: string }
  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_message: message, ...opts }),
  });

  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => null);
      const detail = data?.detail ? JSON.stringify(data.detail) : JSON.stringify(data);
      throw new Error(`Chat API error ${res.status}: ${detail || res.statusText}`);
    }
    const text = await res.text().catch(() => '');
    throw new Error(`Chat API error ${res.status}: ${text || res.statusText}`);
  }

  // Try JSON first; fall back to text.
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    // Heuristic: find first likely reply field
    const reply = data.reply || data.message || data.text || data.content || data.answer || data.assistant;
    if (typeof reply === 'string' && reply.length > 0) return reply;
    // If not found, serialize full JSON
    return JSON.stringify(data);
  }

  return await res.text();
}
