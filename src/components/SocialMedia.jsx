import React, { useState } from 'react';
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { socialLinks } from '../data/projects';

const iconMap = {
  Email: FaEnvelope,
  GitHub: FaGithub,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
};

export default function SocialMedia() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="social" style={{ padding: '5rem 2rem', background: 'var(--off-white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Social Media</div>
          <div className="section-title">Connect With Me</div>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem auto 0', maxWidth: 540, fontSize: '0.95rem' }}>
            Follow my work, check my code, or reach out directly for projects and opportunities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {socialLinks.map(link => {
            const Icon = iconMap[link.icon] || FaEnvelope;
            const isHovered = hovered === link.label;

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: 'white',
                  border: `1.5px solid ${isHovered ? link.color : 'var(--gray-200)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.25s ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 14px 30px ${link.color}20` : 'none'
                }}
              >
                <span style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: `${link.color}14`,
                  color: link.color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.25rem'
                }}>
                  <Icon />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'Space Grotesk,sans-serif',
                    fontWeight: 800,
                    color: 'var(--black)',
                    marginBottom: '0.15rem'
                  }}>
                    {link.label}
                  </span>
                  <span style={{ display: 'block', color: link.color, fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.25rem' }}>
                    {link.handle}
                  </span>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {link.description}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
