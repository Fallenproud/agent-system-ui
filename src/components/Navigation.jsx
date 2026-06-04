export default function Navigation() {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const items = [
    { label: 'Cover', href: '#slide-cover' },
    { label: 'Overview', href: '#slide-2' },
    { label: 'Foundation', href: '#slide-3' },
    { label: 'Scaling', href: '#slide-4' },
    { label: 'Comms', href: '#slide-5' },
    { label: 'Roadmap', href: '#slide-6' },
    { label: 'DO/DON'T', href: '#slide-7' },
    { label: 'Deployment', href: '#slide-8' },
    { label: 'Matrix', href: '#slide-9' },
  ];

  return (
    <nav id="nav">
      <span className="nav-label">AASAB</span>
      {items.map(it => (
        <a key={it.href} className="nav-item" href={it.href} onClick={handleClick}>{it.label}</a>
      ))}
      <span className="nav-spacer"></span>
      <span className="nav-status">● BLUEPRINT ACTIVE</span>
    </nav>
  );
}
