export default function Slide05() {
  return (
    <section className="slide" id="slide-5">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">05</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 5 // COMM-ARCHITECTURE</span>
  </div>
 
  <div className="slide-title">Communication Architecture</div>
  <div className="slide-subtitle">Multi-Tier Topology · A2A Protocol · MCP Integration · Webhook Security</div>
 
  {/* Communication tiers diagram */}
  <div className="section-label">Multi-Tier Communication Topology</div>
  <div style={{marginBottom: 20}}>
    <div className="tier">
      <div className="tier-label">TIER 1 — HUMAN ↔ AGENT (H2A)</div>
      <div className="tier-items">
        <div className="tier-item">Telegram Bot API</div>
        <div className="tier-item">Slack Events API</div>
        <div className="tier-item">REST HTTP Webhook</div>
        <div className="tier-item">WebSocket Streams</div>
        <div className="tier-item">Email Trigger (SMTP/IMAP)</div>
        <div className="tier-item">[Custom Channel]</div>
      </div>
    </div>
    <div className="tier">
      <div className="tier-label">TIER 2 — AGENT ↔ AGENT (A2A)</div>
      <div className="tier-items">
        <div className="tier-item">Internal gRPC bus</div>
        <div className="tier-item">Message queue (Redis Streams / RabbitMQ)</div>
        <div className="tier-item">Agent Card registry lookup</div>
        <div className="tier-item">Signed JWT capability tokens</div>
        <div className="tier-item">MCP protocol messages</div>
      </div>
    </div>
    <div className="tier">
      <div className="tier-label">TIER 3 — AGENT ↔ TOOL (A2T via MCP)</div>
      <div className="tier-items">
        <div className="tier-item">MCP Tool Calls</div>
        <div className="tier-item">Standardized context passing</div>
        <div className="tier-item">Tool result caching</div>
        <div className="tier-item">Permission-scoped access</div>
        <div className="tier-item">Retry / circuit-break wrapper</div>
      </div>
    </div>
  </div>
 
  <div className="grid-2" style={{marginBottom: 20}}>
    <div>
      <div className="section-label">Webhook Handler Architecture</div>
      <div className="flow-row" style={{flexDirection: "column", alignItems: "flex-start", gap: 6}}>
        <div style={{display: "flex", alignItems: "center", gap: 0}}>
          <div className="flow-node amber" style={{minWidth: 120}}>INBOUND MSG</div>
          <div className="flow-arrow amber"></div>
          <div className="flow-node" style={{minWidth: 140}}>HMAC VERIFY</div>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 0, paddingLeft: 120}}>
          <div className="flow-arrow" style={{transform: "rotate(90deg)", margin: "-12px 0"}}></div>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 0}}>
          <div className="flow-node green" style={{minWidth: 120}}>CONV LOCK</div>
          <div className="flow-arrow"></div>
          <div className="flow-node" style={{minWidth: 140}}>LANE ROUTE</div>
          <div className="flow-arrow"></div>
          <div className="flow-node green" style={{minWidth: 80}}>PROCESS</div>
        </div>
      </div>
      <div className="panel" style={{marginTop: 14}}>
        <div className="panel-title">Conversation Locking Strategy</div>
        <div className="annotation"><span>Redis distributed lock per conversation_id</span></div>
        <div className="annotation"><span>Lock TTL: 30s with heartbeat renewal</span></div>
        <div className="annotation warn"><span>Deadlock protection: force-release on agent crash</span></div>
        <div className="annotation ok"><span>Non-blocking: queued messages processed in order</span></div>
      </div>
    </div>
 
    <div>
      <div className="section-label">A2A Protocol Specification</div>
      <div className="panel" style={{marginBottom: 12}}>
        <div className="panel-title">Message Envelope Schema</div>
        <div className="code-block" dangerouslySetInnerHTML={{__html: `
<span className="cmt"># A2A Message Schema</span>
<span className="kw">msg_id:</span>     <span className="val">uuid-v4</span>
<span className="kw">from_agent:</span> <span className="str">"[AGENT_ID]"</span>
<span className="kw">to_agent:</span>   <span className="str">"[TARGET_ID]"</span>
<span className="kw">intent:</span>     <span className="str">"[DELEGATE|INFORM|QUERY|ACK]"</span>
<span className="kw">payload:</span>    <span className="val">{ ... }</span>
<span className="kw">sig:</span>        <span className="str">"HMAC-SHA256:[hash]"</span>
<span className="kw">ttl:</span>        <span className="val">30s</span>
<span className="kw">trace_id:</span>   <span className="str">"[SPAN_ID]"</span>
        `}} />
      </div>
      <div className="section-label" style={{marginTop: 12}}>MCP Tool Integration</div>
      <div className="panel green">
        <div className="panel-title">MCP Benefits</div>
        <div className="annotation ok"><span>Standardized context envelope across all tools</span></div>
        <div className="annotation ok"><span>Capability negotiation on connection init</span></div>
        <div className="annotation ok"><span>Unified permission scoping model</span></div>
        <div className="annotation ok"><span>Tool results typed &amp; validated on receipt</span></div>
      </div>
    </div>
  </div>
 
  {/* Security controls table */}
  <div className="section-label">Communication Security Controls</div>
  <table className="bp-table">
    <tr><th>Layer</th><th>Control</th><th>Mechanism</th><th>Priority</th></tr>
    <tr><td>Transport</td><td>Encryption in transit</td><td>TLS 1.3 mandatory</td><td><span className="tag must">MUST</span></td></tr>
    <tr><td>Webhook</td><td>Payload verification</td><td>HMAC-SHA256 signature check</td><td><span className="tag must">MUST</span></td></tr>
    <tr><td>A2A</td><td>Message authentication</td><td>Signed JWT tokens, 15min TTL</td><td><span className="tag must">MUST</span></td></tr>
    <tr><td>API Keys</td><td>Credential isolation</td><td>Vault-injected, never in env vars</td><td><span className="tag must">MUST</span></td></tr>
    <tr><td>Rate Limiting</td><td>Abuse prevention</td><td>Per-agent, per-endpoint limits</td><td><span className="tag critical">CRITICAL</span></td></tr>
    <tr><td>Audit Log</td><td>Non-repudiation</td><td>Immutable append-only trail</td><td><span className="tag nice">NICE+</span></td></tr>
  </table>
 
  <div className="page-stamp">PAGE <span className="pg">05</span> / 09</div>

    </section>
  );
}
