import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://dev.codeleap.co.uk';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default api;