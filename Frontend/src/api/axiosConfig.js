import axios from 'axios';

// Debugging ke liye log add kiya
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log("Axios Base URL being used:", baseURL); 

const api = axios.create({ baseURL });

// Request Interceptor
api.interceptors.request.use((config) => {
  try {
    const adminInfo = localStorage.getItem('adminInfo');
    
    // Check agar data exist karta hai toh parse karo
    if (adminInfo) {
      const parsedInfo = JSON.parse(adminInfo);
      if (parsedInfo && parsedInfo.token) {
        config.headers.Authorization = `Bearer ${parsedInfo.token}`;
      }
    }
  } catch (error) {
    console.error("Error parsing localStorage adminInfo:", error);
  }
  return config;
});

export default api;