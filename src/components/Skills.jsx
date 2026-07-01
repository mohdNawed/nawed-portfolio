import React, { useState } from 'react';
import SkillCard from './SkillCard';
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
            <SkillCard
              key={cat}
              category={cat}
              items={items}
              note={capabilityNotes[cat]}
              hovered={hovered}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
