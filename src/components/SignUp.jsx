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
  const [adminForm, setAdminForm] = useState({ name: 'Md Nawed Alam', email: 'nawedmr477@gmail.com', password: '', setupSecret: '' });
  const [status, setStatus] = useState('idle');
  const [adminStatus, setAdminStatus] = useState('idle');
  const [error, setError] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  const handleChange = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const handleAdminChange = event => setAdminForm(current => ({ ...current, [event.target.name]: event.target.value }));

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

  const handleAdminSubmit = async event => {
    event.preventDefault();
    setAdminStatus('loading');
    setError('');
    setAdminMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Admin setup failed.');

      saveSession(data.token, data.user);
      setAdminMessage('Admin account is ready. Opening admin panel...');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create admin account.');
      setAdminStatus('error');
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

      <form onSubmit={handleAdminSubmit} style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--gray-200)',
      }}>
        <div className="section-eyebrow">Admin Setup</div>
        <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Create Admin Account</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Use this only for your owner/admin email. It needs the private admin setup code.
        </p>

        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)' }}>
          Admin Email
          <input name="email" type="email" required value={adminForm.email} onChange={handleAdminChange} style={inputStyle} />
        </label>

        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)', marginTop: '1rem' }}>
          Admin Password
          <input name="password" type="password" required minLength={8} value={adminForm.password} onChange={handleAdminChange} placeholder="Create admin password" style={inputStyle} />
        </label>

        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-600)', marginTop: '1rem' }}>
          Setup Code
          <input name="setupSecret" type="password" required value={adminForm.setupSecret} onChange={handleAdminChange} placeholder="Private setup code" style={inputStyle} />
        </label>

        {adminMessage && <p style={{ color: '#047857', fontSize: '0.85rem', marginTop: '1rem' }}>{adminMessage}</p>}

        <button type="submit" disabled={adminStatus === 'loading'} style={{
          width: '100%',
          marginTop: '1.25rem',
          padding: '0.85rem 1rem',
          border: '1.5px solid var(--accent)',
          borderRadius: 100,
          background: adminStatus === 'loading' ? 'var(--gray-200)' : 'var(--accent-light)',
          color: 'var(--accent)',
          fontWeight: 700,
        }}>
          {adminStatus === 'loading' ? 'Preparing admin...' : 'Create / Reset Admin'}
        </button>
      </form>
      </div>
    </AuthLayout>
  );
}
