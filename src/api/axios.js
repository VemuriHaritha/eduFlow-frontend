import axios from 'axios';

// If VITE_API_URL is set (e.g. your deployed Render backend), requests go
// straight there. If it's left empty, requests fall back to the relative
// "/api" path, which the Vite dev server proxies to localhost:5000 — so
// local development keeps working exactly as before with no env file needed.
const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('eduflow_token');
      localStorage.removeItem('eduflow_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
