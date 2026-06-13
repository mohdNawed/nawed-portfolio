import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Projects from './components/Projects';
import Services from './components/Services';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import HireModal from './components/HireModal';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [hireOpen, setHireOpen] = useState(false);

  return (
    <div>
      <Navbar onHireClick={() => setHireOpen(true)} />
      <Hero onHireClick={() => setHireOpen(true)} />
      <Stats />
      <Projects />
      <Services />
      <Skills />
      <Certificates />

      {/* CTA Banner */}
      <section style={{
        background: 'var(--black)', color: 'white',
        padding: '5rem 2rem', textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800,
          fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', marginBottom: '1rem'
        }}>Let's build something great together.</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>
          I'm actively looking for freelance work and full-time opportunities. Let's connect!
        </p>
        <button onClick={() => setHireOpen(true)} style={{
          background: 'white', color: 'var(--black)',
          padding: '0.8rem 2rem', borderRadius: 100,
          fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer',
          transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = 'white'; }}
          onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--black)'; }}
        >✉ Get in Touch</button>
      </section>

      <Contact onHireClick={() => setHireOpen(true)} />
      <Footer />
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </div>
  );
}

export default App;
