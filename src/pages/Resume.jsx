import React from 'react';

export default function Resume() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section style={{ padding: '7rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <div className="section-eyebrow">Resume</div>
      <h1 className="section-title">Md Nawed Alam Resume</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 620, marginTop: '1rem' }}>
        View or download the latest resume for fresher full-stack developer roles, internships, and project work.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <a href={`${baseUrl}Nawed_Resume.pdf`} target="_blank" rel="noreferrer" style={{
          background: 'var(--black)',
          color: 'white',
          padding: '0.75rem 1.35rem',
          borderRadius: 100,
          textDecoration: 'none',
          fontWeight: 700,
        }}>
          View Resume
        </a>
        <a href={`${baseUrl}Nawed_Resume.pdf`} download style={{
          border: '1.5px solid var(--gray-200)',
          color: 'var(--black)',
          padding: '0.75rem 1.35rem',
          borderRadius: 100,
          textDecoration: 'none',
          fontWeight: 700,
        }}>
          Download Resume
        </a>
      </div>
    </section>
  );
}
