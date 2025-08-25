import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8099', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT (commented out for now)
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      localStorage.removeItem('jwtToken');
      window.location.href = '/login'; // Assuming '/login' is your login route
    }
    return Promise.reject(error);
  }
);

export default api;
