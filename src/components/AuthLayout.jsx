import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f6f2 0%, #eef2ff 55%, #ffffff 100%)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(360px, 460px)',
      alignItems: 'stretch',
    }}>
      <section className="auth-hero" style={{
        padding: '7rem 3rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--black)',
          fontFamily: 'Space Grotesk,sans-serif',
          fontWeight: 800,
          fontSize: '1.25rem',
        }}>
          <span style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'inline-flex',
            overflow: 'hidden',
            border: '2px solid var(--accent)',
            background: 'var(--accent-light)',
          }}>
            <img src={`${baseUrl}profile.jpg`} alt="Md Nawed Alam" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          </span>
          Nawed Dev
        </Link>

        <div style={{ maxWidth: 620, marginTop: '4rem' }}>
          <div className="section-eyebrow">{eyebrow}</div>
          <h1 style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
            lineHeight: 1.05,
            color: 'var(--black)',
            marginBottom: '1.25rem',
          }}>{title}</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 500 }}>
            {subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          maxWidth: 620,
          marginTop: '3rem',
        }}>
          {[
            ['Secure', 'Token based access'],
            ['Managed', 'Backend auth routes'],
            ['Private', 'Dashboard protected'],
          ].map(([label, text]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
            }}>
              <strong style={{ display: 'block', color: 'var(--black)', fontSize: '0.9rem' }}>{label}</strong>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{
        background: 'white',
        borderLeft: '1px solid var(--gray-200)',
        padding: '6rem 2rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </section>

      <style>{`
        @media (max-width: 860px) {
          main { grid-template-columns: 1fr !important; }
          .auth-hero { min-height: auto !important; padding: 5rem 1.25rem 2rem !important; }
          .auth-hero + section { border-left: none !important; padding: 2rem 1.25rem 3rem !important; }
        }
        @media (max-width: 520px) {
          .auth-hero div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
