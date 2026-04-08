import axios from 'axios';

const api = axios.create({
  baseURL: 'https://poster-generator-nosy.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
