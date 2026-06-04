const BASE = process.env.API_BASE || 'http://127.0.0.1:3001';

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function registerUser(i) {
  const username = `stress${Date.now()}_${i}`;
  return fetchJson('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'stresspass123' }),
  });
}

async function timeAsync(fn, label) {
  const start = performance.now();
  try { await fn(); } catch (e) { /* ignore */ }
  const ms = performance.now() - start;
  return { label, ms };
}

(async () => {
  console.log('\n🔥 STRESS TEST STARTED\n');

  // ── 1. Concurrent registration flood ──
  const concurrent = 20;
  console.log(`Registering ${concurrent} users concurrently...`);
  const regStart = performance.now();
  const regs = await Promise.all(Array.from({ length: concurrent }, (_, i) => registerUser(i)));
  const regTime = performance.now() - regStart;
  const success = regs.filter(r => r.status === 200).length;
  console.log(`  → ${success}/${concurrent} succeeded in ${regTime.toFixed(0)}ms (${(regTime/concurrent).toFixed(1)}ms avg)`);

  // ── 2. Rapid sequential API hammer ──
  const token = regs.find(r => r.status === 200)?.body?.token;
  if (token) {
    const hammerCount = 50;
    console.log(`\nHammering /api/agents ${hammerCount} times sequentially...`);
    const hammerStart = performance.now();
    let hammerSuccess = 0;
    for (let i = 0; i < hammerCount; i++) {
      const { status } = await fetchJson('/api/agents');
      if (status === 200) hammerSuccess++;
    }
    const hammerTime = performance.now() - hammerStart;
    console.log(`  → ${hammerSuccess}/${hammerCount} succeeded in ${hammerTime.toFixed(0)}ms (${(hammerTime/hammerCount).toFixed(1)}ms avg)`);

    // ── 3. Agent creation burst ──
    console.log(`\nCreating ${concurrent} agents concurrently...`);
    const agentStart = performance.now();
    const agents = await Promise.all(Array.from({ length: concurrent }, (_, i) =>
      fetchJson('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: `StressAgent${i}`, role: 'Stresstest', tier: 3 }),
      })
    ));
    const agentTime = performance.now() - agentStart;
    const agentSuccess = agents.filter(r => r.status === 201).length;
    console.log(`  → ${agentSuccess}/${concurrent} succeeded in ${agentTime.toFixed(0)}ms (${(agentTime/concurrent).toFixed(1)}ms avg)`);

    // ── 4. Chat stream latency ──
    console.log(`\nChat stream latency test (5 messages)...`);
    const chatTimes = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const res = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: `Stress test ${i}` }),
      });
      // Drain stream
      const reader = res.body.getReader();
      let done = false;
      while (!done) {
        const { done: d } = await reader.read();
        done = d;
      }
      chatTimes.push(performance.now() - t0);
    }
    const avgChat = chatTimes.reduce((a, b) => a + b, 0) / chatTimes.length;
    const minChat = Math.min(...chatTimes);
    const maxChat = Math.max(...chatTimes);
    console.log(`  → avg: ${avgChat.toFixed(0)}ms | min: ${minChat.toFixed(0)}ms | max: ${maxChat.toFixed(0)}ms`);
  }

  // ── 5. Health check under load ──
  console.log(`\nFinal health check...`);
  const { status, body } = await fetchJson('/api/health');
  console.log(`  → ${status === 200 ? '✅ Healthy' : '❌ Unhealthy'} (${JSON.stringify(body)})`);

  console.log('\n🔥 STRESS TEST COMPLETE\n');
})();
