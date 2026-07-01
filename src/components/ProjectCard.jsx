import React from 'react';

export default function ProjectCard({ project, active, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: active ? '1px solid rgba(124,58,237,0.28)' : '1px solid rgba(255,255,255,0.72)',
        transform: active ? 'translateY(-7px)' : 'none',
        boxShadow: active ? 'var(--shadow-color)' : '0 12px 32px rgba(15,23,42,0.08)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{
        height: 180,
        background: `linear-gradient(135deg, ${project.color} 0%, ${project.color2} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.5rem',
        position: 'relative',
      }}>
        <span>{project.emoji}</span>
        <span style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          borderRadius: 100,
        }}>
          {project.tag}
        </span>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '0.4rem',
        }}>
          {project.category}
        </div>
        <h3 style={{
          fontFamily: 'Space Grotesk,sans-serif',
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: 'var(--black)',
        }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>
          {project.description}
        </p>

        {project.features?.length > 0 && (
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
            {project.features.map(feature => (
              <li key={feature} style={{ display: 'flex', gap: '0.45rem' }}>
                <span style={{ color: 'var(--emerald)', fontWeight: 800 }}>✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          {project.tech.map(tech => (
            <span key={tech} style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: 100,
              padding: '2px 10px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--gray-800)',
            }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={project.github} target="_blank" rel="noreferrer" style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            GitHub
          </a>
          {project.live !== '#' && (
            <a href={project.live} target="_blank" rel="noreferrer" style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
