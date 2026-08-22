import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('resumatch_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data && res.data.data) {
            setUser(res.data.data);
          }
        } catch (error) {
          console.warn('[Auth] Token verification failed, falling back to demo user state.');
          localStorage.removeItem('resumatch_token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('resumatch_token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Check server status.'
      };
    }
  };

  const register = async (name, email, password, targetRole) => {
    try {
      const res = await authAPI.register({ name, email, password, targetRole });
      const { token: newToken, ...userData } = res.data.data;
      localStorage.setItem('resumatch_token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('resumatch_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user || !!token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
