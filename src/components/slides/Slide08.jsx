export default function Slide08() {
  return (
    <section className="slide" id="slide-8">

  <div className="corner corner-tl"></div><div className="corner corner-tr"></div>
  <div className="corner corner-bl"></div><div className="corner corner-br"></div>
 
  <div className="header-bar">
    <span className="bar-num">08</span><div className="bar-line"></div>
    <span className="bar-stamp">SECTION 8 // DEPLOYMENT-ARCHITECTURE</span>
  </div>
 
  <div className="slide-title">One-Click Deployment Architecture</div>
  <div className="slide-subtitle">Terraform · Helm · ArgoCD · Single-Command Strategy · Rollback Capability</div>
 
  {/* Stack overview */}
  <div className="section-label">Recommended Stack (Adaptable to Alternatives)</div>
  <div className="grid-3" style={{marginBottom: 20}}>
    <div className="panel">
      <div className="panel-title">Layer 1 — Infrastructure</div>
      <div className="code-block" dangerouslySetInnerHTML={{__html: `
<span className="cmt"># terraform/main.tf</span>
<span className="kw">module</span> <span className="str">"agent_cluster"</span> {
  source = <span className="str">"./modules/k8s"</span>
  <span className="kw">node_count</span> = <span className="val">var.node_count</span>
  <span className="kw">region</span>     = <span className="val">var.region</span>
  <span className="kw">secrets</span>    = <span className="val">var.vault_path</span>
}
      `}} />
      <div className="annotation" style={{marginTop: 8}}><span>Provision: compute, networking, storage, vault</span></div>
      <div className="annotation"><span>Alternatives: Pulumi, CDK, manual Ansible</span></div>
    </div>
    <div className="panel amber">
      <div className="panel-title">Layer 2 — Application</div>
      <div className="code-block" dangerouslySetInnerHTML={{__html: `
<span className="cmt"># helm install</span>
helm upgrade --install \\\\
  agent-system \\\\
  ./charts/agent-system \\\\
  -f values.<span className="val">prod</span>.yaml \\\\
  --set image.tag=<span className="str">"[VERSION]"</span>
      `}} />
      <div className="annotation warn" style={{marginTop: 8}}><span>Package: all agents, configs, secrets refs</span></div>
      <div className="annotation warn"><span>Alternatives: Kustomize, plain k8s manifests</span></div>
    </div>
    <div className="panel green">
      <div className="panel-title">Layer 3 — GitOps CD</div>
      <div className="code-block" dangerouslySetInnerHTML={{__html: `
<span className="cmt"># argocd-app.yaml</span>
<span className="kw">source:</span>
  <span className="kw">repoURL:</span> <span className="str">[GIT_REPO]</span>
  <span className="kw">path:</span> <span className="val">charts/agent-system</span>
  <span className="kw">targetRevision:</span> <span className="val">HEAD</span>
<span className="kw">syncPolicy:</span>
  <span className="kw">automated:</span>
    <span className="kw">prune:</span> <span className="val">true</span>
      `}} />
      <div className="annotation ok" style={{marginTop: 8}}><span>Continuous sync from git to cluster</span></div>
      <div className="annotation ok"><span>Alternatives: Flux, Jenkins X, Spinnaker</span></div>
    </div>
  </div>
 
  {/* Single command deployment */}
  <div className="section-label">Single-Command Deployment Strategy</div>
  <div className="grid-2" style={{marginBottom: 20}}>
    <div>
      <div className="code-block" style={{marginBottom: 12}}>
<span className="cmt">#!/bin/bash — deploy.sh</span>
<span className="kw">set</span> -euo pipefail
 
<span className="cmt"># 1. Provision infrastructure</span>
<span className="kw">terraform</span> apply -auto-approve -var-file=<span className="str">"env/${ENV}.tfvars"</span>
 
<span className="cmt"># 2. Deploy application</span>
<span className="kw">helm</span> upgrade --install agent-system ./charts \
  --wait --timeout 10m \
  -f values.<span className="val">${ENV}</span>.yaml
 
<span className="cmt"># 3. Sync GitOps state</span>
<span className="kw">argocd</span> app sync agent-system --force
 
<span className="cmt"># 4. Run post-init sequence</span>
<span className="kw">./scripts/post-init.sh</span> --env <span className="val">${ENV}</span>
 
<span className="kw">echo</span> <span className="str">"✓ Deployment complete. Version: ${VERSION}"</span>
      </div>
    </div>
    <div>
      <div className="panel" style={{marginBottom: 12}}>
        <div className="panel-title">Post-Init Sequence</div>
        <div className="flow-row" style={{flexDirection: "column", gap: 4}}>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot green"></div>
            <p className="mono" style={{fontSize: 10}}>1. Health check all agent pods (liveness probe)</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot cyan"></div>
            <p className="mono" style={{fontSize: 10}}>2. Load IDENTITY.md + SOUL.md → validate schemas</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot cyan"></div>
            <p className="mono" style={{fontSize: 10}}>3. Initialize memory tiers (Redis ping, PG connect, Qdrant ping)</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot amber"></div>
            <p className="mono" style={{fontSize: 10}}>4. Register webhooks → verify with API providers</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot amber"></div>
            <p className="mono" style={{fontSize: 10}}>5. A2A agent card registration → broadcast to registry</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot green"></div>
            <p className="mono" style={{fontSize: 10}}>6. Smoke test: send PING, expect PONG within 5s</p>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="dot green"></div>
            <p className="mono" style={{fontSize: 10}}>7. Emit deployment telemetry event → observability platform</p>
          </div>
        </div>
      </div>
      <div className="panel red">
        <div className="panel-title">Rollback Capability</div>
        <div className="code-block" style={{fontSize: 10}}>
<span className="cmt"># Instant rollback</span>
<span className="kw">argocd</span> app rollback agent-system --revision <span className="val">N</span>
<span className="cmt"># Helm rollback fallback</span>
<span className="kw">helm</span> rollback agent-system <span className="val">1</span>
<span className="cmt"># Terraform state rollback</span>
<span className="kw">terraform</span> apply -target=... -var <span className="str">"version=prev"</span>
        </div>
        <div className="annotation err" style={{marginTop: 6}}><span>Max rollback time target: &lt; 5 minutes to stable state</span></div>
      </div>
    </div>
  </div>
 
  {/* Environment matrix */}
  <div className="section-label">Environment Pipeline</div>
  <div className="flow-row" style={{justifyContent: "center", gap: 0}}>
    <div className="flow-node amber" style={{minWidth: 110, textAlign: "center"}}>LOCAL DEV</div>
    <div className="flow-arrow amber"></div>
    <div className="flow-node" style={{minWidth: 110, textAlign: "center"}}>CI / TEST</div>
    <div className="flow-arrow"></div>
    <div className="flow-node" style={{minWidth: 110, textAlign: "center"}}>STAGING</div>
    <div className="flow-arrow"></div>
    <div className="flow-node green" style={{minWidth: 110, textAlign: "center"}}>PRODUCTION</div>
    <div className="flow-arrow" style={{background: "rgba(255,209,102,0.5)"}}></div>
    <div className="flow-node gold" style={{minWidth: 110, textAlign: "center", borderColor: "var(--text-secondary)", color: "var(--text-secondary)", background: "rgba(255,255,255,0.04)"}}>CANARY<br/>RELEASE</div>
  </div>
 
  <div className="page-stamp">PAGE <span className="pg">08</span> / 09</div>

    </section>
  );
}
