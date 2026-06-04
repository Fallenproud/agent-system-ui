import { useState, useEffect, useCallback } from 'react';
import { fetchAgents, createAgent, updateAgent, deleteAgent } from '../api/agents';

const statusDot = (s) => s === 'active' ? 'dot green' : s === 'idle' ? 'dot amber' : 'dot red';
const statusOptions = ['active', 'idle', 'error'];
const capSuggestions = ['Governance','Orchestration','Monitor','Remediate','PR Review','Test Gen','Audit','Rotate','Webhook','Queue','Snapshot','RAG','Deploy','Scale'];

function AgentModal({ agent, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', role: '', status: 'idle', tier: 3, caps: [], cpu: 0, mem: 0, ...agent,
  });
  const [capInput, setCapInput] = useState('');

  const toggleCap = (c) => {
    setForm(prev => ({
      ...prev,
      caps: prev.caps.includes(c) ? prev.caps.filter(x => x !== c) : [...prev.caps, c],
    }));
  };

  const addCustomCap = () => {
    const c = capInput.trim();
    if (c && !form.caps.includes(c)) {
      setForm(prev => ({ ...prev, caps: [...prev.caps, c] }));
      setCapInput('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>{agent ? 'Edit Agent' : 'New Agent'}</h3>
          <button className="btn-icon btn-icon-ghost" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Name
            <input className="chat-input" style={{ marginTop: 6 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </label>
          <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Role
            <input className="chat-input" style={{ marginTop: 6 }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status
              <select className="chat-input" style={{ marginTop: 6 }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tier
              <input className="chat-input" type="number" min={1} max={3} style={{ marginTop: 6 }} value={form.tier} onChange={e => setForm({ ...form, tier: Number(e.target.value) })} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Base CPU %
              <input className="chat-input" type="number" min={0} max={100} style={{ marginTop: 6 }} value={form.cpu} onChange={e => setForm({ ...form, cpu: Number(e.target.value) })} />
            </label>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Base Memory %
              <input className="chat-input" type="number" min={0} max={100} style={{ marginTop: 6 }} value={form.mem} onChange={e => setForm({ ...form, mem: Number(e.target.value) })} />
            </label>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Capabilities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {capSuggestions.map(c => (
                <button key={c} className={`btn-pill ${form.caps.includes(c) ? 'btn-pill-dark' : 'btn-pill-outline'}`} style={{ fontSize: 11 }} onClick={() => toggleCap(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="chat-input" placeholder="Custom cap…" value={capInput} onChange={e => setCapInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomCap()} />
              <button className="btn-pill btn-pill-outline" onClick={addCustomCap}>Add</button>
            </div>
          </div>
          <button className="btn-pill btn-pill-dark" style={{ justifyContent: 'center', marginTop: 4 }} onClick={() => onSave(form)}>
            {agent ? 'Save Changes' : 'Create Agent'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAgents();
      setAgents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    try {
      if (editing) {
        await updateAgent(editing.id, form);
      } else {
        await createAgent(form);
      }
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this agent?')) return;
    try {
      await deleteAgent(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (agent) => { setEditing(agent); setModalOpen(true); };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading agents…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 60px', width: '100%', overflowY: 'auto' }}>
      <div className="header-bar">
        <span className="bar-num">AGENTS</span><div className="bar-line"></div>
        <span className="bar-stamp">ALL REGISTERED AGENT NODES</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="slide-title">Agent Registry</div>
          <div className="slide-subtitle">Active divisions, capabilities, and health status</div>
        </div>
        <button className="btn-pill btn-pill-dark" onClick={openNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Agent
        </button>
      </div>

      {error && (
        <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16 }}>{error}</div>
      )}

      <div className="grid-3">
        {agents.map(a => (
          <div key={a.id} className="panel" style={{ borderRadius: 'var(--radius-md)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
              <button className="btn-icon btn-icon-ghost" onClick={() => openEdit(a)} aria-label="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button className="btn-icon btn-icon-ghost" onClick={() => handleDelete(a.id)} aria-label="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div className={statusDot(a.status)} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</span>
            </div>
            <div className="mono" style={{ marginBottom: 8 }}>{a.role}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Permission Tier {a.tier}</div>
            <div className="tier-items">
              {a.caps?.map(c => <span key={c} className="tier-item">{c}</span>)}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AgentModal agent={editing} onSave={handleSave} onClose={() => { setModalOpen(false); setEditing(null); }} />
      )}
    </div>
  );
}
