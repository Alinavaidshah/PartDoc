import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo')); // Parse karo
  
  // Check karo ke adminInfo aur token exist karte hain
  if (adminInfo && adminInfo.token) { 
    config.headers.Authorization = `Bearer ${adminInfo.token}`; 
  }
  return config;
});

export default api;