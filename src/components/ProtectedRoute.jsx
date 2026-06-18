import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { checkingAuth, isAuthenticated } = useAuth();
  const location = useLocation();

  if (checkingAuth) {
    return (
      <section style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--off-white)' }}>
        <div style={{ color: 'var(--gray-600)', fontWeight: 600 }}>Checking your session...</div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}
