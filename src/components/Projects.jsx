import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
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
            <ProjectCard
              key={p.id}
              project={p}
              active={hovered === p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
