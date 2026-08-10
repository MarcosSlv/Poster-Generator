import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'https://poster-generator-nosy.onrender.com/api';

const api = axios.create({
  baseURL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
