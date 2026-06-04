import { useState } from 'react';

export default function ClawPage() {
  const [cmd, setCmd] = useState('');
  const [history, setHistory] = useState([
    { type: 'out', text: 'Claw tool initialized. Awaiting command.' },
    { type: 'in', text: 'scan --target=nucleus' },
    { type: 'out', text: 'Scan complete. 4 active nodes, 0 anomalies detected.' },
  ]);

  const run = () => {
    if (!cmd.trim()) return;
    setHistory(h => [...h, { type: 'in', text: cmd }]);
    setTimeout(() => {
      setHistory(h => [...h, { type: 'out', text: `Executed: ${cmd}. OK.` }]);
    }, 400);
    setCmd('');
  };

  return (
    <div style={{padding: '40px 60px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div className="header-bar">
        <span className="bar-num">CLAW</span><div className="bar-line"></div>
        <span className="bar-stamp">COMMAND LINE AGENT INTERFACE</span>
      </div>
      <div className="slide-title">Claw Terminal</div>
      <div className="slide-subtitle">Direct agent control and diagnostics</div>

      <div className="code-block" style={{flex: 1, overflowY: 'auto', marginBottom: 16, borderRadius: 'var(--radius-md)'}}>
        {history.map((h, i) => (
          <div key={i} style={{marginBottom: 6, color: h.type === 'in' ? 'var(--text-primary)' : 'var(--text-secondary)'}}>
            <span className="mono" style={{color: h.type === 'in' ? 'var(--accent-dim)' : 'var(--text-muted)', marginRight: 8}}>
              {h.type === 'in' ? '>' : '$'}
            </span>
            {h.text}
          </div>
        ))}
      </div>

      <div style={{display: 'flex', gap: 10}}>
        <input
          className="chat-input"
          style={{flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 0}}
          placeholder="Enter command..."
          value={cmd}
          onChange={e => setCmd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
        />
        <button className="btn-pill btn-pill-dark" onClick={run}>Execute</button>
      </div>
    </div>
  );
}
