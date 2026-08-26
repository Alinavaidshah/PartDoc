import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'https://part-doc-five.vercel.app').replace(/\/$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${path}`;
};

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add a request interceptor to attach Admin Auth Token if present
api.interceptors.request.use(
  (config) => {
    const adminInfoStr = localStorage.getItem('adminInfo');
    if (adminInfoStr) {
      try {
        const adminInfo = JSON.parse(adminInfoStr);
        if (adminInfo && adminInfo.token) {
          config.headers.Authorization = `Bearer ${adminInfo.token}`;
        }
      } catch (error) {
        console.error('Error parsing adminInfo token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request (401) - Clearing admin session');
      localStorage.removeItem('adminInfo');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;