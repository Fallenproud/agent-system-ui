import { describe, it, before } from 'node:test';
import assert from 'node:assert';

const BASE = process.env.API_BASE || 'http://127.0.0.1:3001';

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

describe('API Unit Tests', () => {
  before(async () => {
    const { status, body } = await fetchJson('/api/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(body.status, 'ok');
    console.log('✓ Backend healthy');
  });

  describe('Auth', () => {
    it('should register a new user', async () => {
      const { status, body } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `tester${Date.now()}`, password: 'testpass123' }),
      });
      assert.strictEqual(status, 200);
      assert.ok(body.token, 'Should return JWT token');
      assert.ok(body.user, 'Should return user object');
      console.log('✓ Register works');
    });

    it('should reject duplicate username', async () => {
      const username = `dup${Date.now()}`;
      await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'testpass123' }),
      });
      const { status } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'testpass123' }),
      });
      assert.strictEqual(status, 409);
      console.log('✓ Duplicate rejection works');
    });

    it('should login with valid credentials', async () => {
      const username = `login${Date.now()}`;
      const pass = 'loginpass123';
      await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      const { status, body } = await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      assert.strictEqual(status, 200);
      assert.ok(body.token);
      console.log('✓ Login works');
    });

    it('should reject invalid login', async () => {
      const { status } = await fetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'nobody', password: 'wrongpass' }),
      });
      assert.strictEqual(status, 401);
      console.log('✓ Invalid login rejected');
    });

    it('should return 401 for protected route without token', async () => {
      const { status } = await fetchJson('/api/chat/history');
      assert.strictEqual(status, 401);
      console.log('✓ Auth middleware works');
    });
  });

  describe('Agents CRUD', () => {
    it('should list agents', async () => {
      const { status, body } = await fetchJson('/api/agents');
      assert.strictEqual(status, 200);
      assert.ok(Array.isArray(body));
      assert.ok(body.length >= 1, 'Should have seeded agents');
      console.log(`✓ Agents list: ${body.length} agents`);
    });

    it('should create an agent when authenticated', async () => {
      const username = `agentuser${Date.now()}`;
      const { body: reg } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'pass123' }),
      });
      const { status, body } = await fetchJson('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ name: 'TestBot', role: 'Tester', tier: 2, caps: ['Test'] }),
      });
      assert.strictEqual(status, 201);
      assert.strictEqual(body.name, 'TestBot');
      console.log('✓ Agent creation works');
    });

    it('should update an agent', async () => {
      const username = `upduser${Date.now()}`;
      const { body: reg } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'pass123' }),
      });
      const { body: created } = await fetchJson('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ name: 'UpdBot', role: 'Updater' }),
      });
      const { status, body } = await fetchJson(`/api/agents/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ name: 'UpdatedBot' }),
      });
      assert.strictEqual(status, 200);
      assert.strictEqual(body.name, 'UpdatedBot');
      console.log('✓ Agent update works');
    });

    it('should delete an agent', async () => {
      const username = `deluser${Date.now()}`;
      const { body: reg } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'pass123' }),
      });
      const { body: created } = await fetchJson('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ name: 'DelBot', role: 'Deleter' }),
      });
      const { status } = await fetchJson(`/api/agents/${created.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${reg.token}` },
      });
      assert.strictEqual(status, 200);
      console.log('✓ Agent delete works');
    });
  });

  describe('Workflows CRUD', () => {
    it('should create and retrieve a workflow', async () => {
      const username = `wfuser${Date.now()}`;
      const { body: reg } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'pass123' }),
      });
      const { status, body } = await fetchJson('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ name: 'Test Workflow', nodes: [{ id: 'n1', type: 'start' }], edges: [] }),
      });
      assert.strictEqual(status, 201);
      assert.strictEqual(body.name, 'Test Workflow');
      assert.ok(body.id);

      const get = await fetchJson(`/api/workflows/${body.id}`);
      assert.strictEqual(get.status, 200);
      assert.strictEqual(get.body.name, 'Test Workflow');
      console.log('✓ Workflow CRUD works');
    });
  });

  describe('Chat', () => {
    it('should reject unauthenticated chat', async () => {
      const { status } = await fetchJson('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'hello' }),
      });
      assert.strictEqual(status, 401);
      console.log('✓ Chat auth enforced');
    });

    it('should stream mock chat response', async () => {
      const username = `chatuser${Date.now()}`;
      const { body: reg } = await fetchJson('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: 'pass123' }),
      });
      // Use raw fetch and fully consume before assertions to avoid stream serialization issues
      const chatRes = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` },
        body: JSON.stringify({ message: 'Test message' }),
      });
      const status = chatRes.status;
      const reader = chatRes.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) text += decoder.decode(value, { stream: true });
      }
      assert.strictEqual(status, 200);
      assert.ok(text.length > 10, 'Should receive streamed response');
      console.log(`✓ Chat stream works (${text.length} chars)`);
    });
  });
});
