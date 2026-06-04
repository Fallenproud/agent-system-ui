export default function Slide04() {
  return (
    <section className="slide" id="slide-4">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">04</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 4 // DIVISION-SCALING-OPS</span>
  </div>
 
  <div className="slide-title">Division Scaling & Autonomous Operations</div>
  <div className="slide-subtitle">Phase 7–16 Operational Rollout · A2A Delegation · Governance Council</div>
 
  <div className="section-label">Phase 7–16 — Division Rollout Sequence</div>
  <div style={{marginBottom: 20}}>
    <div className="phase-track">
      <div className="phase-block"><span className="ph-num">07</span><span className="ph-label">OPS<br/>DIVISION</span></div>
      <div className="phase-block"><span className="ph-num">08</span><span className="ph-label">DEV<br/>DIVISION</span></div>
      <div className="phase-block"><span className="ph-num">09</span><span className="ph-label">SEC<br/>DIVISION</span></div>
      <div className="phase-block"><span className="ph-num">10</span><span className="ph-label">A2A<br/>PROTOCOL</span></div>
      <div className="phase-block"><span className="ph-num">11</span><span className="ph-label">GOV<br/>COUNCIL</span></div>
      <div className="phase-block"><span className="ph-num">12</span><span className="ph-label">AUTO<br/>SCALING</span></div>
      <div className="phase-block"><span className="ph-num">13</span><span className="ph-label">SELF<br/>OPT</span></div>
      <div className="phase-block"><span className="ph-num">14</span><span className="ph-label">AUDIT<br/>TRAIL</span></div>
      <div className="phase-block"><span className="ph-num">15</span><span className="ph-label">CROSS<br/>DIV OPS</span></div>
      <div className="phase-block"><span className="ph-num">16</span><span className="ph-label">FULL<br/>AUTO</span></div>
    </div>
  </div>
 
  <div className="grid-3" style={{marginBottom: 20}}>
    <div className="panel">
      <div className="panel-title">P7 — Operations Division</div>
      <div className="annotation"><span>Infrastructure monitoring &amp; alerting</span></div>
      <div className="annotation"><span>Automated remediation playbooks</span></div>
      <div className="annotation"><span>Incident response &amp; escalation trees</span></div>
      <div className="annotation"><span>SLA tracking &amp; reporting</span></div>
      <p className="mono" style={{marginTop: 8}}>DEPENDENCIES: P1–P6 complete</p>
    </div>
    <div className="panel amber">
      <div className="panel-title">P8 — Development Division</div>
      <div className="annotation warn"><span>Autonomous code review &amp; PR analysis</span></div>
      <div className="annotation warn"><span>Test generation &amp; regression coverage</span></div>
      <div className="annotation warn"><span>Dependency audit &amp; vulnerability scan</span></div>
      <div className="annotation warn"><span>Feature flag management</span></div>
      <p className="mono" style={{marginTop: 8, color: "var(--text-secondary)"}}>DEPENDENCIES: P7 healthy</p>
    </div>
    <div className="panel red">
      <div className="panel-title">P9 — Security Division</div>
      <div className="annotation err"><span>Permission boundary enforcement</span></div>
      <div className="annotation err"><span>Anomaly detection on agent behavior</span></div>
      <div className="annotation err"><span>Credential rotation orchestration</span></div>
      <div className="annotation err"><span>Threat modeling &amp; red-team integration</span></div>
      <p className="mono" style={{marginTop: 8, color: "var(--text-secondary)"}}>GATE: must pass before P10</p>
    </div>
  </div>
 
  <div className="grid-2" style={{marginBottom: 20}}>
    <div>
      <div className="section-label">A2A Delegation Architecture</div>
      <div className="flow-row" style={{flexWrap: "wrap", gap: 4, marginBottom: 12}}>
        <div className="flow-node">NUCLEUS</div>
        <div className="flow-arrow"></div>
        <div className="flow-node amber">AGENT CARD<br/>REGISTRY</div>
        <div className="flow-arrow amber"></div>
        <div className="flow-node green">TARGET<br/>DIVISION</div>
      </div>
      <div className="panel">
        <div className="panel-title">Agent Card Schema (Sample)</div>
        <div className="code-block" dangerouslySetInnerHTML={{__html: `
<span className="cmt"># agent_card.yaml</span>
<span className="kw">agent_id:</span> <span className="str">"[AGENT_UUID]"</span>
<span className="kw">role:</span> <span className="str">"[DIVISION_ROLE]"</span>
<span className="kw">capabilities:</span> [<span className="val">list, of, tools</span>]
<span className="kw">permission_tier:</span> <span className="str">"[1-5]"</span>
<span className="kw">endpoint:</span> <span className="str">"[INTERNAL_URL]"</span>
<span className="kw">heartbeat_ttl:</span> <span className="val">30s</span>
<span className="cmt"># Alternatives: gRPC contracts, OpenAPI specs</span>
        `}} />
      </div>
    </div>
 
    <div>
      <div className="section-label">Governance Council (P11)</div>
      <div className="panel gold">
        <div className="panel-title">Council Composition</div>
        <div className="status-row"><div className="dot cyan"></div><p style={{fontSize: 12}}><strong>Nucleus</strong> — Voting quorum anchor (always present)</p></div>
        <div className="status-row"><div className="dot amber"></div><p style={{fontSize: 12}}><strong>Division Heads</strong> — One vote per division</p></div>
        <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}><strong>Security Agent</strong> — Veto power on permission changes</p></div>
        <div className="status-row"><div className="dot red"></div><p style={{fontSize: 12}}><strong>Human-in-Loop</strong> — Override authority, always callable</p></div>
      </div>
      <div className="panel" style={{marginTop: 14}}>
        <div className="panel-title">Decision Protocol</div>
        <div className="annotation"><span>Majority vote for operational decisions (≥ 50%+1)</span></div>
        <div className="annotation"><span>Supermajority for permission/identity changes (≥ 66%)</span></div>
        <div className="annotation warn"><span>Human escalation: automatic if no quorum in 60s</span></div>
      </div>
    </div>
  </div>
 
  {/* Autonomous Operations Matrix */}
  <div className="section-label">Autonomous Operations Capability Matrix</div>
  <table className="bp-table">
    <tr>
      <th>Capability</th><th>Phase Gate</th><th>Human Required</th><th>Automation Level</th><th>Risk Tier</th>
    </tr>
    <tr><td>Log monitoring &amp; alerting</td><td className="mono">P7</td><td>Notify only</td><td style={{color: "var(--text-secondary)"}}>FULL AUTO</td><td style={{color: "var(--text-secondary)"}}>LOW</td></tr>
    <tr><td>Code PR review</td><td className="mono">P8</td><td>Approve merge</td><td style={{color: "var(--text-secondary)"}}>SEMI-AUTO</td><td style={{color: "var(--text-secondary)"}}>MEDIUM</td></tr>
    <tr><td>Credential rotation</td><td className="mono">P9</td><td>Confirm rotation</td><td style={{color: "var(--text-secondary)"}}>SEMI-AUTO</td><td style={{color: "var(--text-secondary)"}}>MEDIUM</td></tr>
    <tr><td>Cross-division task delegation</td><td className="mono">P10</td><td>None (council voted)</td><td style={{color: "var(--text-secondary)"}}>FULL AUTO</td><td style={{color: "var(--text-secondary)"}}>LOW</td></tr>
    <tr><td>Permission boundary change</td><td className="mono">P11</td><td>Mandatory approval</td><td style={{color: "var(--text-secondary)"}}>MANUAL</td><td style={{color: "var(--text-secondary)"}}>HIGH</td></tr>
    <tr><td>Infrastructure scaling</td><td className="mono">P12</td><td>Threshold override</td><td style={{color: "var(--text-secondary)"}}>FULL AUTO</td><td style={{color: "var(--text-secondary)"}}>LOW</td></tr>
  </table>
 
  <div className="page-stamp">PAGE <span className="pg">04</span> / 09</div>

    </section>
  );
}
