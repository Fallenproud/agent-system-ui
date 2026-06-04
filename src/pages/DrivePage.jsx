import { useState } from 'react';

const initialFiles = [
  { name: 'IDENTITY.md', type: 'doc', size: '2.4 KB', updated: '2h ago' },
  { name: 'SOUL.md', type: 'doc', size: '1.8 KB', updated: '2h ago' },
  { name: 'agent_card.yaml', type: 'code', size: '890 B', updated: '1d ago' },
  { name: 'deploy.sh', type: 'code', size: '3.2 KB', updated: '3d ago' },
  { name: 'terraform/', type: 'folder', size: '—', updated: '1w ago' },
  { name: 'helm-charts/', type: 'folder', size: '—', updated: '1w ago' },
];

const iconFor = (type) => {
  if (type === 'folder') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
  if (type === 'code') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
};

export default function DrivePage() {
  const [files] = useState(initialFiles);

  return (
    <div style={{padding: '40px 60px', width: '100%', overflowY: 'auto'}}>
      <div className="header-bar">
        <span className="bar-num">DRIVE</span><div className="bar-line"></div>
        <span className="bar-stamp">PROJECT FILES &amp; ASSETS</span>
      </div>
      <div className="slide-title">Drive</div>
      <div className="slide-subtitle">Configuration files, manifests, and deployment scripts</div>

      <div style={{border: '1px solid var(--border-input)', borderRadius: 'var(--radius-md)', overflow: 'hidden'}}>
        {files.map((f, i) => (
          <div key={f.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px',
            borderBottom: i < files.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
          }}>
            <span style={{color: 'var(--text-secondary)'}}>{iconFor(f.type)}</span>
            <span style={{flex: 1, fontSize: 13, color: 'var(--text-primary)'}}>{f.name}</span>
            <span className="mono" style={{width: 70, textAlign: 'right'}}>{f.size}</span>
            <span className="mono" style={{width: 70, textAlign: 'right', color: 'var(--text-muted)'}}>{f.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
