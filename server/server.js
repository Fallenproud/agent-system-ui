const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const { spawn } = require('child_process');
const path = require('path');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;
const USE_MOCK = process.env.USE_MOCK === 'true';
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;

if (NODE_ENV === 'production' && !JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required in production');
  process.exit(1);
}

const jwtSecret = JWT_SECRET || 'agent-system-secret-change-in-production';

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS: allow all in dev, restrict in production
const corsOrigin = process.env.CORS_ORIGIN || (NODE_ENV === 'production' ? false : true);
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many auth attempts, please try again later.' },
});
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many chat messages, please slow down.' },
});
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/chat', chatLimiter);

// ── Zod schemas ──
const usernameSchema = z.string().min(1).max(50).regex(/^[a-zA-Z0-9_]+$/);
const passwordSchema = z.string().min(6).max(128);
const agentSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  status: z.enum(['active', 'idle', 'error']).optional(),
  tier: z.number().int().min(1).max(3).optional(),
  caps: z.array(z.string().max(50)).max(20).optional(),
  cpu: z.number().int().min(0).max(100).optional(),
  mem: z.number().int().min(0).max(100).optional(),
});
const workflowSchema = z.object({
  name: z.string().min(1).max(100),
  active: z.boolean().optional(),
  nodes: z.array(z.object({ id: z.string(), type: z.string(), x: z.number().optional(), y: z.number().optional(), label: z.string().optional(), config: z.record(z.any()).optional() })).max(200).optional(),
  edges: z.array(z.object({ id: z.string(), from: z.string(), to: z.string() })).max(500).optional(),
});
const chatSchema = z.object({
  message: z.string().min(1).max(8000),
  history: z.array(z.object({ role: z.string(), content: z.string() })).max(50).optional(),
});

// ── Auth helpers ──
function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = auth.slice(7);
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Auth routes ──
app.post('/api/auth/register', async (req, res) => {
  const parse = usernameSchema.safeParse(req.body.username);
  const passParse = passwordSchema.safeParse(req.body.password);
  if (!parse.success || !passParse.success) {
    return res.status(400).json({ error: 'Invalid username or password. Username: 1-50 alphanumeric/underscore. Password: 6-128 chars.' });
  }
  const username = parse.data;
  const password = passParse.data;
  const existing = await db.users.findByUsername(username);
  if (existing) return res.status(409).json({ error: 'Username already exists' });

  const hash = bcrypt.hashSync(password, 10);
  const user = { id: Date.now().toString(), username, passwordHash: hash, createdAt: new Date().toISOString() };
  await db.users.create(user);

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token: signToken(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const parse = usernameSchema.safeParse(req.body.username);
  const passParse = passwordSchema.safeParse(req.body.password);
  if (!parse.success || !passParse.success) {
    return res.status(400).json({ error: 'Invalid username or password format' });
  }

  const user = await db.users.findByUsername(parse.data);
  if (!user || !bcrypt.compareSync(passParse.data, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token: signToken(user) });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// ── Health check ──
app.get('/api/health', (_req, res) => res.json({ status: 'ok', kimi: !USE_MOCK, auth: true }));

// ── Agent registry ──
async function getAgents() { return db.agents.getAll(); }

app.get('/api/agents', async (_req, res) => res.json(await getAgents()));

app.post('/api/agents', requireAuth, async (req, res) => {
  const parse = agentSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues.map(i => i.message).join(', ') });
  const { name, role, status, tier, caps, cpu, mem } = parse.data;
  const agent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name, role, status: status || 'idle', tier: tier || 3,
    caps: caps || [],
    cpu: cpu || 0, mem: mem || 0,
  };
  await db.agents.create(agent);
  res.status(201).json(agent);
});

app.put('/api/agents/:id', requireAuth, async (req, res) => {
  const parse = agentSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues.map(i => i.message).join(', ') });
  const updated = await db.agents.update(req.params.id, parse.data);
  if (!updated) return res.status(404).json({ error: 'Agent not found' });
  res.json(updated);
});

app.delete('/api/agents/:id', requireAuth, async (req, res) => {
  await db.agents.delete(req.params.id);
  res.json({ ok: true });
});

app.get('/api/agents/health', async (_req, res) => {
  const agents = await getAgents();
  const health = agents.map(a => ({
    ...a,
    cpu: Math.min(100, Math.max(0, (a.cpu || 0) + (Math.random() * 6 - 3))),
    mem: Math.min(100, Math.max(0, (a.mem || 0) + (Math.random() * 6 - 3))),
    latency: a.status === 'active' ? Math.floor(Math.random() * 120 + 20) : 0,
  }));
  res.json(health);
});

// ── Chat history (per-user) ──
app.get('/api/chat/history', requireAuth, async (req, res) => {
  const msgs = await db.messages.getByUser(req.user.id);
  res.json(msgs);
});

app.delete('/api/chat/history', requireAuth, async (req, res) => {
  await db.messages.clearByUser(req.user.id);
  res.json({ ok: true });
});

