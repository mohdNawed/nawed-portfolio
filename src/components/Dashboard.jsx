import React, { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

const formatDate = (date) => {
  if (!date) return 'No date';
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const EmptyState = ({ title, text }) => (
  <div style={{
    background: 'white',
    border: '1px dashed var(--gray-200)',
    borderRadius: 'var(--radius)',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Inbox</div>
    <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.15rem', marginBottom: '0.35rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
  </div>
);

const StatCard = ({ label, value, helper }) => (
  <div style={{
    background: 'white',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
  }}>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--black)', marginTop: '0.25rem' }}>{value}</div>
    <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{helper}</div>
  </div>
);

const MessageCard = ({ item, type }) => (
  <article style={{
    background: 'white',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem',
    display: 'grid',
    gap: '1rem',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.1rem', margin: 0 }}>{item.name || 'Unknown sender'}</h3>
          <span style={{
            background: type === 'hire' ? 'var(--accent-light)' : 'var(--gray-100)',
            color: type === 'hire' ? 'var(--accent)' : 'var(--gray-600)',
            borderRadius: 100,
            padding: '0.2rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}>
            {type === 'hire' ? 'Hire Inquiry' : 'Contact'}
          </span>
        </div>
        <a href={`mailto:${item.email}`} style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
          {item.email}
        </a>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{formatDate(item.createdAt)}</div>
    </div>

    {type === 'hire' ? (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '0.75rem',
      }} className="dashboard-detail-grid">
        <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>Project</span>
          <strong style={{ fontSize: '0.9rem' }}>{item.projectType || 'Not specified'}</strong>
        </div>
        <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>Budget</span>
          <strong style={{ fontSize: '0.9rem' }}>{item.budget || 'Not specified'}</strong>
        </div>
      </div>
    ) : null}

    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
        {type === 'hire' ? 'Project Details' : 'Message'}
      </div>
      <p style={{ color: 'var(--gray-800)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
        {type === 'hire' ? item.details || 'No details added.' : item.message || 'No message added.'}
      </p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <a href={`mailto:${item.email}`} style={{
        background: 'var(--black)',
        color: 'white',
        borderRadius: 100,
        padding: '0.55rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 700,
      }}>
        Reply by Email
      </a>
    </div>
  </article>
);

export default function Dashboard() {
  const [hireData, setHireData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [activeTab, setActiveTab] = useState('hire');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user, signOut } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const requestOptions = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const [hireRes, contactRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/hire`, requestOptions),
          fetch(`${API_BASE_URL}/api/dashboard/contact`, requestOptions),
        ]);

        if (!hireRes.ok || !contactRes.ok) {
          throw new Error('Could not load dashboard messages. Please sign in again.');
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
  }, [token]);

  const latestMessageDate = useMemo(() => {
    const allItems = [...hireData, ...contactData].filter(item => item.createdAt);
    if (allItems.length === 0) return 'No messages yet';
    const latest = allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return formatDate(latest.createdAt);
  }, [hireData, contactData]);

  const activeItems = activeTab === 'hire' ? hireData : contactData;
  const activeType = activeTab === 'hire' ? 'hire' : 'contact';

  return (
    <section style={{ padding: '5rem 1.25rem', minHeight: '100vh', background: 'var(--off-white)' }}>
      <style>{`
        @media (max-width: 720px) {
          .dashboard-header,
          .dashboard-toolbar {
            align-items: flex-start !important;
            flex-direction: column !important;
          }
          .dashboard-stats {
            grid-template-columns: 1fr !important;
          }
          .dashboard-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="dashboard-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <div className="section-eyebrow">Admin Dashboard</div>
            <h1 className="section-title">Messages & Inquiries</h1>
            <p style={{ color: 'var(--gray-600)', marginTop: '0.65rem', maxWidth: 620 }}>
              See who contacted you, what they need, and reply directly from one simple inbox.
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius)',
            padding: '0.85rem',
            minWidth: 220,
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Signed in</div>
            <strong style={{ display: 'block', marginTop: 2 }}>{user?.name || 'Admin'}</strong>
            <button onClick={signOut} style={{
              width: '100%',
              marginTop: '0.75rem',
              border: 'none',
              borderRadius: 100,
              background: 'var(--black)',
              color: 'white',
              padding: '0.55rem 1rem',
              fontWeight: 700,
            }}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="dashboard-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <StatCard label="Hire inquiries" value={hireData.length} helper="Project requests" />
          <StatCard label="Contact messages" value={contactData.length} helper="General messages" />
          <StatCard label="Latest activity" value={hireData.length + contactData.length} helper={latestMessageDate} />
        </div>

        <div className="dashboard-toolbar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'hire', label: `Hire (${hireData.length})` },
              { id: 'contact', label: `Contact (${contactData.length})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                border: '1.5px solid',
                borderColor: activeTab === tab.id ? 'var(--accent)' : 'var(--gray-200)',
                background: activeTab === tab.id ? 'var(--accent)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--gray-600)',
                borderRadius: 100,
                padding: '0.55rem 1rem',
                fontWeight: 800,
              }}>
                {tab.label}
              </button>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            {activeItems.length} item{activeItems.length === 1 ? '' : 's'} shown
          </p>
        </div>

        {loading && (
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>
            Loading your dashboard...
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', padding: '1rem', color: '#b91c1c', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {!loading && !error && activeItems.length === 0 && (
          <EmptyState
            title={activeTab === 'hire' ? 'No hire inquiries yet' : 'No contact messages yet'}
            text={activeTab === 'hire' ? 'New project requests will appear here.' : 'New contact form messages will appear here.'}
          />
        )}

        {!loading && !error && activeItems.length > 0 && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {activeItems.map((item, index) => (
              <MessageCard key={item._id || index} item={item} type={activeType} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
