import React, { useState } from 'react';
import { certificates } from '../data/projects';

export default function Certificates() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCert, setSelectedCert] = useState(certificates[0]);

  const hasCertificateFile = cert => Boolean(cert.file && cert.uploaded);
  const selectedHasFile = hasCertificateFile(selectedCert);

  return (
    <section id="certificates" style={{ background: 'white', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Certifications</div>
          <div className="section-title">Credentials & Achievements</div>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem auto 0', maxWidth: 560, fontSize: '0.95rem' }}>
            View the selected credential and download a copy when the certificate file is available.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="certificates-layout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {certificates.map(cert => (
            <div
              key={cert.id}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedCert(cert)}
              style={{
                background: selectedCert.id === cert.id || hoveredId === cert.id ? 'var(--off-white)' : 'white',
                border: `2px solid ${selectedCert.id === cert.id || hoveredId === cert.id ? cert.color : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredId === cert.id ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredId === cert.id ? `0 8px 24px ${cert.color}20` : 'none'
              }}
            >
              <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{cert.emoji}</div>
              <div style={{
                fontFamily: 'Space Grotesk,sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: 'var(--black)'
              }}>
                {cert.title}
              </div>
              <div style={{
                color: cert.color,
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {cert.issuer}
              </div>
              <div style={{
                color: 'var(--gray-600)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '1rem'
              }}>
                {cert.description}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--gray-500)'
              }}>
                <span>{cert.date}</span>
                <span style={{ color: cert.color, fontWeight: 700 }}>Preview</span>
              </div>
              {hasCertificateFile(cert) && (
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={event => event.stopPropagation()}
                    style={{
                      flex: 1,
                      minWidth: 96,
                      textAlign: 'center',
                      padding: '0.62rem 0.8rem',
                      borderRadius: 100,
                      background: 'var(--black)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.78rem'
                    }}
                  >
                    View
                  </a>
                  <a
                    href={cert.file}
                    download
                    onClick={event => event.stopPropagation()}
                    style={{
                      flex: 1,
                      minWidth: 96,
                      textAlign: 'center',
                      padding: '0.62rem 0.8rem',
                      borderRadius: 100,
                      background: cert.color,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.78rem'
                    }}
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          ))}
          </div>

          <div style={{
            border: `2px solid ${selectedCert.color}`,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--off-white)',
            boxShadow: `0 18px 40px ${selectedCert.color}18`
          }}>
            <div style={{
              minHeight: 300,
              background: `linear-gradient(135deg, ${selectedCert.color}18, white)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}>
              {selectedHasFile ? (
                <iframe
                  title={`${selectedCert.title} certificate preview`}
                  src={selectedCert.file}
                  style={{ width: '100%', height: 320, border: 0, borderRadius: 'var(--radius-sm)', background: 'white' }}
                />
              ) : (
                <div style={{ textAlign: 'center', maxWidth: 320 }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedCert.emoji}</div>
                  <div style={{
                    fontFamily: 'Space Grotesk,sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--black)',
                    marginBottom: '0.5rem'
                  }}>
                    Certificate Preview
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Add the PDF or image file to <strong>public/certificates</strong> using this certificate's file name to enable preview and download.
                  </p>
                </div>
              )}
            </div>

            <div style={{ background: 'white', padding: '1.25rem', borderTop: '1px solid var(--gray-200)' }}>
              <div style={{
                fontFamily: 'Space Grotesk,sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--black)',
                marginBottom: '0.35rem'
              }}>
                {selectedCert.title}
              </div>
              <div style={{ color: selectedCert.color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
                {selectedCert.issuer} • {selectedCert.date}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={selectedHasFile ? selectedCert.file : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!selectedHasFile}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: 100,
                    background: selectedHasFile ? 'var(--black)' : 'var(--gray-200)',
                    color: selectedHasFile ? 'white' : 'var(--gray-600)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    pointerEvents: selectedHasFile ? 'auto' : 'none'
                  }}
                >
                  View Certificate
                </a>
                <a
                  href={selectedHasFile ? selectedCert.file : undefined}
                  download
                  aria-disabled={!selectedHasFile}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: 100,
                    background: selectedHasFile ? selectedCert.color : 'var(--gray-100)',
                    color: selectedHasFile ? 'white' : 'var(--gray-600)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    pointerEvents: selectedHasFile ? 'auto' : 'none',
                    border: `1px solid ${selectedHasFile ? selectedCert.color : 'var(--gray-200)'}`
                  }}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .certificates-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
