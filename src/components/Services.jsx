import React, { useState } from 'react';

const services = [
  { icon: '🎨', title: 'UI/UX Design', desc: 'Clean, intuitive interfaces from wireframes to polished Figma prototypes — beautiful and effortless to use.' },
  { icon: '⚛️', title: 'Frontend Development', desc: 'Pixel-perfect, responsive UIs with React, Next.js, and Tailwind CSS that perform fast on every device.' },
  { icon: '⚙️', title: 'Backend Development', desc: 'Solid REST APIs, authentication, and server-side logic with Node.js, Express, and databases like MongoDB and PostgreSQL.' },
  { icon: '🖥️', title: 'Web Design', desc: 'Visually distinctive landing pages, portfolios, and product sites with sharp design sensibility and clean code.' },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="services" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-eyebrow">What I Do</div>
        <div className="section-title">Services &amp; Expertise</div>
      </div>
      <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
        <style>{`@media(max-width:600px){.services-grid{grid-template-columns:1fr!important;}}`}</style>
        {services.map((s, i) => (
          <div key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '1.75rem', borderRadius: 'var(--radius)',
              border: `1px solid ${hovered === i ? 'var(--accent)' : 'var(--gray-200)'}`,
              background: hovered === i ? 'var(--accent-light)' : 'white',
              transition: 'all 0.2s', cursor: 'default'
            }}>
            <div style={{
              width: 44, height: 44, background: hovered === i ? 'white' : 'var(--gray-100)',
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem', transition: 'background 0.2s'
            }}>{s.icon}</div>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
