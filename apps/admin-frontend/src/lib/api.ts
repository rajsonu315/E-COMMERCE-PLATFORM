import axios from 'axios';
import Cookies from 'js-cookie';

export const authApi = axios.create({
  baseURL: 'http://localhost:3001/api/v1/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = axios.create({
  baseURL: 'http://localhost:3003/api/v1/products',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = axios.create({
  baseURL: 'http://localhost:3001/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderApi = axios.create({
  baseURL: 'http://localhost:3005/api/v1/orders',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionApi = axios.create({
  baseURL: 'http://localhost:3006/api/v1/payments',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
const addTokenInterceptor = (config: any) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addTokenInterceptor);
productApi.interceptors.request.use(addTokenInterceptor);
userApi.interceptors.request.use(addTokenInterceptor);
orderApi.interceptors.request.use(addTokenInterceptor);
transactionApi.interceptors.request.use(addTokenInterceptor);
