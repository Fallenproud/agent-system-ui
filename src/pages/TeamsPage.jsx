const members = [
  { name: 'Nucleus', role: 'System Root', division: 'Core', status: 'active' },
  { name: 'Ops Lead', role: 'SRE Agent', division: 'Ops', status: 'active' },
  { name: 'Dev Lead', role: 'Code Agent', division: 'Dev', status: 'active' },
  { name: 'Sec Lead', role: 'Guard Agent', division: 'Security', status: 'idle' },
  { name: 'Comms Lead', role: 'Bridge Agent', division: 'Comms', status: 'active' },
];

const dot = (s) => s === 'active' ? 'dot green' : s === 'idle' ? 'dot amber' : 'dot red';

export default function TeamsPage() {
  return (
    <div style={{padding: '40px 60px', width: '100%', overflowY: 'auto'}}>
      <div className="header-bar">
        <span className="bar-num">TEAMS</span><div className="bar-line"></div>
        <span className="bar-stamp">DIVISION MEMBERSHIP &amp; PERMISSIONS</span>
      </div>
      <div className="slide-title">Teams</div>
      <div className="slide-subtitle">Division heads, members, and access control</div>

      <table className="bp-table">
        <thead>
          <tr><th>Member</th><th>Role</th><th>Division</th><th>Status</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.name}>
              <td style={{color: 'var(--text-primary)', fontWeight: 500}}>{m.name}</td>
              <td>{m.role}</td>
              <td><span className="tier-item">{m.division}</span></td>
              <td><div className={dot(m.status)} style={{display: 'inline-block', marginRight: 6, verticalAlign: 'middle'}}/><span style={{fontSize: 12}}>{m.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
