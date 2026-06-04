const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return []; }
}

function writeJSON(file, data) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// ── PostgreSQL adapter ──
let pool = null;
const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
}

async function pgQuery(text, params) {
  if (!pool) throw new Error('PostgreSQL not configured');
  const client = await pool.connect();
  try { return await client.query(text, params); } finally { client.release(); }
}

async function initPG() {
  if (!pool) return;
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordhash TEXT NOT NULL,
      createdat TIMESTAMP DEFAULT NOW()
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      userid TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      attachments JSONB DEFAULT '[]',
      ts BIGINT NOT NULL
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'idle',
      tier INT DEFAULT 3,
      caps JSONB DEFAULT '[]',
      cpu INT DEFAULT 0,
      mem INT DEFAULT 0
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      active BOOLEAN DEFAULT FALSE,
      nodes JSONB DEFAULT '[]',
      edges JSONB DEFAULT '[]'
    )
  `);
  await pgQuery(`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      userid TEXT NOT NULL,
      originalname TEXT NOT NULL,
      filename TEXT NOT NULL,
      mimetype TEXT NOT NULL,
      size INT NOT NULL,
      url TEXT NOT NULL,
      createdat TIMESTAMP DEFAULT NOW()
    )
  `);
  const { rows } = await pgQuery('SELECT COUNT(*) FROM agents');
  if (parseInt(rows[0].count) === 0) {
    const seed = [
      ['nucleus','Nucleus','Root Controller','active',1,JSON.stringify(['Governance','Orchestration']),12,45],
      ['ops','Ops Division','Infrastructure','active',2,JSON.stringify(['Monitor','Remediate']),34,60],
      ['dev','Dev Division','Code Review','active',2,JSON.stringify(['PR Review','Test Gen']),28,52],
      ['sec','Security','Threat Response','idle',2,JSON.stringify(['Audit','Rotate']),8,30],
      ['comm','Comms Agent','H2A Bridge','active',3,JSON.stringify(['Webhook','Queue']),15,40],
      ['memory','Memory Agent','State Manager','active',3,JSON.stringify(['Snapshot','RAG']),22,70],
    ];
    for (const a of seed) {
      await pgQuery('INSERT INTO agents(id,name,role,status,tier,caps,cpu,mem) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING', a);
    }
  }
}

// ── JSON-based fallback (local dev) ──
const jsonDB = {
  users: {
    getAll: async () => readJSON('users.json'),
    findByUsername: async (username) => readJSON('users.json').find(u => u.username === username) || null,
    findById: async (id) => readJSON('users.json').find(u => u.id === id) || null,
    create: async (user) => { const users = readJSON('users.json'); users.push(user); writeJSON('users.json', users); return user; },
  },
  messages: {
    getByUser: async (userId) => readJSON('messages.json').filter(m => m.userId === userId),
    add: async (msg) => { const msgs = readJSON('messages.json'); msgs.push(msg); writeJSON('messages.json', msgs); return msg; },
    clearByUser: async (userId) => { const msgs = readJSON('messages.json').filter(m => m.userId !== userId); writeJSON('messages.json', msgs); },
  },
  agents: {
    getAll: async () => readJSON('agents.json'),
    getById: async (id) => readJSON('agents.json').find(a => a.id === id) || null,
    create: async (agent) => { const agents = readJSON('agents.json'); agents.push(agent); writeJSON('agents.json', agents); return agent; },
    update: async (id, patch) => {
      const agents = readJSON('agents.json');
      const idx = agents.findIndex(a => a.id === id);
      if (idx === -1) return null;
      agents[idx] = { ...agents[idx], ...patch };
      writeJSON('agents.json', agents);
      return agents[idx];
    },
    delete: async (id) => { const agents = readJSON('agents.json').filter(a => a.id !== id); writeJSON('agents.json', agents); },
    seed: async () => {
      if (readJSON('agents.json').length === 0) {
        writeJSON('agents.json', [
          { id: 'nucleus', name: 'Nucleus', role: 'Root Controller', status: 'active', tier: 1, caps: ['Governance','Orchestration'], cpu: 12, mem: 45 },
          { id: 'ops', name: 'Ops Division', role: 'Infrastructure', status: 'active', tier: 2, caps: ['Monitor','Remediate'], cpu: 34, mem: 60 },
          { id: 'dev', name: 'Dev Division', role: 'Code Review', status: 'active', tier: 2, caps: ['PR Review','Test Gen'], cpu: 28, mem: 52 },
          { id: 'sec', name: 'Security', role: 'Threat Response', status: 'idle', tier: 2, caps: ['Audit','Rotate'], cpu: 8, mem: 30 },
          { id: 'comm', name: 'Comms Agent', role: 'H2A Bridge', status: 'active', tier: 3, caps: ['Webhook','Queue'], cpu: 15, mem: 40 },
          { id: 'memory', name: 'Memory Agent', role: 'State Manager', status: 'active', tier: 3, caps: ['Snapshot','RAG'], cpu: 22, mem: 70 },
        ]);
      }
    },
  },
  workflows: {
    getAll: async () => readJSON('workflows.json'),
    getById: async (id) => readJSON('workflows.json').find(w => w.id === id) || null,
    create: async (wf) => { const wfs = readJSON('workflows.json'); wfs.push(wf); writeJSON('workflows.json', wfs); return wf; },
    update: async (id, patch) => {
      const wfs = readJSON('workflows.json');
      const idx = wfs.findIndex(w => w.id === id);
      if (idx === -1) return null;
      wfs[idx] = { ...wfs[idx], ...patch };
      writeJSON('workflows.json', wfs);
      return wfs[idx];
    },
    delete: async (id) => { const wfs = readJSON('workflows.json').filter(w => w.id !== id); writeJSON('workflows.json', wfs); },
    seed: async () => {
      if (readJSON('workflows.json').length === 0) {
        writeJSON('workflows.json', [
          { id: 'ops-onboard', name: 'Ops Onboarding', active: true, nodes: [], edges: [] },
          { id: 'sec-audit', name: 'Security Audit', active: false, nodes: [], edges: [] },
        ]);
      }
    },
  },
  uploads: {
    getByUser: async (userId) => readJSON('uploads.json').filter(u => u.userId === userId),
    create: async (meta) => { const uploads = readJSON('uploads.json'); uploads.push(meta); writeJSON('uploads.json', uploads); return meta; },
    delete: async (id) => { const uploads = readJSON('uploads.json').filter(u => u.id !== id); writeJSON('uploads.json', uploads); },
  },
};

// ── PostgreSQL implementation ──
const pgDB = {
  users: {
    getAll: async () => { const r = await pgQuery('SELECT * FROM users'); return r.rows; },
    findByUsername: async (username) => { const r = await pgQuery('SELECT * FROM users WHERE username = $1', [username]); return r.rows[0] || null; },
    findById: async (id) => { const r = await pgQuery('SELECT * FROM users WHERE id = $1', [id]); return r.rows[0] || null; },
    create: async (user) => {
      await pgQuery('INSERT INTO users(id,username,passwordhash,createdat) VALUES($1,$2,$3,$4)',
        [user.id, user.username, user.passwordHash, user.createdAt]);
      return user;
    },
  },
  messages: {
    getByUser: async (userId) => {
      const r = await pgQuery('SELECT * FROM messages WHERE userid = $1 ORDER BY ts', [userId]);
      return r.rows.map(m => ({ ...m, userId: m.userid, attachments: m.attachments || [] }));
    },
    add: async (msg) => {
      await pgQuery('INSERT INTO messages(userid,role,content,attachments,ts) VALUES($1,$2,$3,$4,$5)',
        [msg.userId, msg.role, msg.content, JSON.stringify(msg.attachments || []), msg.ts]);
      return msg;
    },
    clearByUser: async (userId) => { await pgQuery('DELETE FROM messages WHERE userid = $1', [userId]); },
  },
  agents: {
    getAll: async () => {
      const r = await pgQuery('SELECT * FROM agents');
      return r.rows.map(a => ({ ...a, caps: typeof a.caps === 'string' ? JSON.parse(a.caps) : a.caps }));
    },
    getById: async (id) => {
      const r = await pgQuery('SELECT * FROM agents WHERE id = $1', [id]);
      if (!r.rows[0]) return null;
      return { ...r.rows[0], caps: typeof r.rows[0].caps === 'string' ? JSON.parse(r.rows[0].caps) : r.rows[0].caps };
    },
    create: async (agent) => {
      await pgQuery('INSERT INTO agents(id,name,role,status,tier,caps,cpu,mem) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
        [agent.id, agent.name, agent.role, agent.status, agent.tier, JSON.stringify(agent.caps || []), agent.cpu || 0, agent.mem || 0]);
      return agent;
    },
    update: async (id, patch) => {
      const agent = await pgDB.agents.getById(id);
      if (!agent) return null;
      const updated = { ...agent, ...patch };
      await pgQuery('UPDATE agents SET name=$1, role=$2, status=$3, tier=$4, caps=$5, cpu=$6, mem=$7 WHERE id=$8',
        [updated.name, updated.role, updated.status, updated.tier, JSON.stringify(updated.caps || []), updated.cpu || 0, updated.mem || 0, id]);
      return updated;
    },
    delete: async (id) => { await pgQuery('DELETE FROM agents WHERE id = $1', [id]); },
    seed: async () => {},
  },
  workflows: {
    getAll: async () => {
      const r = await pgQuery('SELECT * FROM workflows');
      return r.rows.map(w => ({ ...w, nodes: w.nodes || [], edges: w.edges || [] }));
    },
    getById: async (id) => {
      const r = await pgQuery('SELECT * FROM workflows WHERE id = $1', [id]);
      if (!r.rows[0]) return null;
      return { ...r.rows[0], nodes: r.rows[0].nodes || [], edges: r.rows[0].edges || [] };
    },
    create: async (wf) => {
      await pgQuery('INSERT INTO workflows(id,name,active,nodes,edges) VALUES($1,$2,$3,$4,$5)',
        [wf.id, wf.name, wf.active || false, JSON.stringify(wf.nodes || []), JSON.stringify(wf.edges || [])]);
      return wf;
    },
    update: async (id, patch) => {
      const wf = await pgDB.workflows.getById(id);
      if (!wf) return null;
      const updated = { ...wf, ...patch };
      await pgQuery('UPDATE workflows SET name=$1, active=$2, nodes=$3, edges=$4 WHERE id=$5',
        [updated.name, updated.active, JSON.stringify(updated.nodes || []), JSON.stringify(updated.edges || []), id]);
      return updated;
    },
    delete: async (id) => { await pgQuery('DELETE FROM workflows WHERE id = $1', [id]); },
    seed: async () => {},
  },
  uploads: {
    getByUser: async (userId) => {
      const r = await pgQuery('SELECT * FROM uploads WHERE userid = $1 ORDER BY createdat DESC', [userId]);
      return r.rows.map(u => ({ ...u, userId: u.userid, createdAt: u.createdat }));
    },
    create: async (meta) => {
      await pgQuery('INSERT INTO uploads(id,userid,originalname,filename,mimetype,size,url,createdat) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
        [meta.id, meta.userId, meta.originalName, meta.filename, meta.mimetype, meta.size, meta.url, meta.createdAt]);
      return meta;
    },
    delete: async (id) => { await pgQuery('DELETE FROM uploads WHERE id = $1', [id]); },
  },
  initPG,
};

const db = DATABASE_URL ? pgDB : jsonDB;
db.readJSON = async (file) => readJSON(file);
db.writeJSON = async (file, data) => writeJSON(file, data);
module.exports = db;
