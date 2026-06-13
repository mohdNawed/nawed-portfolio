import React from 'react';
import { stats } from '../data/projects';

export default function Stats() {
  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto 5rem', padding: '0 2rem',
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden'
    }}>
      <style>{`@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '1.75rem',
          borderRight: i < stats.length - 1 ? '1px solid var(--gray-200)' : 'none'
        }}>
          <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--black)' }}>{s.num}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
