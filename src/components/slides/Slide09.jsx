export default function Slide09() {
  return (
    <section className="slide" id="slide-9">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">09</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 9 // PRIORITY-MATRIX</span>
  </div>
 
  <div className="slide-title">Must-Have vs. Nice-to-Have Matrix</div>
  <div className="slide-subtitle">Critical Path Features · Post-MVP Enhancements · Quarterly Prioritization</div>
 
  <div className="section-label">Full Feature Prioritization Matrix</div>
  <table className="matrix" style={{marginBottom: 24}}>
    <tr>
      <th>Feature / Capability</th>
      <th>Category</th>
      <th>Priority</th>
      <th>Q1</th>
      <th>Q2</th>
      <th>Q3</th>
      <th>Q4</th>
      <th>Notes</th>
    </tr>
    {/* Critical must-haves */}
    <tr className="q1-cell">
      <td>Nucleus agent + memory layer</td><td>Foundation</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">P1-P4 blocker</td>
    </tr>
    <tr className="q1-cell">
      <td>Secret management vault</td><td>Security</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">Pre-deploy gate</td>
    </tr>
    <tr className="q1-cell">
      <td>IDENTITY.md + SOUL.md configs</td><td>Identity</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">Nucleus boot dep</td>
    </tr>
    <tr className="q1-cell">
      <td>Webhook handler + conv. locking</td><td>Comms</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">P5 required</td>
    </tr>
    <tr className="q1-cell">
      <td>Circuit breakers on all API calls</td><td>Reliability</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">No bypass allowed</td>
    </tr>
    <tr className="q1-cell">
      <td>Human-in-loop escalation path</td><td>Governance</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">Regulatory req.</td>
    </tr>
    <tr className="q1-cell">
      <td>Lane queue + basic logging</td><td>Execution</td>
      <td><span className="tag must">MUST</span></td>
      <td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td><td>—</td>
      <td className="mono">Determinism req.</td>
    </tr>
    {/* Q2 critical */}
    <tr className="q2-cell">
      <td>A2A protocol + Agent Card registry</td><td>Multi-Agent</td>
      <td><span className="tag critical">CRITICAL</span></td>
      <td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td>
      <td className="mono">P10 gate</td>
    </tr>
    <tr className="q2-cell">
      <td>Governance council voting system</td><td>Governance</td>
      <td><span className="tag critical">CRITICAL</span></td>
      <td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td>
      <td className="mono">P11 gate</td>
    </tr>
    <tr className="q2-cell">
      <td>Ops + Dev + Security divisions</td><td>Scaling</td>
      <td><span className="tag critical">CRITICAL</span></td>
      <td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td>
      <td className="mono">P7-P9</td>
    </tr>
    <tr className="q2-cell">
      <td>MCP tool integration layer</td><td>Integration</td>
      <td><span className="tag critical">CRITICAL</span></td>
      <td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td>
      <td className="mono">Tier 3 comms</td>
    </tr>
    <tr className="q2-cell">
      <td>One-click deployment pipeline</td><td>DevOps</td>
      <td><span className="tag critical">CRITICAL</span></td>
      <td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td><td>—</td>
      <td className="mono">Terraform/Helm</td>
    </tr>
    {/* Q3 nice-to-have */}
    <tr className="q3-cell">
      <td>Semantic snapshot system</td><td>Optimization</td>
      <td><span className="tag nice">NICE+</span></td>
      <td>—</td><td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td>
      <td className="mono">Cost reduction</td>
    </tr>
    <tr className="q3-cell">
      <td>Self-healing incident response</td><td>Reliability</td>
      <td><span className="tag nice">NICE+</span></td>
      <td>—</td><td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td>
      <td className="mono">P13</td>
    </tr>
    <tr className="q3-cell">
      <td>Full observability dashboard</td><td>Observability</td>
      <td><span className="tag nice">NICE+</span></td>
      <td>—</td><td>—</td><td style={{color: "var(--text-secondary)"}}>✓</td><td>—</td>
      <td className="mono">Grafana/DD</td>
    </tr>
    <tr>
      <td>Multi-region failover</td><td>Resilience</td>
      <td><span className="tag defer">DEFER</span></td>
      <td>—</td><td>—</td><td>—</td><td style={{color: "var(--white-dim)"}}>✓</td>
      <td className="mono">Post-commercial</td>
    </tr>
    <tr>
      <td>Multi-tenant isolation</td><td>Commercial</td>
      <td><span className="tag defer">DEFER</span></td>
      <td>—</td><td>—</td><td>—</td><td style={{color: "var(--white-dim)"}}>✓</td>
      <td className="mono">Scale req.</td>
    </tr>
  </table>
 
  {/* Final validation checklist */}
  <div className="section-label">Production Gate Checklist — Final Confirmation</div>
  <div className="grid-2">
    <div className="panel green">
      <div className="panel-title">Architecture Readiness ✓</div>
      <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>All MUST-HAVE items delivered and tested</p></div>
      <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>Security division audit passed (P9 gate)</p></div>
      <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>Rollback tested and verified &lt; 5min</p></div>
      <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>HITL paths verified end-to-end</p></div>
      <div className="status-row"><div className="dot green"></div><p style={{fontSize: 12}}>Deployment pipeline idempotent</p></div>
    </div>
    <div className="panel amber">
      <div className="panel-title">Architect Sign-Off Block</div>
      <p style={{fontSize: 12, marginBottom: 12}}>The following fields are completed at review time:</p>
      <div className="code-block" style={{fontSize: 10}}>
<span className="kw">Project:</span>    <span className="str">[PROJECT_NAME]</span>
<span className="kw">Reviewed:</span>   <span className="str">[DATE]</span>
<span className="kw">Architect:</span>  <span className="str">[AI_ARCHITECT_ID]</span>
<span className="kw">Gate:</span>       <span className="val">[ ] PASS  [ ] CONDITIONAL  [ ] FAIL</span>
<span className="kw">Notes:</span>      <span className="str">"[REVIEW_NOTES]"</span>
<span className="kw">Next Review:</span><span className="str">[DATE + 30 DAYS]</span>
      </div>
    </div>
  </div>
 
  <div className="page-stamp">PAGE <span className="pg">09</span> / 09</div>
 
  {/* Footer stamp */}
  <div style={{textAlign: "center", marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--line)"}}>
    <p className="mono" style={{color: "rgba(0,229,255,0.25)", fontSize: 9, letterSpacing: 4}}>
      UNIVERSAL AUTONOMOUS AGENT SYSTEM ARCHITECTURE BLUEPRINT — FRAMEWORK v1.0.0<br/>
      CONFIDENTIAL: ARCHITECTURAL REVIEW BOARD &amp; AUTHORIZED DEVOPS PERSONNEL
    </p>
  </div>

    </section>
  );
}
