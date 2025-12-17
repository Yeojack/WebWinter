import { createContext, useState, useEffect } from 'react';

import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [user, setUser] = useState(null); // { id, email, name, role }
  const [token, setToken] = useState(storedToken);
  const [loading, setLoading] = useState(true); // 처음 앱 로딩 중

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = { user, token, login, logout, loading };


useEffect(() => {
  if (!token) {
    setLoading(false);
    return;
  }
  axios
    .get('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch(() => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    })
    .finally(() => setLoading(false));
}, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}