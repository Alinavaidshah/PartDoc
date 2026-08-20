import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
