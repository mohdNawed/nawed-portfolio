import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--black)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 5rem)',
        fontWeight: 800,
        margin: '0 0 1rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '1rem',
        fontWeight: 600
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '1rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '2rem',
        maxWidth: '500px',
        lineHeight: 1.6
      }}>
        Oops! The page you're looking for doesn't exist. Let's get you back on track.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'white',
          color: 'var(--black)',
          padding: '0.8rem 2rem',
          borderRadius: 100,
          fontSize: '0.95rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.target.style.background = 'var(--accent)';
          e.target.style.color = 'white';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'white';
          e.target.style.color = 'var(--black)';
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}
