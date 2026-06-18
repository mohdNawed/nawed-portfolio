import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '0.8rem 1rem',
  border: '1.5px solid var(--gray-200)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.92rem',
  outline: 'none',
  marginTop: '0.35rem',
};

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { saveSession } = useAuth();

  const handleChange = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async event => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Sign in failed.');

      saveSession(data.token, data.user);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign in.');
      setStatus('error');
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to manage your portfolio dashboard."
      subtitle="Access saved messages, hire inquiries, and private backend-managed data from one secure area."
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380 }}>
        <div className="section-eyebrow">Sign In</div>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2rem', marginBottom: '0.5rem' }}>Continue to Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Use your admin email and password.
        </p>

        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)' }}>
          Email
          <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
        </label>

        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)', marginTop: '1rem' }}>
          Password
          <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Your password" style={inputStyle} />
        </label>

        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>}

        <button type="submit" disabled={status === 'loading'} style={{
          width: '100%',
          marginTop: '1.5rem',
          padding: '0.85rem 1rem',
          border: 'none',
          borderRadius: 100,
          background: status === 'loading' ? 'var(--gray-400)' : 'var(--black)',
          color: 'white',
          fontWeight: 700,
        }}>
          {status === 'loading' ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', textAlign: 'center' }}>
          Need an account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
