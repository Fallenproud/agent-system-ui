const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function authHeaders() {
  const token = localStorage.getItem('agent-token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function fetchWorkflows() {
  const res = await fetch(`${API_BASE}/api/workflows`);
  if (!res.ok) throw new Error('Failed to load workflows');
  return res.json();
}

export async function fetchWorkflow(id) {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`);
  if (!res.ok) throw new Error('Failed to load workflow');
  return res.json();
}

export async function createWorkflow(wf) {
  const res = await fetch(`${API_BASE}/api/workflows`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(wf),
  });
  if (!res.ok) throw new Error('Failed to create workflow');
  return res.json();
}

export async function updateWorkflow(id, patch) {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update workflow');
  return res.json();
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete workflow');
  return res.json();
}
