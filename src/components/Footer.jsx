import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--gray-200)', padding: '1.5rem 2rem',
      maxWidth: 1100, margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1rem',
    }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2024 Md Nawed Alam. All rights reserved.</span>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { label: 'Email', href: 'mailto:mdalamnawed@gmail.com' },
          { label: 'GitHub', href: 'https://github.com/mohdNawed' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/md-nawed-alam-05b3b2240/' },
        ].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >{l.label}</a>
        ))}
      </div>
    </footer>
  );
}
