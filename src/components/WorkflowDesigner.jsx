import { useState, useRef, useEffect, useCallback } from 'react';

const NODE_W = 160;
const NODE_H = 64;
const PORT_R = 5;

const NODE_TYPES = [
  { type: 'start', label: 'Start', icon: '▶' },
  { type: 'task', label: 'Task', icon: '⚙' },
  { type: 'agent', label: 'Agent', icon: '◉' },
  { type: 'decision', label: 'Decision', icon: '◈' },
  { type: 'end', label: 'End', icon: '■' },
];

function nodeColor(type) {
  switch (type) {
    case 'start': return 'var(--success)';
    case 'end': return '#ff6b6b';
    case 'decision': return 'var(--accent)';
    default: return 'var(--text-muted)';
  }
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function WorkflowDesigner({ workflow, onSave, onBack }) {
  const [nodes, setNodes] = useState(workflow.nodes || []);
  const [edges, setEdges] = useState(workflow.edges || []);
  const [selectedId, setSelectedId] = useState(null);
  const [dragging, setDragging] = useState(null); // {id, offsetX, offsetY}
  const [connecting, setConnecting] = useState(null); // {fromId}
  const [name, setName] = useState(workflow.name);
  const canvasRef = useRef(null);

  useEffect(() => {
    setNodes(workflow.nodes || []);
    setEdges(workflow.edges || []);
    setName(workflow.name);
  }, [workflow.id]);

  const toCanvasPoint = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const addNode = (type, x, y) => {
    const t = NODE_TYPES.find(n => n.type === type);
    const node = {
      id: generateId(),
      type,
      x: x - NODE_W / 2,
      y: y - NODE_H / 2,
      label: t?.label || type,
      config: {},
    };
    setNodes(prev => [...prev, node]);
    setSelectedId(node.id);
  };

  const updateNode = (id, patch) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
  };

  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const deleteEdge = (id) => {
    setEdges(prev => prev.filter(e => e.id !== id));
  };

  const onMouseDownNode = (e, id) => {
    e.stopPropagation();
    const pt = toCanvasPoint(e.clientX, e.clientY);
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    setDragging({ id, offsetX: pt.x - node.x, offsetY: pt.y - node.y });
    setSelectedId(id);
  };

  const onMouseDownPort = (e, id) => {
    e.stopPropagation();
    setConnecting({ fromId: id });
  };

  const onMouseMove = useCallback((e) => {
    if (dragging) {
      const pt = toCanvasPoint(e.clientX, e.clientY);
      setNodes(prev => prev.map(n => n.id === dragging.id ? { ...n, x: pt.x - dragging.offsetX, y: pt.y - dragging.offsetY } : n));
    }
  }, [dragging]);

  const onMouseUp = useCallback((e) => {
    if (dragging) {
      setDragging(null);
      return;
    }
    if (connecting) {
      // Check if we released on a node
      const pt = toCanvasPoint(e.clientX, e.clientY);
      const target = nodes.find(n =>
        pt.x >= n.x && pt.x <= n.x + NODE_W &&
        pt.y >= n.y && pt.y <= n.y + NODE_H
      );
      if (target && target.id !== connecting.fromId) {
        const exists = edges.some(ed => ed.from === connecting.fromId && ed.to === target.id);
        if (!exists) {
          setEdges(prev => [...prev, { id: generateId(), from: connecting.fromId, to: target.id }]);
        }
      }
      setConnecting(null);
    }
  }, [dragging, connecting, nodes, edges]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const selectedNode = nodes.find(n => n.id === selectedId);

  const portPos = (node, isInput) => ({
    x: node.x + NODE_W / 2,
    y: isInput ? node.y : node.y + NODE_H,
  });

  const handleSave = () => {
    onSave({ ...workflow, name, nodes, edges });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <button className="btn-pill btn-pill-outline" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <input
          className="chat-input"
          style={{ width: 220, fontSize: 13 }}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Workflow name"
        />
        <div style={{ flex: 1 }} />
        <button className="btn-pill btn-pill-dark" onClick={handleSave}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
          </svg>
          Save
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Palette */}
        <div style={{ width: 180, borderRight: '1px solid var(--border-subtle)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Nodes</div>
          {NODE_TYPES.map(t => (
            <button
              key={t.type}
              className="btn-pill btn-pill-outline"
              style={{ justifyContent: 'flex-start', gap: 8, fontSize: 12 }}
              onClick={() => {
                const rect = canvasRef.current.getBoundingClientRect();
                addNode(t.type, rect.width / 2, rect.height / 2);
              }}
            >
              <span style={{ color: nodeColor(t.type) }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Click to add at center. Drag nodes to move. Click output port then target node to connect.
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} style={{ flex: 1, position: 'relative', background: 'var(--bg-page)', overflow: 'hidden', cursor: connecting ? 'crosshair' : 'default' }}
          onClick={() => { if (!connecting) setSelectedId(null); }}
        >
          {/* Grid dots */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: 'radial-gradient(circle, var(--text-muted) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }} />

          {/* Edges SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {edges.map(e => {
              const from = nodes.find(n => n.id === e.from);
              const to = nodes.find(n => n.id === e.to);
              if (!from || !to) return null;
              const p1 = portPos(from, false);
              const p2 = portPos(to, true);
              const d = `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + 40}, ${p2.x} ${p2.y - 40}, ${p2.x} ${p2.y}`;
              return (
                <g key={e.id}>
                  <path d={d} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="4 2" />
                  <circle cx={p2.x} cy={p2.y} r={3} fill="var(--text-muted)" />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map(n => (
            <div
              key={n.id}
              onMouseDown={e => onMouseDownNode(e, n.id)}
              style={{
                position: 'absolute',
                left: n.x, top: n.y,
                width: NODE_W, height: NODE_H,
                background: 'var(--bg-card)',
                border: `1px solid ${selectedId === n.id ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: 'var(--text-primary)',
                cursor: dragging?.id === n.id ? 'grabbing' : 'grab',
                zIndex: 2, userSelect: 'none',
                boxShadow: selectedId === n.id ? '0 0 0 1px var(--text-primary)' : 'none',
              }}
            >
              {/* Input port */}
              <div
                style={{
                  position: 'absolute', top: -PORT_R, left: '50%', transform: 'translateX(-50%)',
                  width: PORT_R * 2, height: PORT_R * 2, borderRadius: '50%',
                  background: 'var(--bg-card)', border: '1px solid var(--text-muted)',
                }}
              />
              {/* Output port */}
              <div
                onMouseDown={e => onMouseDownPort(e, n.id)}
                style={{
                  position: 'absolute', bottom: -PORT_R, left: '50%', transform: 'translateX(-50%)',
                  width: PORT_R * 2, height: PORT_R * 2, borderRadius: '50%',
                  background: nodeColor(n.type), border: `1px solid ${nodeColor(n.type)}`,
                  cursor: 'crosshair', zIndex: 3,
                }}
              />
              <span style={{ marginRight: 6, color: nodeColor(n.type) }}>
                {NODE_TYPES.find(t => t.type === n.type)?.icon}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>
                {n.label}
              </span>
            </div>
          ))}
        </div>

        {/* Properties */}
        <div style={{ width: 240, borderLeft: '1px solid var(--border-subtle)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Properties</div>
          {selectedNode ? (
            <>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Label
                <input className="chat-input" style={{ marginTop: 6 }} value={selectedNode.label} onChange={e => updateNode(selectedNode.id, { label: e.target.value })} />
              </label>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Type
                <select className="chat-input" style={{ marginTop: 6 }} value={selectedNode.type} onChange={e => updateNode(selectedNode.id, { type: e.target.value })}>
                  {NODE_TYPES.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
                </select>
              </label>
              {selectedNode.type === 'agent' && (
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Agent ID
                  <input className="chat-input" style={{ marginTop: 6 }} value={selectedNode.config?.agentId || ''} onChange={e => updateNode(selectedNode.id, { config: { ...selectedNode.config, agentId: e.target.value } })} />
                </label>
              )}
              {selectedNode.type === 'task' && (
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Command
                  <input className="chat-input" style={{ marginTop: 6 }} value={selectedNode.config?.command || ''} onChange={e => updateNode(selectedNode.id, { config: { ...selectedNode.config, command: e.target.value } })} />
                </label>
              )}
              {selectedNode.type === 'decision' && (
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Condition
                  <input className="chat-input" style={{ marginTop: 6 }} value={selectedNode.config?.condition || ''} onChange={e => updateNode(selectedNode.id, { config: { ...selectedNode.config, condition: e.target.value } })} />
                </label>
              )}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Incoming edges</div>
                {edges.filter(e => e.to === selectedNode.id).map(e => {
                  const from = nodes.find(n => n.id === e.from);
                  return (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      <span>{from?.label || e.from}</span>
                      <button className="btn-icon btn-icon-ghost" onClick={() => deleteEdge(e.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  );
                })}
                {edges.filter(e => e.to === selectedNode.id).length === 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>None</span>}
              </div>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn-pill btn-pill-outline" style={{ width: '100%', justifyContent: 'center', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.4)' }} onClick={() => deleteNode(selectedNode.id)}>
                  Delete Node
                </button>
              </div>
            </>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select a node to edit properties.</span>
          )}
        </div>
      </div>
    </div>
  );
}
