import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Using a public mock API for demonstration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT (commented out for now)
api.interceptors.request.use(
  (config: any) => {
    // const token = localStorage.getItem('jwtToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
      // Redirect to login page or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;
