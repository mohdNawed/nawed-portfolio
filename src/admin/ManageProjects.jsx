import React from 'react';
import { projects } from '../data/projects';

export default function ManageProjects() {
  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
      <div className="section-eyebrow">Admin</div>
      <h1 className="section-title">Manage Projects</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.7 }}>
        Project data is currently managed from <strong>src/data/projects.js</strong>. This page keeps the admin
        folder ready for a future editable project manager.
      </p>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '2rem' }}>
        {projects.map(project => (
          <div key={project.id} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <strong>{project.title}</strong>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.88rem' }}>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
