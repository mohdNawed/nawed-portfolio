import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onHireClick }) {
  const [scrolled, setScrolled] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    borderBottom: scrolled ? '1px solid var(--gray-200)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    padding: '0 2rem', height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  };

  const links = [
    { label: 'Home', href: `${baseUrl}#home` },
    { label: 'Projects', href: `${baseUrl}#projects` },
    { label: 'Services', href: `${baseUrl}#services` },
    { label: 'Skills', href: `${baseUrl}#skills` },
    { label: 'Social', href: `${baseUrl}#social` },
    { label: 'Contact', href: `${baseUrl}#contact` },
    { label: 'Dashboard', to: '/dashboard' },
  ];

  return (
    <nav style={navStyle}>
      <a href={`${baseUrl}#home`} style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'var(--black)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'inline-flex',
          overflow: 'hidden',
          border: '2px solid var(--accent)',
          background: 'var(--accent-light)',
          flexShrink: 0
        }}>
          <img src={`${baseUrl}profile.jpg`} alt="Md Nawed Alam" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
        </span>
        Nawed Dev
      </a>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }} className="nav-links-desktop">
        {links.map(link => (
          <li key={link.label}>
            {link.to ? (
              <Link to={link.to} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray-600)'}
              >{link.label}</Link>
            ) : (
              <a href={link.href} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray-600)'}
              >{link.label}</a>
            )}
          </li>
        ))}
      </ul>

      <button onClick={onHireClick} style={{
        background: 'var(--black)', color: 'white', border: 'none',
        padding: '0.5rem 1.25rem', borderRadius: 100, fontSize: '0.875rem',
        fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'
      }}
        onMouseEnter={e => e.target.style.background = 'var(--accent)'}
        onMouseLeave={e => e.target.style.background = 'var(--black)'}
      >✉ Hire Me</button>

      <style>{`
        @media (max-width: 768px) { .nav-links-desktop { display: none !important; } }
      `}</style>
    </nav>
  );
}
