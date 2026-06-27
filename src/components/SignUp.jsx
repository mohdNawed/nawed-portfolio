import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const handleChange = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async event => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Signup failed.');

      saveSession(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account.');
      setStatus('error');
    }
  };

  return (
    <AuthLayout
      eyebrow="Create Access"
      title="Create your Nawed Dev account."
      subtitle="Create your Nawed Dev account and keep your login state in sync across the portfolio."
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <form onSubmit={handleSubmit}>
          <div className="section-eyebrow">Sign Up</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Use a strong password with at least 8 characters.
          </p>

          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)' }}>
            Name
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Md Nawed Alam" style={inputStyle} />
          </label>

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)', marginTop: '1rem' }}>
            Email
            <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
          </label>

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)', marginTop: '1rem' }}>
            Password
            <input name="password" type="password" required minLength={8} value={form.password} onChange={handleChange} placeholder="At least 8 characters" style={inputStyle} />
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
            {status === 'loading' ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', textAlign: 'center' }}>
            Already have an account? <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
