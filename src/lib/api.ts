import axios, { type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8099', // Backend server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwtToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData: {
    email: string;
    fullName: string;
    password: string;
    gender: string;
    dob: string;
    phoneNumber?: string;
    address?: string;
  }) => api.post('/auth/register', userData),
  
  verifyRegisterOtp: (data: { email: string; otp: string }) => 
    api.post('/auth/verify-register-otp', data),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => 
    api.post('/auth/reset-password', data),
  
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  
  getProfile: () => 
    api.get('/auth/myInfo'),
  
  logout: () => {
    // Clear local storage and redirect
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  },
};

export default api;
