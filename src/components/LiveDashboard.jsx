import { useEffect, useState } from 'react';

function getWsUrl() {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (base) {
    return base.replace(/^https/, 'wss').replace(/^http/, 'ws');
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}`;
}

export default function LiveDashboard() {
  const [health, setHealth] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      try {
        ws = new WebSocket(getWsUrl());

        ws.onopen = () => {
          setConnected(true);
          setLoading(false);
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'health') {
              setHealth(msg.data);
            }
          } catch (e) {
            console.error('WS parse error', e);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
          console.error('WS error', err);
          setConnected(false);
        };
      } catch (err) {
        console.error('WS connection failed', err);
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  if (loading) return <div className="empty-state">Connecting to live metrics…</div>;

  return (
    <div style={{padding: '16px 20px', width: '100%'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
        <div className="section-label" style={{marginBottom: 0}}>Live Metrics</div>
        <div className={connected ? 'dot green' : 'dot red'} />
        <span style={{fontSize: 10, color: 'var(--text-muted)'}}>{connected ? 'WS Connected' : 'WS Reconnecting…'}</span>
      </div>
      {health.map(agent => (
        <div key={agent.id} className="panel" style={{marginBottom: 10, borderRadius: 'var(--radius-md)', padding: '10px 14px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
            <span style={{fontSize: 12, fontWeight: 600, color: 'var(--text-primary)'}}>{agent.name}</span>
            <div className={agent.status === 'active' ? 'dot green' : agent.status === 'idle' ? 'dot amber' : 'dot red'} />
          </div>

          <div style={{marginBottom: 6}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2}}>
              <span>CPU</span><span>{Math.round(agent.cpu)}%</span>
            </div>
            <div style={{height: 4, background: 'var(--bg-main)', borderRadius: 2}}>
              <div style={{width: `${agent.cpu}%`, height: '100%', background: agent.cpu > 80 ? 'var(--error)' : 'var(--text-secondary)', borderRadius: 2, transition: 'width 0.5s ease'}} />
            </div>
          </div>

          <div style={{marginBottom: 6}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2}}>
              <span>MEM</span><span>{Math.round(agent.mem)}%</span>
            </div>
            <div style={{height: 4, background: 'var(--bg-main)', borderRadius: 2}}>
              <div style={{width: `${agent.mem}%`, height: '100%', background: agent.mem > 80 ? 'var(--error)' : 'var(--text-secondary)', borderRadius: 2, transition: 'width 0.5s ease'}} />
            </div>
          </div>

          {agent.latency > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)'}}>
              <span>Latency</span>
              <span style={{color: agent.latency > 100 ? 'var(--warn)' : 'var(--success)'}}>{Math.round(agent.latency)}ms</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
