export default function Slide07() {
  return (
    <section className="slide" id="slide-7">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">07</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 7 // TECHNICAL-DO-DONTS</span>
  </div>
 
  <div className="slide-title">Technical DO's and DON'Ts</div>
  <div className="slide-subtitle">Circuit Breakers · Permission Boundaries · Human-in-Loop Requirements</div>
 
  <div className="do-dont" style={{marginBottom: 24}}>
    <div className="do-block">
      <h3>✓ DO — Recommended Practices</h3>
      <div className="panel green" style={{marginBottom: 12}}>
        <div className="panel-title">Circuit Breakers — DO</div>
        <div className="annotation ok"><span>Wrap ALL external API calls with circuit breaker (Hystrix pattern or equivalent)</span></div>
        <div className="annotation ok"><span>Set tiered retry backoff: 1s → 5s → 30s → human alert</span></div>
        <div className="annotation ok"><span>Log every open/half-open/closed state transition</span></div>
        <div className="annotation ok"><span>Define fallback behavior for each protected call</span></div>
      </div>
      <div className="panel green" style={{marginBottom: 12}}>
        <div className="panel-title">Semantic Snapshots — DO</div>
        <div className="annotation ok"><span>Snapshot at every major context boundary (task completion, handoff)</span></div>
        <div className="annotation ok"><span>Include token budget estimate in each snapshot header</span></div>
        <div className="annotation ok"><span>Expire snapshots: working memory 30min, project memory 30 days</span></div>
        <div className="annotation ok"><span>Encrypt snapshots at rest using vault-managed keys</span></div>
      </div>
      <div className="panel green">
        <div className="panel-title">Permission Boundaries — DO</div>
        <div className="annotation ok"><span>Implement least-privilege by default for every agent</span></div>
        <div className="annotation ok"><span>Separate read vs. write vs. execute permission tiers</span></div>
        <div className="annotation ok"><span>Review and prune permissions on each governance cycle</span></div>
        <div className="annotation ok"><span>Enforce permission checks at the tool call layer (not just config)</span></div>
      </div>
    </div>
 
    <div className="dont-block">
      <h3>✕ DON'T — Anti-Patterns to Avoid</h3>
      <div className="panel red" style={{marginBottom: 12}}>
        <div className="panel-title">Circuit Breakers — DON'T</div>
        <div className="annotation err"><span>Never allow unbounded retries without a max attempt ceiling</span></div>
        <div className="annotation err"><span>Never suppress circuit-open alerts — always surface to monitoring</span></div>
        <div className="annotation err"><span>Never share a single circuit breaker across unrelated services</span></div>
        <div className="annotation err"><span>Never bypass circuit state for "urgent" requests</span></div>
      </div>
      <div className="panel red" style={{marginBottom: 12}}>
        <div className="panel-title">Semantic Snapshots — DON'T</div>
        <div className="annotation err"><span>Never store raw PII or credentials inside snapshot payloads</span></div>
        <div className="annotation err"><span>Never rely on snapshots as the sole source of truth for state</span></div>
        <div className="annotation err"><span>Never allow stale snapshots (&gt; TTL) to re-enter active context</span></div>
        <div className="annotation err"><span>Never skip snapshot creation on long-running task handoffs</span></div>
      </div>
      <div className="panel red">
        <div className="panel-title">Permission Boundaries — DON'T</div>
        <div className="annotation err"><span>Never hardcode API keys or secrets in agent config files</span></div>
        <div className="annotation err"><span>Never grant parent-scope permissions to child divisions by default</span></div>
        <div className="annotation err"><span>Never allow agents to self-modify their own permission tier</span></div>
        <div className="annotation err"><span>Never skip human confirmation on any privilege escalation</span></div>
      </div>
    </div>
  </div>
 
  {/* Human in loop requirements */}
  <div className="section-label">Human-in-Loop (HITL) Requirements Guide</div>
  <table className="bp-table">
    <tr><th>Trigger Condition</th><th>HITL Required</th><th>Response SLA</th><th>Auto-Fallback</th></tr>
    <tr>
      <td>Permission tier escalation request</td>
      <td><span className="tag must">MANDATORY</span></td>
      <td className="mono">&lt; 4 hours</td>
      <td style={{color: "var(--text-secondary)"}}>Block action until approved</td>
    </tr>
    <tr>
      <td>Governance council deadlock</td>
      <td><span className="tag must">MANDATORY</span></td>
      <td className="mono">&lt; 60 seconds</td>
      <td style={{color: "var(--text-secondary)"}}>Pause all affected operations</td>
    </tr>
    <tr>
      <td>Anomalous behavior pattern detected</td>
      <td><span className="tag must">MANDATORY</span></td>
      <td className="mono">&lt; 15 minutes</td>
      <td style={{color: "var(--text-secondary)"}}>Isolate flagged agent</td>
    </tr>
    <tr>
      <td>External financial / legal action</td>
      <td><span className="tag must">MANDATORY</span></td>
      <td className="mono">&lt; 2 hours</td>
      <td style={{color: "var(--text-secondary)"}}>Hard stop, no fallback</td>
    </tr>
    <tr>
      <td>Novel task type (no policy match)</td>
      <td><span className="tag critical">RECOMMENDED</span></td>
      <td className="mono">&lt; 24 hours</td>
      <td style={{color: "var(--text-secondary)"}}>Queue with notification</td>
    </tr>
    <tr>
      <td>Routine ops within policy bounds</td>
      <td><span className="tag nice">NOTIFY ONLY</span></td>
      <td className="mono">Async</td>
      <td style={{color: "var(--text-secondary)"}}>Auto-proceed, log result</td>
    </tr>
  </table>
 
  <div className="page-stamp">PAGE <span className="pg">07</span> / 09</div>

    </section>
  );
}
