export default function Slide02() {
  return (
    <section className="slide" id="slide-2">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">02</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 2 // EXEC-ARCH-OVERVIEW</span>
  </div>
 
  <div className="slide-title">Executive Architecture Overview</div>
  <div className="slide-subtitle">Core Autonomous System Concepts · Separation Patterns · Execution Strategies</div>
 
  {/* Core architecture concept */}
  <div className="section-label">Core Concept — Recursive Self-Similar Structure</div>
  <div className="grid-2" style={{marginBottom: 24}}>
    <div>
      <p style={{marginBottom: 12}}>The foundation of a universal autonomous agent system rests on a <strong>recursive self-similar architecture</strong> — each division mirrors the capabilities of the parent nucleus, enabling fractal-style scaling without architectural debt.</p>
      <div className="panel" style={{marginTop: 12}}>
        <div className="panel-title">Structural Invariants</div>
        <div className="annotation"><span>Every agent node exposes identical interface contracts regardless of tier depth</span></div>
        <div className="annotation"><span>Parent-child relationships governed by capability inheritance, not inheritance of state</span></div>
        <div className="annotation"><span>Each node independently restartable, observable, and replaceable</span></div>
      </div>
    </div>
    <div>
      {/* SVG recursive diagram */}
      <svg viewBox="0 0 320 220" className="arch-svg" style={{maxWidth: 320}}>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="rgba(0,229,255,0.6)"/>
          </marker>
        </defs>
        {/* Nucleus */}
        <rect x="110" y="10" width="100" height="40" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        <text x="160" y="35" textAnchor="middle" fill="var(--text-primary)" font-family="'Share Tech Mono'" font-size="10">NUCLEUS</text>
        {/* Arrows down */}
        <line x1="130" y1="50" x2="80" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="160" y1="50" x2="160" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="190" y1="50" x2="240" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" markerEnd="url(#arr)"/>
        {/* Div A */}
        <rect x="40" y="100" width="80" height="34" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <text x="80" y="122" textAnchor="middle" fill="var(--text-secondary)" font-family="'Share Tech Mono'" font-size="9">DIV-A</text>
        {/* Div B */}
        <rect x="120" y="100" width="80" height="34" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <text x="160" y="122" textAnchor="middle" fill="var(--text-secondary)" font-family="'Share Tech Mono'" font-size="9">DIV-B</text>
        {/* Div C */}
        <rect x="200" y="100" width="80" height="34" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <text x="240" y="122" textAnchor="middle" fill="var(--text-secondary)" font-family="'Share Tech Mono'" font-size="9">DIV-C</text>
        {/* Sub agents */}
        <line x1="60" y1="134" x2="52" y2="172" stroke="rgba(255,255,255,0.08)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="80" y1="134" x2="80" y2="172" stroke="rgba(255,255,255,0.08)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="100" y1="134" x2="108" y2="172" stroke="rgba(255,255,255,0.08)" strokeWidth="1" markerEnd="url(#arr)"/>
        <rect x="32" y="172" width="48" height="26" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <text x="56" y="188" textAnchor="middle" fill="rgba(255,255,255,0.25)" font-family="'Share Tech Mono'" font-size="8">sub-a1</text>
        <rect x="64" y="172" width="48" height="26" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <text x="88" y="188" textAnchor="middle" fill="rgba(255,255,255,0.25)" font-family="'Share Tech Mono'" font-size="8">sub-a2</text>
        {/* Labels */}
        <text x="160" y="210" textAnchor="middle" fill="rgba(255,255,255,0.15)" font-family="'Share Tech Mono'" font-size="8">RECURSIVE SELF-SIMILAR TOPOLOGY</text>
      </svg>
    </div>
  </div>
 
  <hr className="h-rule" />
 
  {/* Separation patterns */}
  <div className="section-label">IDENTITY / SOUL Separation Pattern</div>
  <div className="grid-3" style={{marginBottom: 20}}>
    <div className="panel">
      <div className="panel-title">IDENTITY.md — WHO</div>
      <div className="annotation"><span>Name, role, organizational position</span></div>
      <div className="annotation"><span>Capabilities manifest and tool authorizations</span></div>
      <div className="annotation"><span>Static: changes require governance approval</span></div>
    </div>
    <div className="panel amber">
      <div className="panel-title">SOUL.md — HOW</div>
      <div className="annotation warn"><span>Behavioral rules, ethical constraints</span></div>
      <div className="annotation warn"><span>Tone, decision heuristics, escalation triggers</span></div>
      <div className="annotation warn"><span>Mutable: updated via approved hot-reload path</span></div>
    </div>
    <div className="panel green">
      <div className="panel-title">ALTERNATIVE PATTERNS</div>
      <div className="annotation ok"><span>Role-config + Policy-config split</span></div>
      <div className="annotation ok"><span>Capability manifest + Behavior contract</span></div>
      <div className="annotation ok"><span>Static persona + Dynamic instruction layer</span></div>
    </div>
  </div>
 
  {/* Lane Queue + Semantic Snapshots */}
  <div className="grid-2">
    <div>
      <div className="section-label">Lane Queue — Execution Strategy</div>
      <div className="flow-row">
        <div className="flow-node amber">INBOUND</div><div className="flow-arrow amber"></div>
        <div className="flow-node">QUEUE</div><div className="flow-arrow"></div>
        <div className="flow-node green">PROCESS</div><div className="flow-arrow"></div>
        <div className="flow-node">OUTPUT</div>
      </div>
      <p style={{marginTop: 8, fontSize: 12}}>Serial lane processing ensures <strong>deterministic execution</strong> — no concurrent writes to shared state. Each message type (ops, comms, dev) routed to dedicated lane.</p>
    </div>
    <div>
      <div className="section-label">Semantic Snapshots — Navigation Strategy</div>
      <div className="panel">
        <div className="panel-title">Snapshot Concept</div>
        <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>Compressed semantic state saved at context boundaries</p></div>
        <div className="status-row"><div className="dot cyan"></div><p style={{fontSize: 12}}>Reduces token replay cost by <strong>60–80%</strong> vs full-history replay</p></div>
        <div className="status-row"><div className="dot amber"></div><p style={{fontSize: 12}}>Alternative: RAG-backed history retrieval for dynamic recall</p></div>
      </div>
    </div>
  </div>
 
  <div className="page-stamp">PAGE <span className="pg">02</span> / 09</div>

    </section>
  );
}
