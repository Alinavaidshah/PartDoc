import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL, // Yahan baseURL mein API_URL daalna zaroori hai!
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