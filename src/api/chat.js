const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function authHeaders() {
  const token = localStorage.getItem('agent-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function sendMessage(message, history, onChunk) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    done = d;
    if (value) {
      onChunk(decoder.decode(value, { stream: true }));
    }
  }
}

export async function getHistory() {
  const res = await fetch(`${API_BASE}/api/chat/history`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load history');
  return res.json();
}

export async function clearHistory() {
  const res = await fetch(`${API_BASE}/api/chat/history`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to clear history');
  return res.json();
}

export async function getAgents() {
  const res = await fetch(`${API_BASE}/api/agents`);
  return res.json();
}

export async function getAgentHealth() {
  const res = await fetch(`${API_BASE}/api/agents/health`);
  return res.json();
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
