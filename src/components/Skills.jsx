import React, { useState } from 'react';
import { skills } from '../data/projects';

export default function Skills() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="skills" style={{ background: 'var(--off-white)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Tech Stack</div>
          <div className="section-title">Tools I Work With</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {Object.entries(skills).map(([cat, items]) => (
            <div key={cat} style={{
              background: 'white', borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)', padding: '1.5rem'
            }}>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--black)' }}>{cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {items.map(skill => (
                  <span key={skill}
                    onMouseEnter={() => setHovered(skill)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: hovered === skill ? 'var(--accent)' : 'var(--gray-100)',
                      color: hovered === skill ? 'white' : 'var(--gray-800)',
                      border: `1px solid ${hovered === skill ? 'var(--accent)' : 'var(--gray-200)'}`,
                      borderRadius: 100, padding: '0.3rem 0.8rem',
                      fontSize: '0.8rem', fontWeight: 500,
                      transition: 'all 0.2s', cursor: 'default'
                    }}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
