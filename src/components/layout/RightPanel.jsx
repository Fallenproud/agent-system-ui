import LiveDashboard from '../LiveDashboard';

export default function RightPanel({ view }) {
  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <div className="panel-header">
              <div className="tabs"><button className="tab active">Design Files</button></div>
              <button className="zoom-dropdown">100% <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
            <div className="panel-subheader">
              <span className="subheader-title">Project</span>
              <button className="btn-icon btn-icon-ghost" aria-label="Settings">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
            <div className="panel-content"><div className="empty-state">No files yet</div></div>
          </>
        );
      case 'blueprint':
        return (
          <>
            <div className="panel-header">
              <div className="tabs"><button className="tab active">Blueprint</button></div>
            </div>
            <div className="panel-content" style={{alignItems: 'flex-start', justifyContent: 'flex-start', padding: '16px 20px', overflowY: 'auto'}}>
              <div className="section-label" style={{marginBottom: 12}}>Navigation</div>
              {['Cover','Overview','Foundation','Scaling','Comms','Roadmap','DO/DON\'T','Deployment','Matrix'].map((s, i) => (
                <div key={i} className="annotation" style={{fontSize: 12, marginBottom: 8, cursor: 'pointer'}}>
                  <span style={{color: 'var(--text-secondary)'}}>0{i+1} — {s}</span>
                </div>
              ))}
              <div className="h-rule" style={{margin: '16px 0'}} />
              <div className="section-label" style={{marginBottom: 12}}>Phase Tracker</div>
              <div className="phase-track" style={{flexDirection: 'column', gap: 4}}>
                {['Infra','Secrets','Memory','Nucleus','Comms','Division'].map((p, i) => (
                  <div key={i} className="phase-block" style={{textAlign: 'left', padding: '6px 10px'}}>
                    <span className="ph-num" style={{fontSize: 12, display: 'inline', marginRight: 8}}>0{i+1}</span>
                    <span className="ph-label" style={{display: 'inline', marginTop: 0}}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'agents':
        return (
          <>
            <div className="panel-header"><div className="tabs"><button className="tab active">Agent Details</button></div></div>
            <div className="panel-content" style={{alignItems: 'flex-start', justifyContent: 'flex-start', padding: '16px 20px'}}>
              <div className="panel" style={{width: '100%', marginBottom: 12}}>
                <div className="panel-title">Status</div>
                <div className="status-row"><div className="dot green" />Active — 12 agents</div>
                <div className="status-row"><div className="dot amber" />Idle — 3 agents</div>
                <div className="status-row"><div className="dot red" />Offline — 1 agent</div>
              </div>
              <div className="panel" style={{width: '100%'}}>
                <div className="panel-title">Capabilities</div>
                <div className="tier-items" style={{marginTop: 8}}>
                  {['MCP','A2A','Webhook','Lane Q','Snapshot'].map(c => (
                    <span key={c} className="tier-item">{c}</span>
                  ))}
                </div>
              </div>
              <div className="h-rule" style={{margin: '12px 0'}} />
              <LiveDashboard />
            </div>
          </>
        );
      case 'workflows':
      case 'teams':
      case 'drive':
      case 'claw':
      case 'more':
        return (
          <>
            <div className="panel-header"><div className="tabs"><button className="tab active">Live Metrics</button></div></div>
            <div className="panel-content" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <LiveDashboard />
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="panel-header"><div className="tabs"><button className="tab active">Info</button></div></div>
            <div className="panel-content"><div className="empty-state">Select a view</div></div>
          </>
        );
    }
  };

  return <aside className="right-panel">{renderContent()}</aside>;
}
