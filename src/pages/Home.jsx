import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Projects from '../components/Projects';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Certificates from '../components/Certificates';
import SocialMedia from '../components/SocialMedia';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home({ onHireClick }) {
  return (
    <>
      <Hero onHireClick={onHireClick} />
      <Stats />
      <About onHireClick={onHireClick} />
      <Projects />
      <Services />
      <Skills />
      <Certificates />
      <SocialMedia />

      <section style={{
        background: 'var(--gradient-primary)',
        color: 'white',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <div style={{
            color: 'rgba(255,255,255,0.78)',
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}>
            Available for opportunities
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk,sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem,3.5vw,2.65rem)',
            marginBottom: '1rem',
            letterSpacing: 0,
          }}>
            Let&apos;s build something useful, modern, and memorable.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.75 }}>
            I&apos;m ready for fresher roles, internships, freelance work, and teams that value fast learning plus real ownership.
          </p>
          <button
            onClick={onHireClick}
            style={{
              background: 'white',
              color: 'var(--accent)',
              padding: '0.85rem 2rem',
              borderRadius: 100,
              fontSize: '0.9rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 18px 36px rgba(15,23,42,0.22)',
            }}
          >
            Get in Touch
          </button>
        </div>
      </section>

      <Contact onHireClick={onHireClick} />
      <Footer />
    </>
  );
}
