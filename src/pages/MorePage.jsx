import { useState } from 'react';

export default function MorePage({ logout }) {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoRefresh: false,
    compactView: false,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const toggles = [
    { key: 'darkMode', label: 'Dark Mode', desc: 'Always use dark theme' },
    { key: 'notifications', label: 'Notifications', desc: 'Show update alerts' },
    { key: 'autoRefresh', label: 'Auto Refresh', desc: 'Reload on new builds' },
    { key: 'compactView', label: 'Compact View', desc: 'Reduce padding density' },
  ];

  return (
    <div style={{padding: '40px 60px', width: '100%', overflowY: 'auto'}}>
      <div className="header-bar">
        <span className="bar-num">MORE</span><div className="bar-line"></div>
        <span className="bar-stamp">SYSTEM SETTINGS &amp; PREFERENCES</span>
      </div>
      <div className="slide-title">Settings</div>
      <div className="slide-subtitle">Appearance, behavior, and system preferences</div>

      <div className="grid-2">
        <div>
          <div className="section-label">Interface</div>
          {toggles.map(t => (
            <div key={t.key} className="panel" style={{marginBottom: 10, borderRadius: 'var(--radius-md)', cursor: 'pointer'}} onClick={() => toggle(t.key)}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontSize: 13, fontWeight: 600, color: 'var(--text-primary)'}}>{t.label}</div>
                  <div style={{fontSize: 11, color: 'var(--text-muted)', marginTop: 2}}>{t.desc}</div>
                </div>
                <div style={{
                  width: 36, height: 20, borderRadius: 10,
                  background: settings[t.key] ? 'var(--text-primary)' : 'var(--bg-pill-dark)',
                  position: 'relative', transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#000',
                    position: 'absolute', top: 2,
                    left: settings[t.key] ? 18 : 2,
                    transition: 'left 0.2s'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="section-label">About</div>
          <div className="panel" style={{borderRadius: 'var(--radius-md)'}}>
            <div className="panel-title">System Information</div>
            <div className="annotation"><span>UI Replica Version: v1.0.0</span></div>
            <div className="annotation"><span>Blueprint Version: v2.0.0-replica-styled</span></div>
            <div className="annotation"><span>Unified Build: v2.1.0</span></div>
            <div className="annotation"><span>React: 18.2.0 | Vite: 5.0.8</span></div>
          </div>
          <div className="panel" style={{marginTop: 14, borderRadius: 'var(--radius-md)'}}>
            <div className="panel-title">Shortcuts</div>
            <div className="annotation"><span><strong>Home</strong> — Return to chat</span></div>
            <div className="annotation"><span><strong>Agents</strong> — Registry view</span></div>
            <div className="annotation"><span><strong>Blueprint</strong> — Architecture deck</span></div>
          </div>
          <button
            className="btn-pill btn-pill-outline"
            style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
