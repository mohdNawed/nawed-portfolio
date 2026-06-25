import React from 'react';

export default function Hero({ onHireClick }) {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section id="home" className="hero-grid" style={{
      maxWidth: 1100, margin: '0 auto',
      padding: '7rem 2rem 4rem',
      display: 'grid', gridTemplateColumns: '1fr 380px',
      gap: '4rem', alignItems: 'center',
    }}>
      <style>{`
        @media(max-width:768px){
          .hero-grid{grid-template-columns:minmax(0,1fr) !important; padding:5rem 1.25rem 3rem !important; gap:2rem !important;}
          .hero-content,.hero-visual-wrap{min-width:0;}
          .hero-visual-wrap{order:-1;}
          .hero-tag{left:10px !important;}
        }
      `}</style>

      <div className="hero-content">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
          borderRadius: 100, padding: '4px 12px', fontSize: '0.78rem',
          color: 'var(--gray-600)', marginBottom: '1.5rem'
        }}>
          <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
          Full Stack MERN Developer | MCA Graduate
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(2.2rem,4vw,3.2rem)',
          fontWeight: 800, lineHeight: 1.15, color: 'var(--black)', marginBottom: '1.25rem'
        }}>
          Hi, I'm Md Nawed Alam<br />
          <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Full Stack</em>
          <br />MERN Developer.
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 440, marginBottom: '2rem', lineHeight: 1.75 }}>
          I build responsive, scalable, and modern web applications using React, Node.js, Express,
          MongoDB, and JavaScript. As a fresher, I bring hands-on project experience, adaptability,
          and a quick learning mindset.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(130px, 1fr))', gap: '0.6rem', maxWidth: 440, marginBottom: '2rem' }}>
          {[
            ['12+', 'Projects Built'],
            ['5+', 'Full-stack Apps'],
            ['MCA', 'Graduate'],
            ['Open', 'Fresher Roles'],
          ].map(([num, label]) => (
            <div key={label} style={{
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.7rem 0.85rem',
              background: 'white',
            }}>
              <strong style={{ display: 'block', color: 'var(--black)', fontSize: '1rem', fontFamily: 'Space Grotesk,sans-serif' }}>{num}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="#projects" style={{
            background: 'var(--black)', color: 'white', padding: '0.7rem 1.5rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex',
            alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer',
            transition: 'background 0.2s', textDecoration: 'none'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--black)'}
          >⚡ View Projects</a>

          <a href={`${baseUrl}Nawed_Resume.pdf`} download style={{
            background: 'transparent', color: 'var(--text)', padding: '0.7rem 1.5rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 500,
            border: '1.5px solid var(--gray-200)', display: 'inline-flex',
            alignItems: 'center', gap: 6, transition: 'border-color 0.2s', textDecoration: 'none'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gray-400)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
          >↓ Download Resume</a>

          <a href={`${baseUrl}Nawed_Resume.pdf`} target="_blank" rel="noreferrer" style={{
            background: 'transparent', color: 'var(--text)', padding: '0.7rem 1.5rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 500,
            border: '1.5px solid var(--gray-200)', display: 'inline-flex',
            alignItems: 'center', gap: 6, transition: 'border-color 0.2s', textDecoration: 'none'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gray-400)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
          >View Resume</a>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {[
            { label: 'GH', href: 'https://github.com/mohdNawed', title: 'GitHub' },
            { label: 'in', href: 'https://www.linkedin.com/in/md-nawed-alam-05b3b2240/', title: 'LinkedIn' },
            { label: '✉', href: 'mailto:mdalamnawed@gmail.com', title: 'Email' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.title} style={{
              width: 38, height: 38, border: '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--gray-600)', fontSize: '0.75rem',
              fontWeight: 600, transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
            >{s.label}</a>
          ))}
        </div>
      </div>

      <div className="hero-visual-wrap" style={{ position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '4/5', borderRadius: 20,
          overflow: 'hidden', background: 'var(--gray-100)',
        }}>
          <img
            src={`${baseUrl}profile.jpg`}
            alt="Md Nawed Alam - Full Stack Developer"
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <div className="hero-tag" style={{
          position: 'absolute', bottom: 20, left: -24,
          background: 'white', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🎓</div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem' }}>MCA Graduate</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open to fresher roles</span>
          </div>
        </div>
      </div>
    </section>
  );
}
