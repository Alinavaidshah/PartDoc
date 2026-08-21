import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_URL}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
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

export default api;