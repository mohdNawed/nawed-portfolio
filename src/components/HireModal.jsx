import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

export default function HireModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', budget: '', details: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) { setStatus('idle'); setForm({ name: '', email: '', projectType: '', budget: '', details: '' }); }
  }, [open]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Please enter your name and email.'); return;
    }
    setErrorMsg('');
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/hire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); }
      else { setStatus('error'); setErrorMsg(data.message || 'Something went wrong.'); }
    } catch {
      // Fallback: open mailto if backend unreachable
      const subject = encodeURIComponent('Hire Inquiry: ' + (form.projectType || 'Project'));
      const body = encodeURIComponent(
        `Hi Nawed,\n\nName: ${form.name}\nEmail: ${form.email}\nProject: ${form.projectType}\nBudget: ${form.budget}\n\nDetails:\n${form.details}`
      );
      window.location.href = `mailto:mdalamnawed@gmail.com?subject=${subject}&body=${body}`;
      setStatus('success');
    }
  };

  if (!open) return null;

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
    fontFamily: 'Inter,sans-serif', fontSize: '0.9rem',
    color: 'var(--text)', marginBottom: '1rem', outline: 'none',
    background: 'white', transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.35rem' };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: 20, padding: '2.5rem',
        width: '100%', maxWidth: 480, position: 'relative',
        animation: 'slideUp 0.3s ease'
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', fontSize: '1.5rem',
          cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1
        }}>×</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>✅</div>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Thanks for reaching out! I'll reply to your email within 24 hours.
            </p>
            <button onClick={onClose} style={{
              background: 'var(--black)', color: 'white', border: 'none',
              padding: '0.65rem 1.5rem', borderRadius: 100, fontSize: '0.9rem',
              fontWeight: 500, cursor: 'pointer'
            }}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Let's Work Together 🚀
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Fill in the details and I'll get back to you within 24 hours.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />
              </div>
              <div>
                <label style={labelStyle}>Your Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />
              </div>
            </div>

            <label style={labelStyle}>Project Type</label>
            <select name="projectType" value={form.projectType} onChange={handleChange} style={inputStyle}>
              <option value="">Select a service...</option>
              <option>Full Stack Web App</option>
              <option>Frontend Development</option>
              <option>Backend / API Development</option>
              <option>UI/UX Design</option>
              <option>Other</option>
            </select>

            <label style={labelStyle}>Budget Range</label>
            <select name="budget" value={form.budget} onChange={handleChange} style={inputStyle}>
              <option value="">Select budget...</option>
              <option>Under ₹10,000</option>
              <option>₹10,000 – ₹30,000</option>
              <option>₹30,000 – ₹60,000</option>
              <option>₹60,000+</option>
            </select>

            <label style={labelStyle}>Project Details</label>
            <textarea name="details" value={form.details} onChange={handleChange}
              placeholder="Tell me about your project, timeline, and requirements..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />

            {errorMsg && <p style={{ color: '#e24b4a', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{errorMsg}</p>}

            <button onClick={handleSubmit} disabled={status === 'loading'} style={{
              width: '100%', padding: '0.8rem',
              background: status === 'loading' ? 'var(--gray-400)' : 'var(--black)',
              color: 'white', border: 'none', borderRadius: 100,
              fontSize: '0.95rem', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => { if (status !== 'loading') e.target.style.background = 'var(--accent)'; }}
              onMouseLeave={e => { if (status !== 'loading') e.target.style.background = 'var(--black)'; }}
            >
              {status === 'loading' ? '⏳ Sending...' : '✉ Send Inquiry'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
