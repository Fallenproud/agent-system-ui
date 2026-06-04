import { useState, useEffect, useCallback } from 'react';
import { fetchWorkflows, createWorkflow, updateWorkflow, deleteWorkflow } from '../api/workflows';
import WorkflowDesigner from '../components/WorkflowDesigner';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [designerOpen, setDesignerOpen] = useState(false);
  const [editingWf, setEditingWf] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWorkflows();
      setWorkflows(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDesigner = (wf) => {
    setEditingWf(wf);
    setDesignerOpen(true);
  };

  const handleSave = async (wf) => {
    try {
      await updateWorkflow(wf.id, { name: wf.name, nodes: wf.nodes, edges: wf.edges });
      setDesignerOpen(false);
      setEditingWf(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const wf = await createWorkflow({ name: 'New Workflow', active: false, nodes: [], edges: [] });
      setWorkflows(prev => [wf, ...prev]);
      openDesigner(wf);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workflow?')) return;
    try {
      await deleteWorkflow(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (wf) => {
    try {
      await updateWorkflow(wf.id, { active: !wf.active });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (designerOpen && editingWf) {
    return <WorkflowDesigner workflow={editingWf} onSave={handleSave} onBack={() => { setDesignerOpen(false); setEditingWf(null); }} />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading workflows…</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 60px', width: '100%', overflowY: 'auto' }}>
      <div className="header-bar">
        <span className="bar-num">WF</span><div className="bar-line"></div>
        <span className="bar-stamp">AUTOMATED WORKFLOW DEFINITIONS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="slide-title">Workflows</div>
          <div className="slide-subtitle">Lane queue definitions and execution graphs</div>
        </div>
        <button className="btn-pill btn-pill-dark" onClick={handleCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Workflow
        </button>
      </div>

      {error && (
        <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 16 }}>{error}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {workflows.map(wf => (
          <div key={wf.id} className="panel" style={{ borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{wf.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="tag"
                  style={{
                    color: wf.active ? 'var(--success)' : 'var(--text-muted)',
                    borderColor: wf.active ? 'var(--success)' : 'var(--text-muted)',
                    cursor: 'pointer', background: 'none',
                  }}
                  onClick={() => handleToggle(wf)}
                >
                  {wf.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
                <button className="btn-pill btn-pill-outline" onClick={() => openDesigner(wf)}>
                  Open Designer
                </button>
                <button className="btn-icon btn-icon-ghost" onClick={() => handleDelete(wf.id)} aria-label="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {wf.nodes?.length || 0} nodes · {wf.edges?.length || 0} connections
            </div>
          </div>
        ))}
        {workflows.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No workflows yet. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}
