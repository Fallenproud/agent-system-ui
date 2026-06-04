export default function Slide03() {
  return (
    <section className="slide" id="slide-3">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">03</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 3 // FOUNDATION-BOOTSTRAP</span>
  </div>
 
  <div className="slide-title">Foundation & Nucleus Bootstrap</div>
  <div className="slide-subtitle">Infrastructure Phases 1–6 · Cognition Deployment · First Division Spawn</div>
 
  {/* Phase tracker */}
  <div className="section-label">Bootstrap Phase Sequence</div>
  <div className="phase-track" style={{marginBottom: 20}}>
    <div className="phase-block active">
      <span className="ph-num">01</span>
      <span className="ph-label">INFRA<br/>PROVISION</span>
    </div>
    <div className="phase-block active">
      <span className="ph-num">02</span>
      <span className="ph-label">SECRET<br/>MGMT</span>
    </div>
    <div className="phase-block active">
      <span className="ph-num">03</span>
      <span className="ph-label">MEMORY<br/>LAYER</span>
    </div>
    <div className="phase-block">
      <span className="ph-num">04</span>
      <span className="ph-label">NUCLEUS<br/>DEPLOY</span>
    </div>
    <div className="phase-block">
      <span className="ph-num">05</span>
      <span className="ph-label">COMMS<br/>INIT</span>
    </div>
    <div className="phase-block">
      <span className="ph-num">06</span>
      <span className="ph-label">FIRST<br/>DIV SPAWN</span>
    </div>
  </div>
 
  <div className="grid-2" style={{marginBottom: 24}}>
    <div>
      <div className="section-label">Phase 1–3: Infrastructure</div>
      <table className="bp-table">
        <tr><th>Phase</th><th>Component</th><th>Pattern</th></tr>
        <tr><td className="mono">P1</td><td>Compute & Networking</td><td><span className="tag critical">CRITICAL</span></td></tr>
        <tr><td className="mono">P2</td><td>Secrets & Vault</td><td><span className="tag must">MUST-HAVE</span></td></tr>
        <tr><td className="mono">P3</td><td>Multi-tier Memory Init</td><td><span className="tag must">MUST-HAVE</span></td></tr>
      </table>
      <div className="panel" style={{marginTop: 14}}>
        <div className="panel-title">P3 — Memory Layer Detail</div>
        <div className="tier">
          <div className="tier-label">L1 — HOT CACHE</div>
          <div className="tier-items">
            <div className="tier-item">Redis / Memcached</div>
            <div className="tier-item">TTL: Minutes</div>
            <div className="tier-item">Active context</div>
          </div>
        </div>
        <div className="tier">
          <div className="tier-label">L2 — WARM STORE</div>
          <div className="tier-items">
            <div className="tier-item">PostgreSQL</div>
            <div className="tier-item">Persistent state</div>
            <div className="tier-item">Structured logs</div>
          </div>
        </div>
        <div className="tier">
          <div className="tier-label">L3 — SEMANTIC INDEX</div>
          <div className="tier-items">
            <div className="tier-item">Qdrant / Weaviate</div>
            <div className="tier-item">Vector embeddings</div>
            <div className="tier-item">Long-term recall</div>
          </div>
        </div>
      </div>
    </div>
 
    <div>
      <div className="section-label">Phase 4–6: Cognition & First Division</div>
      <div className="panel" style={{marginBottom: 14}}>
        <div className="panel-title">P4 — Nucleus Cognition Deployment</div>
        <div className="annotation"><span>Load IDENTITY.md → Validate role manifest</span></div>
        <div className="annotation"><span>Load SOUL.md → Inject behavioral constraints</span></div>
        <div className="annotation"><span>Register MCP tool bindings → health check all APIs</span></div>
        <div className="annotation"><span>Self-test cognition loop before opening traffic</span></div>
      </div>
      <div className="panel amber" style={{marginBottom: 14}}>
        <div className="panel-title">P5 — Communications Init</div>
        <div className="annotation warn"><span>Register webhook endpoints for all comms APIs</span></div>
        <div className="annotation warn"><span>Validate bot token / API credentials</span></div>
        <div className="annotation warn"><span>Initialize conversation locking mechanism</span></div>
      </div>
      <div className="panel green">
        <div className="panel-title">P6 — First Functional Division Spawn</div>
        <div className="annotation ok"><span>Clone nucleus config → assign division role</span></div>
        <div className="annotation ok"><span>Establish A2A channel nucleus ↔ division</span></div>
        <div className="annotation ok"><span>Gate: nucleus must confirm division liveness</span></div>
      </div>
    </div>
  </div>
 
  {/* Must Have vs Nice to Have */}
  <div className="section-label">Must-Have vs. Nice-to-Have — Bootstrap Template</div>
  <div className="grid-2">
    <div className="panel red">
      <div className="panel-title">MUST-HAVE (Pre-Launch Blockers)</div>
      <div className="annotation err"><span>Secret management / credential vault active</span></div>
      <div className="annotation err"><span>Memory layer (all 3 tiers) initialized &amp; healthy</span></div>
      <div className="annotation err"><span>IDENTITY + SOUL configs loaded &amp; validated</span></div>
      <div className="annotation err"><span>Nucleus cognition self-test passing</span></div>
      <div className="annotation err"><span>Webhook endpoints accepting &amp; responding</span></div>
      <div className="annotation err"><span>Circuit breakers configured on all external APIs</span></div>
    </div>
    <div className="panel green">
      <div className="panel-title">NICE-TO-HAVE (Post-Bootstrap Enhancements)</div>
      <div className="annotation ok"><span>Full observability dashboard (Grafana/Datadog)</span></div>
      <div className="annotation ok"><span>Automated cognition regression test suite</span></div>
      <div className="annotation ok"><span>Multi-region failover configured</span></div>
      <div className="annotation ok"><span>Semantic snapshot warm cache prefilled</span></div>
      <div className="annotation ok"><span>A2A agent discovery registry live</span></div>
    </div>
  </div>
 
  <div className="page-stamp">PAGE <span className="pg">03</span> / 09</div>

    </section>
  );
}
