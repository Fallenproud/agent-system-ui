import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-deep)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: 32,
        border: '1px solid var(--border-input)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid var(--border-input)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {isRegister ? 'Register to access the agent system' : 'Sign in to your agent workspace'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>Username</label>
            <input
              type="text"
              className="chat-input"
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: 0,
                width: '100%',
              }}
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              className="chat-input"
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-input)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: 0,
                width: '100%',
              }}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(138,74,74,0.15)',
              border: '1px solid var(--error)',
              color: 'var(--error)',
              fontSize: 12,
              marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-pill btn-pill-dark"
            style={{ width: '100%', justifyContent: 'center', height: 40 }}
            disabled={loading}
          >
            {loading ? '…' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            className="btn-text"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
