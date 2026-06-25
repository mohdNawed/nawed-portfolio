import React, { useState } from 'react';
import { skills } from '../data/projects';

export default function Skills() {
  const [hovered, setHovered] = useState(null);

  const capabilityNotes = {
    Languages: 'I use programming fundamentals to write logic, solve DSA problems, and understand backend behavior.',
    Frontend: 'I build responsive interfaces, reusable components, and user flows that feel simple to use.',
    Backend: 'I create APIs, connect forms, handle auth flows, and structure server logic for real projects.',
    Databases: 'I store, query, and manage application data with both SQL and NoSQL approaches.',
    Tools: 'I use developer tools to debug, test APIs, manage code, deploy, and collaborate with teams.',
  };

  return (
    <section id="skills" style={{ background: 'var(--off-white)', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Adaptive Capabilities</div>
          <div className="section-title">How I Turn Skills Into Work</div>
          <p style={{
            maxWidth: 680,
            margin: '0.85rem auto 0',
            color: 'var(--text-muted)',
            lineHeight: 1.75,
            fontSize: '0.95rem',
          }}>
            I do not want to present myself as someone who only knows tool names. I focus on learning quickly,
            understanding project needs, and using the right technology to build working features.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {Object.entries(skills).map(([cat, items]) => (
            <div key={cat} style={{
              background: 'white', borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)', padding: '1.5rem'
            }}>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--black)' }}>{cat}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {capabilityNotes[cat]}
              </p>
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
