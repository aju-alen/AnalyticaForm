import axios from 'axios';

// Custom Axios instance with no headers or credentials
export const axiosNoHeaders = axios.create();

// Custom Axios instance with credentials enabled
export const axiosWithCredentials = axios.create({
  withCredentials: true,
});

// Custom Axios instance with Authorization header and credentials enabled
export const axiosWithAuth = axios.create({
  withCredentials: true,
});

// Add a request interceptor to attach the Authorization header
axiosWithAuth.interceptors.request.use(config => {
  // Add Authorization header if token is available in localStorage
  const token = JSON.parse(localStorage.getItem('userAccessToken'))?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage: Some api needs credentials(Bearer and cookies), some don't. This is where customAxios comes in handy.