import React, { useState } from 'react';
import API_BASE_URL from '../config';

export default function Contact({ onHireClick }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch {
      const body = encodeURIComponent(`From: ${form.name}\n\n${form.message}`);
      window.location.href = `mailto:mdalamnawed@gmail.com?subject=Contact from ${form.name}&body=${body}`;
      setStatus('success');
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem',
    border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)',
    fontFamily: 'Inter,sans-serif', fontSize: '0.9rem', color: 'var(--text)',
    background: 'white', outline: 'none', marginBottom: '1rem', transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" style={{ padding: '5rem 2rem', background: 'var(--off-white)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Get In Touch</div>
          <div className="section-title">Let's Build Something</div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
            Have a project in mind or want to hire me? Drop a message or use the Hire Me form.
          </p>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700 }}>Message Sent!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>I'll get back to you within 24 hours.</p>
            <button onClick={() => setStatus('idle')} style={{
              marginTop: '1.25rem', background: 'var(--accent)', color: 'white',
              border: 'none', padding: '0.6rem 1.5rem', borderRadius: 100, cursor: 'pointer', fontWeight: 500
            }}>Send Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: 'white', borderRadius: 'var(--radius)',
            border: '1px solid var(--gray-200)', padding: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.35rem' }}>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.35rem' }}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />
              </div>
            </div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '0.35rem' }}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required
              placeholder="Tell me about your project or opportunity..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--gray-200)'} />
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="submit" disabled={status === 'loading'} style={{
                flex: 1, padding: '0.8rem', background: 'var(--black)', color: 'white',
                border: 'none', borderRadius: 100, fontSize: '0.9rem', fontWeight: 600,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
              }}
                onMouseEnter={e => { if (status !== 'loading') e.target.style.background = 'var(--accent)'; }}
                onMouseLeave={e => { if (status !== 'loading') e.target.style.background = 'var(--black)'; }}
              >{status === 'loading' ? '⏳ Sending...' : '✉ Send Message'}</button>
              <button type="button" onClick={onHireClick} style={{
                padding: '0.8rem 1.5rem', background: 'var(--accent-light)', color: 'var(--accent)',
                border: '1.5px solid var(--accent)', borderRadius: 100, fontSize: '0.9rem',
                fontWeight: 600, cursor: 'pointer'
              }}>🚀 Full Hire Form</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
