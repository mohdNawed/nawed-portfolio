import React from 'react';

export default function Hero({ onHireClick }) {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section id="home" className="hero-grid" style={{
      maxWidth: 1180,
      margin: '0 auto',
      padding: '7.5rem 2rem 4.5rem',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 390px',
      gap: '4rem',
      alignItems: 'center',
      position: 'relative',
    }}>
      <style>{`
        .hero-grid::before {
          content: '';
          position: absolute;
          inset: 5rem 1rem auto;
          height: 75%;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.1) 46%, rgba(249,115,22,0.12));
          z-index: -1;
        }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:minmax(0,1fr) !important; padding:5.5rem 1.25rem 3rem !important; gap:2rem !important;}
          .hero-grid::before{inset:4rem 0.5rem auto; height:88%;}
          .hero-content,.hero-visual-wrap{min-width:0;}
          .hero-visual-wrap{order:-1; max-width:360px; width:100%; margin:0 auto;}
          .hero-tag{left:10px !important;}
        }
      `}</style>

      <div className="hero-content">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.78)', border: '1px solid rgba(124,58,237,0.22)',
          borderRadius: 100, padding: '6px 14px', fontSize: '0.78rem',
          color: 'var(--gray-700)', marginBottom: '1.5rem', boxShadow: '0 12px 30px rgba(124,58,237,0.12)'
        }}>
          <span style={{ width: 8, height: 8, background: 'var(--emerald)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 5px rgba(16,185,129,0.13)' }} />
          Full Stack MERN Developer | MCA Graduate
        </div>

        <h1 style={{
          fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(2.35rem,4.4vw,3.8rem)',
          fontWeight: 800, lineHeight: 1.08, color: 'var(--black)', marginBottom: '1.25rem', letterSpacing: 0
        }}>
          Hi, I'm Md Nawed Alam<br />
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>Adaptive Full Stack</span>
          <br />MERN Developer.
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--gray-700)', maxWidth: 510, marginBottom: '2rem', lineHeight: 1.8 }}>
          I build responsive, scalable, and colorful web applications with React, Node.js, Express,
          MongoDB, Supabase, and JavaScript. As a fresher, I show hiring teams how fast I adapt,
          connect ideas to working features, and keep improving after feedback.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(130px, 1fr))', gap: '0.75rem', maxWidth: 500, marginBottom: '2rem' }}>
          {[
            ['12+', 'Projects Built', 'var(--accent)'],
            ['5+', 'Full-stack Apps', 'var(--cyan)'],
            ['MCA', 'Graduate', 'var(--orange)'],
            ['Open', 'Fresher Roles', 'var(--emerald)'],
          ].map(([num, label, color]) => (
            <div key={label} style={{
              border: `1px solid ${color}30`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.8rem 0.9rem',
              background: 'rgba(255,255,255,0.82)',
              boxShadow: '0 10px 28px rgba(15,23,42,0.08)',
            }}>
              <strong style={{ display: 'block', color, fontSize: '1.08rem', fontFamily: 'Space Grotesk,sans-serif' }}>{num}</strong>
              <span style={{ color: 'var(--gray-700)', fontSize: '0.76rem', fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="#projects" style={{
            background: 'var(--gradient-primary)', color: 'white', padding: '0.78rem 1.55rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex',
            alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer',
            boxShadow: '0 14px 28px rgba(124,58,237,0.28)', textDecoration: 'none'
          }}>View Projects</a>

          <button onClick={onHireClick} style={{
            background: 'var(--gradient-warm)', color: 'white', padding: '0.78rem 1.55rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 700,
            border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            boxShadow: '0 14px 28px rgba(249,115,22,0.24)'
          }}>Hire Me</button>

          <a href={`${baseUrl}Nawed_Resume.pdf`} download style={{
            background: 'rgba(255,255,255,0.9)', color: 'var(--text)', padding: '0.78rem 1.45rem',
            borderRadius: 100, fontSize: '0.9rem', fontWeight: 700,
            border: '1.5px solid rgba(124,58,237,0.22)', display: 'inline-flex',
            alignItems: 'center', gap: 6, textDecoration: 'none'
          }}>Download Resume</a>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {[
            { label: 'GH', href: 'https://github.com/mohdNawed', title: 'GitHub', color: 'var(--black)' },
            { label: 'in', href: 'https://www.linkedin.com/in/md-nawed-alam-05b3b2240/', title: 'LinkedIn', color: 'var(--blue)' },
            { label: '@', href: 'https://www.instagram.com/iamnawwed/', title: 'Instagram', color: 'var(--rose)' },
            { label: '✉', href: 'mailto:mdalamnawed@gmail.com', title: 'Email', color: 'var(--orange)' },
          ].map(s => (
            <a key={s.title} href={s.href} target="_blank" rel="noreferrer" title={s.title} style={{
              width: 40, height: 40, border: `1.5px solid ${s.color}33`,
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: s.color, fontSize: '0.78rem',
              fontWeight: 800, background: 'rgba(255,255,255,0.78)', boxShadow: '0 10px 24px rgba(15,23,42,0.08)'
            }}>{s.label}</a>
          ))}
        </div>
      </div>

      <div className="hero-visual-wrap" style={{ position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '4/5', borderRadius: 24,
          padding: 7,
          background: 'var(--gradient-warm)',
          boxShadow: '0 26px 70px rgba(244,63,94,0.22)',
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 19, overflow: 'hidden', background: 'var(--gray-100)' }}>
            <img
              src={`${baseUrl}profile.jpg`}
              alt="Md Nawed Alam - Full Stack Developer"
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        </div>
        <div className="hero-tag" style={{
          position: 'absolute', bottom: 22, left: -26,
          background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 'var(--radius)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(12px)'
        }}>
          <div style={{ width: 38, height: 38, background: 'var(--gradient-primary)', color: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>✓</div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem' }}>Ready to contribute</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open to fresher roles</span>
          </div>
        </div>
      </div>
    </section>
  );
}
