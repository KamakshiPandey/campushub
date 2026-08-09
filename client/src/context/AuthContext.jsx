import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campushub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('campushub_token');
      if (token) {
        try {
          const res = await API.get('/auth/profile');
          setUser(res.data.user);
          localStorage.setItem('campushub_user', JSON.stringify(res.data.user));
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('campushub_token', token);
      localStorage.setItem('campushub_user', JSON.stringify(user));
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      toast.success(res.data.message || 'Registration successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('campushub_token');
    localStorage.removeItem('campushub_user');
    setUser(null);
    toast.success('Logged out successfully');
  };
  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Reset link sent to your email.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || 'Password reset successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed or link expired');
      return false;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(res.data.user);
      localStorage.setItem('campushub_user', JSON.stringify(res.data.user));
      toast.success('Profile updated!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile,forgotPassword,      // ✅ ADD THIS
    resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
