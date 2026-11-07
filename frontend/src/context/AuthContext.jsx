import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('antariksh_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('antariksh_token') || null);
  const [loading, setLoading] = useState(!!localStorage.getItem('antariksh_token'));

  useEffect(() => {
    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('antariksh_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem('antariksh_token');
          localStorage.removeItem('antariksh_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('antariksh_token', t);
    localStorage.setItem('antariksh_user', JSON.stringify(u));
    return u;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('antariksh_token', t);
    localStorage.setItem('antariksh_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('antariksh_token');
    localStorage.removeItem('antariksh_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


