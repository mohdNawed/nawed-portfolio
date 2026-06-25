import React, { useState } from 'react';
import { projects } from '../data/projects';

const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'React', 'Java', 'Database'];

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [hovered, setHovered] = useState(null);

  const filtered = filter === 'All' ? projects : projects.filter(p =>
    p.category.toLowerCase().includes(filter.toLowerCase()) ||
    p.tag.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="projects" style={{ background: 'var(--off-white)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-eyebrow">Selected Work</div>
            <div className="section-title">Featured Projects</div>
          </div>
          <a href="https://github.com/mohdNawed" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>View all on GitHub →</a>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 500,
              border: '1.5px solid',
              borderColor: filter === c ? 'var(--accent)' : 'var(--gray-200)',
              background: filter === c ? 'var(--accent)' : 'white',
              color: filter === c ? 'white' : 'var(--gray-600)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
          gap: '1.25rem'
        }}>
          {filtered.map(p => (
            <div key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'white', borderRadius: 'var(--radius)',
                overflow: 'hidden', border: '1px solid var(--gray-200)',
                transform: hovered === p.id ? 'translateY(-6px)' : 'none',
                boxShadow: hovered === p.id ? '0 16px 40px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.25s ease'
              }}>
              {/* Thumb */}
              <div style={{
                height: 180,
                background: `linear-gradient(135deg, ${p.color} 0%, ${p.color2} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.5rem',
                position: 'relative'
              }}>
                <span>{p.emoji}</span>
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                  color: 'white', fontSize: '0.65rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 100
                }}>{p.tag}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{p.category}</div>
                <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>{p.description}</p>

                {p.features?.length > 0 && (
                  <ul style={{
                    display: 'grid',
                    gap: '0.35rem',
                    padding: 0,
                    margin: '0 0 1rem',
                    listStyle: 'none',
                    color: 'var(--gray-700)',
                    fontSize: '0.78rem',
                    lineHeight: 1.45,
                  }}>
                    {p.features.map(feature => (
                      <li key={feature} style={{ display: 'flex', gap: '0.45rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {p.tech.map(t => (
                    <span key={t} style={{
                      background: 'var(--gray-100)', borderRadius: 100,
                      padding: '2px 10px', fontSize: '0.72rem', fontWeight: 500,
                      color: 'var(--gray-800)'
                    }}>{t}</span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href={p.github} target="_blank" rel="noreferrer" style={{
                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>⬡ GitHub</a>
                  {p.live !== '#' && (
                    <a href={p.live} target="_blank" rel="noreferrer" style={{
                      fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)',
                      display: 'flex', alignItems: 'center', gap: 4
                    }}>↗ Live Demo</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
