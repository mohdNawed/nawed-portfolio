import React, { useState } from 'react';
import { certificates } from '../data/projects';

export default function Certificates() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="certificates" style={{ background: 'white', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Certifications</div>
          <div className="section-title">Credentials & Achievements</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {certificates.map(cert => (
            <div
              key={cert.id}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hoveredId === cert.id ? 'var(--off-white)' : 'white',
                border: `2px solid ${hoveredId === cert.id ? cert.color : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredId === cert.id ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredId === cert.id ? `0 8px 24px ${cert.color}20` : 'none'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{cert.emoji}</div>
              <div style={{
                fontFamily: 'Space Grotesk,sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: 'var(--black)'
              }}>
                {cert.title}
              </div>
              <div style={{
                color: cert.color,
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {cert.issuer}
              </div>
              <div style={{
                color: 'var(--gray-600)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                {cert.description}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--gray-500)'
              }}>
                <span>{cert.date}</span>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: cert.color,
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                  >
                    View →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
