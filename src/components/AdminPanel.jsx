import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiArchive,
  FiBriefcase,
  FiCheck,
  FiInbox,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const statusOptions = ['all', 'new', 'read', 'archived'];
const typeOptions = ['all', 'contact', 'hire'];

const formatDate = value => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

export default function AdminPanel() {
  const { checkingAuth, isAuthenticated, signOut, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storage, setStorage] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      navigate('/signin', { replace: true, state: { from: location.pathname } });
    }
  }, [checkingAuth, isAuthenticated, location.pathname, navigate]);

  const loadMessages = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not load messages.');
      setMessages(data.data || []);
      setStorage(data.storage || '');
    } catch (loadError) {
      setError(loadError.message || 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter(item => {
      const matchesStatus = status === 'all' || item.status === status;
      const matchesType = type === 'all' || item.type === type;
      const matchesSearch = !query || [item.name, item.email, item.message, item.project_type]
        .some(value => String(value || '').toLowerCase().includes(query));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [messages, search, status, type]);

  const counts = useMemo(() => ({
    total: messages.length,
    new: messages.filter(item => item.status === 'new').length,
    contact: messages.filter(item => item.type === 'contact').length,
    hire: messages.filter(item => item.type === 'hire').length,
  }), [messages]);

  const updateStatus = async (message, nextStatus) => {
    setBusyId(message.id);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus, type: message.type }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not update the message.');
      setMessages(current => current.map(item => (
        item.id === message.id ? { ...item, status: nextStatus } : item
      )));
    } catch (updateError) {
      setError(updateError.message || 'Could not update the message.');
    } finally {
      setBusyId('');
    }
  };

  const deleteMessage = async message => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    setBusyId(message.id);
    setError('');
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/messages/${message.id}?type=${message.type}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not delete the message.');
      setMessages(current => current.filter(item => item.id !== message.id));
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete the message.');
    } finally {
      setBusyId('');
    }
  };

  if (checkingAuth || (isAuthenticated && !user)) {
    return <main className="admin-state">Checking your access...</main>;
  }

  if (isAuthenticated && user?.role !== 'admin') {
    return (
      <main className="admin-state">
        <FiInbox size={34} />
        <h1>Admin access only</h1>
        <p>This account cannot view portfolio messages.</p>
        <button type="button" onClick={() => { signOut(); navigate('/signin'); }}>Sign in with admin account</button>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <div className="section-eyebrow">Private Workspace</div>
          <h1>Message Admin</h1>
          <p>Review contact requests and project inquiries from one place.</p>
        </div>
        <div className="admin-header-actions">
          {storage && <span className="admin-storage">{storage === 'supabase' ? 'Supabase connected' : `${storage} fallback`}</span>}
          <button type="button" className="admin-icon-button" onClick={loadMessages} disabled={loading} title="Refresh messages" aria-label="Refresh messages">
            <FiRefreshCw className={loading ? 'admin-spin' : ''} />
          </button>
        </div>
      </header>

      <section className="admin-stats" aria-label="Message summary">
        <div><FiInbox /><span>All messages</span><strong>{counts.total}</strong></div>
        <div><FiMail /><span>New</span><strong>{counts.new}</strong></div>
        <div><FiCheck /><span>Contact</span><strong>{counts.contact}</strong></div>
        <div><FiBriefcase /><span>Hire requests</span><strong>{counts.hire}</strong></div>
      </section>

      <section className="admin-controls" aria-label="Message filters">
        <div className="admin-search">
          <FiSearch />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email, or message" aria-label="Search messages" />
        </div>
        <div className="admin-segments" aria-label="Filter by status">
          {statusOptions.map(option => (
            <button type="button" key={option} className={status === option ? 'active' : ''} onClick={() => setStatus(option)}>{option}</button>
          ))}
        </div>
        <select value={type} onChange={event => setType(event.target.value)} aria-label="Filter by message type">
          {typeOptions.map(option => <option key={option} value={option}>{option === 'all' ? 'All types' : option}</option>)}
        </select>
      </section>

      {error && <div className="admin-alert">{error}</div>}

      <section className="admin-message-list" aria-live="polite">
        {loading ? (
          <div className="admin-empty">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="admin-empty"><FiInbox size={30} /><strong>No messages found</strong><span>Try another filter or check back later.</span></div>
        ) : filteredMessages.map(item => (
          <article className={`admin-message admin-message-${item.status}`} key={item.id}>
            <div className="admin-message-topline">
              <div className="admin-sender">
                <span className={`admin-type admin-type-${item.type}`}>{item.type === 'hire' ? <FiBriefcase /> : <FiMail />}{item.type}</span>
                <h2>{item.name}</h2>
                <a href={`mailto:${item.email}`}>{item.email}</a>
              </div>
              <div className="admin-message-meta">
                <span className={`admin-status admin-status-${item.status}`}>{item.status}</span>
                <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
              </div>
            </div>

            {(item.project_type || item.budget) && (
              <div className="admin-project-meta">
                {item.project_type && <span><strong>Project</strong>{item.project_type}</span>}
                {item.budget && <span><strong>Budget</strong>{item.budget}</span>}
              </div>
            )}

            <p className="admin-message-body">{item.message}</p>

            <div className="admin-message-actions">
              <a className="admin-reply" href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: Your ${item.type === 'hire' ? 'project inquiry' : 'message'} to Nawed Dev`)}`}>
                <FiMail /> Reply
              </a>
              {item.status !== 'read' && <button type="button" onClick={() => updateStatus(item, 'read')} disabled={busyId === item.id} title="Mark as read"><FiCheck /> Read</button>}
              {item.status !== 'archived' && <button type="button" onClick={() => updateStatus(item, 'archived')} disabled={busyId === item.id} title="Archive message"><FiArchive /> Archive</button>}
              <button type="button" className="admin-delete" onClick={() => deleteMessage(item)} disabled={busyId === item.id} title="Delete message"><FiTrash2 /><span>Delete</span></button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
