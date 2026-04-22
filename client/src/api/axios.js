import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ direct backend URL (no proxy issue)
});

// ✅ Request interceptor (token add)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rtoToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('rtoToken');
      localStorage.removeItem('rtoUser');
      window.location.href = '/login';
    }

    // 🔥 Server not reachable
    if (!error.response) {
      console.error('Server not responding');
    }

    return Promise.reject(error);
  }
);

export default api;