import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';

export default function Dashboard() {
  const [hireData, setHireData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hireRes, contactRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/hire`),
          fetch(`${API_BASE_URL}/api/dashboard/contact`)
        ]);

        if (!hireRes.ok || !contactRes.ok) {
          throw new Error('Failed to load dashboard data.');
        }

        const [hireJson, contactJson] = await Promise.all([hireRes.json(), contactRes.json()]);
        setHireData(hireJson.data || []);
        setContactData(contactJson.data || []);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section style={{ padding: '5rem 2rem', minHeight: '100vh', background: 'var(--off-white)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Dashboard</div>
          <div className="section-title">Saved Submissions</div>
          <p style={{ color: 'var(--gray-600)', maxWidth: 760, margin: '1rem auto 0' }}>
            View hire inquiries and contact messages stored in MongoDB. This dashboard shows live data from the backend.
          </p>
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'var(--gray-600)' }}>Loading dashboard data…</div>}
        {error && <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.75rem', marginBottom: '1rem' }}>Hire Inquiries</h2>
              {hireData.length === 0 ? (
                <p style={{ color: 'var(--gray-600)' }}>No hire inquiries have been received yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  {hireData.map((item, index) => (
                    <div key={index} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--gray-200)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{item.name}</div>
                          <a href={`mailto:${item.email}`} style={{ color: 'var(--accent)' }}>{item.email}</a>
                        </div>
                        <div style={{ color: 'var(--gray-600)' }}>{new Date(item.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div><strong>Project:</strong> {item.projectType}</div>
                        <div><strong>Budget:</strong> {item.budget}</div>
                      </div>
                      <div style={{ marginTop: '1rem', color: 'var(--gray-700)' }}><strong>Details:</strong> {item.details}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.75rem', marginBottom: '1rem' }}>Contact Messages</h2>
              {contactData.length === 0 ? (
                <p style={{ color: 'var(--gray-600)' }}>No contact messages have been received yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  {contactData.map((item, index) => (
                    <div key={index} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--gray-200)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{item.name}</div>
                          <a href={`mailto:${item.email}`} style={{ color: 'var(--accent)' }}>{item.email}</a>
                        </div>
                        <div style={{ color: 'var(--gray-600)' }}>{new Date(item.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ marginTop: '1rem', color: 'var(--gray-700)' }}><strong>Message:</strong> {item.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
