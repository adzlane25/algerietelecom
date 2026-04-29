import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('📡 محاولة تسجيل الدخول:', email);
      
      const response = await axios.post(`${API_URL}/login`, { 
        email: email.toLowerCase(), 
        password 
      });
      
      console.log('✅ رد الخادم:', response.data);
      
      if (response.data.token) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        toast.success(`مرحباً ${userData.name}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ خطأ:', error.response?.data);
      toast.error(error.response?.data?.message || 'بيانات الدخول غير صحيحة');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('تم تسجيل الخروج');
  };

  const api = {
    get: async (url) => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    },
    post: async (url, data) => {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}${url}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    },
    put: async (url, data) => {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}${url}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    },
    delete: async (url) => {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response;
    },
    defaults: { baseURL: API_URL }
  };

  const isAdmin = () => user?.role === 'admin' || user?.role === 'nazim';
  const isCompany = () => user?.role === 'company';
  const isTechnician = () => user?.role === 'technician';

  const value = { 
    user, 
    login, 
    logout, 
    api, 
    loading, 
    isAdmin, 
    isCompany, 
    isTechnician 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};