// ── Chat with Kimi CLI ──
app.post('/api/chat', requireAuth, async (req, res) => {
  const parse = chatSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues.map(i => i.message).join(', ') });
  const { message, history = [] } = parse.data;

  await db.messages.add({ userId: req.user.id, role: 'user', content: message, ts: Date.now() });

  if (USE_MOCK) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const mockReplies = [
      "I've analyzed your request. The recommended approach is to deploy the Nucleus agent first, then bootstrap the memory layer.",
      "Based on the blueprint, Phase 4 (Nucleus Deploy) should be gated behind a successful health check of all 3 memory tiers.",
      "You can spawn a new division by cloning the nucleus config and assigning a division-specific role in the agent card.",
      "Circuit breakers are mandatory. Wrap all external API calls with exponential backoff: 1s → 5s → 30s.",
    ];
    const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= reply.length) { clearInterval(interval); res.end(); return; }
      res.write(reply[i]);
      i++;
    }, 8);
    res.on('close', () => {
      clearInterval(interval);
      db.messages.add({ userId: req.user.id, role: 'assistant', content: reply, ts: Date.now() }).catch(() => {});
    });
    return;
  }

  let prompt = message;
  if (history.length > 0) {
    const ctx = history.slice(-6).map(h => `${h.role}: ${h.content}`).join('\n');
    prompt = `Context:\n${ctx}\n\nUser: ${message}\nAssistant:`;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  const kimi = spawn('kimi', [
    '--quiet',
    '--prompt', prompt,
  ], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });

  let buffer = '';
  let hasOutput = false;

  kimi.stdout.on('data', (data) => {
    hasOutput = true;
    const text = data.toString('utf-8');
    buffer += text;
    res.write(text);
  });

  kimi.stderr.on('data', (data) => {
    const text = data.toString('utf-8');
    if (!text.match(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/)) {
      console.error('[kimi stderr]', text.trim());
    }
  });

  kimi.on('close', (code) => {
    if (!hasOutput && buffer.length === 0) {
      res.write('(No response from agent. Ensure `kimi` CLI is authenticated.)');
    }
    db.messages.add({ userId: req.user.id, role: 'assistant', content: buffer, ts: Date.now() }).catch(() => {});
    res.end();
  });

  kimi.on('error', (err) => {
    console.error('Kimi spawn error:', err);
    res.write(`Error spawning Kimi CLI: ${err.message}`);
    db.messages.add({ userId: req.user.id, role: 'assistant', content: `Error: ${err.message}`, ts: Date.now() }).catch(() => {});
    res.end();
  });

  req.on('close', () => {
    if (!kimi.killed) kimi.kill();
  });
});

// File uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);

// ── Workflows ──
app.get('/api/workflows', async (_req, res) => res.json(await db.workflows.getAll()));

app.get('/api/workflows/:id', async (req, res) => {
  const wf = await db.workflows.getById(req.params.id);
  if (!wf) return res.status(404).json({ error: 'Workflow not found' });
  res.json(wf);
});

app.post('/api/workflows', requireAuth, async (req, res) => {
  const parse = workflowSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues.map(i => i.message).join(', ') });
  const { name, active, nodes, edges } = parse.data;
  const wf = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name, active: active ?? false, nodes: nodes || [], edges: edges || [],
  };
  await db.workflows.create(wf);
  res.status(201).json(wf);
});

app.put('/api/workflows/:id', requireAuth, async (req, res) => {
  const parse = workflowSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues.map(i => i.message).join(', ') });
  const updated = await db.workflows.update(req.params.id, parse.data);
  if (!updated) return res.status(404).json({ error: 'Workflow not found' });
  res.json(updated);
});

app.delete('/api/workflows/:id', requireAuth, async (req, res) => {
  await db.workflows.delete(req.params.id);
  res.json({ ok: true });
});

// Serve built React app
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── Init DB then start server ──
(async () => {
  if (db.initPG) await db.initPG();
  await db.agents.seed();
  await db.workflows.seed();

  const server = app.listen(PORT, () => {
    console.log(`Agent System running on port ${PORT}`);
    console.log(`Kimi integration: ${USE_MOCK ? 'MOCK MODE' : 'LIVE (kimi v1.5)'}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'JSON files'}`);
  });

  // ── WebSocket real-time health broadcast ──
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WS client connected');

    (async () => {
      const agents = await getAgents();
      const health = agents.map(a => ({
        ...a,
        cpu: Math.min(100, Math.max(0, (a.cpu || 0) + (Math.random() * 6 - 3))),
        mem: Math.min(100, Math.max(0, (a.mem || 0) + (Math.random() * 6 - 3))),
        latency: a.status === 'active' ? Math.floor(Math.random() * 120 + 20) : 0,
      }));
      ws.send(JSON.stringify({ type: 'health', data: health }));
    })();

    const interval = setInterval(async () => {
      const agents = await getAgents();
      const health = agents.map(a => ({
        ...a,
        cpu: Math.min(100, Math.max(0, (a.cpu || 0) + (Math.random() * 6 - 3))),
        mem: Math.min(100, Math.max(0, (a.mem || 0) + (Math.random() * 6 - 3))),
        latency: a.status === 'active' ? Math.floor(Math.random() * 120 + 20) : 0,
      }));
      ws.send(JSON.stringify({ type: 'health', data: health }));
    }, 3000);

    ws.on('close', () => {
      console.log('WS client disconnected');
      clearInterval(interval);
    });

    ws.on('error', (err) => {
      console.error('WS error:', err.message);
    });
  });
})();
