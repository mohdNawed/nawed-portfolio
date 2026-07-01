import React from 'react';
import { FaArrowRight, FaCode, FaDatabase, FaLayerGroup, FaRocket } from 'react-icons/fa';

const strengths = [
  {
    icon: FaLayerGroup,
    title: 'Learn and adapt quickly',
    text: 'I pick up new tools by building practical features, reading docs, and improving through feedback.',
    color: '#4f46e5',
  },
  {
    icon: FaCode,
    title: 'Break problems into steps',
    text: 'I turn unclear requirements into smaller tasks, then solve them with steady, readable implementation.',
    color: '#0f766e',
  },
  {
    icon: FaDatabase,
    title: 'Connect frontend to backend',
    text: 'I understand how UI, APIs, authentication, databases, and deployment work together in real applications.',
    color: '#b45309',
  },
  {
    icon: FaRocket,
    title: 'Own the full delivery',
    text: 'I enjoy taking a feature from idea to working product, testing it, deploying it, and refining the result.',
    color: '#be123c',
  },
];

export default function About({ onHireClick }) {
  return (
    <section id="about" style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(243,232,255,0.45))' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="about-intro">
          <div>
            <div className="section-eyebrow">About Me</div>
            <h2 className="section-title" style={{ maxWidth: 470 }}>
              Fresher mindset with real project habits.
            </h2>
          </div>

          <div style={{
            borderLeft: '3px solid var(--accent)',
            paddingLeft: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.98rem',
            lineHeight: 1.85,
          }}>
            <p style={{ marginBottom: '1rem' }}>
              I'm <strong style={{ color: 'var(--black)' }}>Md Nawed Alam</strong>, an MCA graduate and full-stack
              developer focused on becoming useful from day one: understanding the requirement, asking better
              questions, building carefully, and improving with feedback.
            </p>
            <p>
              Instead of only showing a long list of tools, my portfolio shows how I adapt across frontend,
              backend, databases, authentication, admin panels, and deployment. I learn by shipping complete
              features and solving the details that make an application reliable.
            </p>
          </div>
        </div>

        <div className="about-body">
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            alignSelf: 'stretch',
          }}>
            <div style={{
              color: '#a5b4fc',
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Hiring value
            </div>
            <h3 style={{
              fontFamily: 'Space Grotesk,sans-serif',
              fontSize: '1.55rem',
              lineHeight: 1.3,
              marginBottom: '1rem',
            }}>
              I bring curiosity, ownership, and the patience to solve unfamiliar problems.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              For fresher roles, I believe the strongest skill is adaptability. I can work with existing code,
              learn a new stack when needed, communicate progress clearly, and keep improving until the feature works.
            </p>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginTop: '1.75rem',
            }}>
              <a href="#projects" style={{
                background: 'white',
                color: 'var(--black)',
                padding: '0.7rem 1.1rem',
                borderRadius: 100,
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}>
                Explore my work <FaArrowRight />
              </a>
              <button onClick={onHireClick} style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '0.7rem 1.1rem',
                borderRadius: 100,
                fontSize: '0.84rem',
              }}>
                Work with me
              </button>
            </div>
          </div>

          <div className="about-strengths">
            {strengths.map(({ icon: Icon, title, text, color }) => (
              <div key={title} style={{
                borderTop: `3px solid ${color}`,
                padding: '1.25rem 0',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `${color}14`,
                  color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.9rem',
                }}>
                  <Icon />
                </div>
                <h3 style={{
                  fontFamily: 'Space Grotesk,sans-serif',
                  fontSize: '1rem',
                  color: 'var(--black)',
                  marginBottom: '0.45rem',
                }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.65 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-details">
          <div>
            <span>Education</span>
            <strong>Master of Computer Applications</strong>
          </div>
          <div>
            <span>Primary focus</span>
            <strong>Adaptive full-stack development</strong>
          </div>
          <div>
            <span>Currently open to</span>
            <strong>Fresher roles, internships and freelance</strong>
          </div>
        </div>
      </div>

      <style>{`
        .about-intro {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 4rem;
          align-items: start;
          margin-bottom: 3rem;
        }

        .about-body {
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
          gap: 2rem;
          align-items: start;
        }

        .about-strengths {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 2rem;
          row-gap: 1rem;
        }

        .about-details {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 3rem;
          border-top: 1px solid var(--gray-200);
          border-bottom: 1px solid var(--gray-200);
        }

        .about-details > div {
          padding: 1.25rem;
          border-right: 1px solid var(--gray-200);
        }

        .about-details > div:last-child {
          border-right: 0;
        }

        .about-details span,
        .about-details strong {
          display: block;
        }

        .about-details span {
          color: var(--text-muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }

        .about-details strong {
          color: var(--black);
          font-size: 0.9rem;
        }

        @media (max-width: 800px) {
          .about-intro,
          .about-body {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .about-details {
            grid-template-columns: 1fr;
          }

          .about-details > div {
            border-right: 0;
            border-bottom: 1px solid var(--gray-200);
          }

          .about-details > div:last-child {
            border-bottom: 0;
          }
        }

        @media (max-width: 520px) {
          .about-strengths {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}


