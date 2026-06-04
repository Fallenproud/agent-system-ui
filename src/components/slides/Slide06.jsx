export default function Slide06() {
  return (
    <section className="slide" id="slide-6">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">06</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 6 // QUARTERLY-ROADMAP</span>
  </div>
 
  <div className="slide-title">Quarterly Roadmap Template</div>
  <div className="slide-subtitle">Monthly Milestones · Autonomous Transaction Goals · Self-Optimization Targets</div>
 
  {/* KPI metrics row */}
  <div className="section-label">Key Performance Indicators — Target Template</div>
  <div className="grid-4" style={{marginBottom: 24}}>
    <div className="metric">
      <div className="metric-value">[X]%</div>
      <div className="metric-label">Task Auto-<br/>Resolution Rate</div>
    </div>
    <div className="metric">
      <div className="metric-value">[N]ms</div>
      <div className="metric-label">Avg. Agent<br/>Response Latency</div>
    </div>
    <div className="metric">
      <div className="metric-value">[N]</div>
      <div className="metric-label">Autonomous Tx<br/>/ Day Target</div>
    </div>
    <div className="metric">
      <div className="metric-value">[X]%</div>
      <div className="metric-label">Human<br/>Escalation Rate</div>
    </div>
  </div>
 
  {/* Monthly milestones */}
  <div className="section-label">Q1 Milestones</div>
  <div className="milestone-row" style={{marginBottom: 16}}>
    <div className="milestone">
      <div className="milestone-month">MONTH 1</div>
      <div className="annotation ok"><span>Nucleus + 3 divisions live</span></div>
      <div className="annotation ok"><span>H2A communication stable</span></div>
      <div className="annotation ok"><span>Baseline metrics captured</span></div>
    </div>
    <div className="milestone">
      <div className="milestone-month">MONTH 2</div>
      <div className="annotation"><span>A2A protocol stabilized</span></div>
      <div className="annotation"><span>Governance council operational</span></div>
      <div className="annotation"><span>First self-optimization cycle</span></div>
    </div>
    <div className="milestone">
      <div className="milestone-month">MONTH 3</div>
      <div className="annotation warn"><span>Semantic snapshot efficiency validated</span></div>
      <div className="annotation warn"><span>Lane queue saturation test passed</span></div>
      <div className="annotation warn"><span>Security division audit complete</span></div>
    </div>
  </div>
 
  <div className="section-label">Q2–Q4 Milestones</div>
  <div className="milestone-row" style={{marginBottom: 16}}>
    <div className="milestone q2">
      <div className="milestone-month">Q2 TARGET</div>
      <p style={{fontSize: 12, marginBottom: 8}}><strong>Expansion &amp; Optimization</strong></p>
      <div className="annotation"><span>Full autonomous transaction capability</span></div>
      <div className="annotation"><span>All 16 phases operational</span></div>
      <div className="annotation"><span>Cross-division orchestration proven</span></div>
      <div className="annotation"><span>Revenue / output metrics baseline set</span></div>
    </div>
    <div className="milestone q3">
      <div className="milestone-month">Q3 TARGET</div>
      <p style={{fontSize: 12, marginBottom: 8}}><strong>Autonomy Deepening</strong></p>
      <div className="annotation ok"><span>Self-healing incident response live</span></div>
      <div className="annotation ok"><span>Predictive scaling active</span></div>
      <div className="annotation ok"><span>Model performance self-benchmarking</span></div>
      <div className="annotation ok"><span>Audit trail fully immutable</span></div>
    </div>
    <div className="milestone q4">
      <div className="milestone-month">Q4 TARGET</div>
      <p style={{fontSize: 12, marginBottom: 8}}><strong>Commercial Readiness</strong></p>
      <div className="annotation"><span>SLA commitments met or exceeded</span></div>
      <div className="annotation"><span>Multi-tenant isolation validated</span></div>
      <div className="annotation"><span>Compliance &amp; audit reports automated</span></div>
      <div className="annotation"><span>[PROJECT]-specific KPIs met</span></div>
    </div>
  </div>
 
  {/* Self-optimization targets */}
  <div className="section-label">Self-Optimization Target Framework</div>
  <div className="grid-3">
    <div className="panel">
      <div className="panel-title">Execution Efficiency</div>
      <p style={{fontSize: 12, marginBottom: 8}}>Define measurable targets for:</p>
      <div className="annotation"><span>Token cost per task (vs. baseline)</span></div>
      <div className="annotation"><span>Context window utilization rate</span></div>
      <div className="annotation"><span>Semantic snapshot hit ratio</span></div>
    </div>
    <div className="panel amber">
      <div className="panel-title">Reliability Targets</div>
      <div className="annotation warn"><span>Error rate threshold: [X]% max</span></div>
      <div className="annotation warn"><span>Mean time to recovery: &lt; [N] min</span></div>
      <div className="annotation warn"><span>Cascade failure prevention rate: 100%</span></div>
    </div>
    <div className="panel green">
      <div className="panel-title">Growth Targets</div>
      <div className="annotation ok"><span>New tool integration velocity: [N]/sprint</span></div>
      <div className="annotation ok"><span>Division spawn time: &lt; [N] min</span></div>
      <div className="annotation ok"><span>Human escalation trend: ↓ quarter-on-quarter</span></div>
    </div>
  </div>
 
  <div className="page-stamp">PAGE <span className="pg">06</span> / 09</div>

    </section>
  );
}
