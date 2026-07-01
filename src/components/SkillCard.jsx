import React from 'react';

export default function SkillCard({ category, items, note, hovered, onHover, onLeave }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--gray-200)',
      padding: '1.5rem',
    }}>
      <div style={{
        fontFamily: 'Space Grotesk,sans-serif',
        fontWeight: 700,
        fontSize: '0.95rem',
        marginBottom: '1rem',
        color: 'var(--black)',
      }}>
        {category}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
        {note}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {items.map(skill => (
          <span
            key={skill}
            onMouseEnter={() => onHover(skill)}
            onMouseLeave={onLeave}
            style={{
              background: hovered === skill ? 'var(--accent)' : 'var(--gray-100)',
              color: hovered === skill ? 'white' : 'var(--gray-800)',
              border: `1px solid ${hovered === skill ? 'var(--accent)' : 'var(--gray-200)'}`,
              borderRadius: 100,
              padding: '0.3rem 0.8rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              cursor: 'default',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
