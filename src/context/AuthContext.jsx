import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext(null);
const TOKEN_KEY = 'nawed-dev-auth-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nawed-dev-user')) || null;
    } catch {
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(Boolean(token));

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error('Session expired');
        setUser(data.user);
        localStorage.setItem('nawed-dev-user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('nawed-dev-user');
        setToken(null);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, [token]);

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem('nawed-dev-user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('nawed-dev-user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    checkingAuth,
    isAuthenticated: Boolean(token && user),
    saveSession,
    signOut,
  }), [token, user, checkingAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
