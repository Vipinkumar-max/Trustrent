import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://trustrent-backend-ozhd.onrender.com/api';

let cachedToken = null;
let cachedUser = null;

const isWeb = Platform.OS === 'web';

export const getToken = () => {
  try {
    if (isWeb && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return cachedToken;
  } catch (e) {
    return cachedToken;
  }
};

export const setToken = (token) => {
  try {
    cachedToken = token;

    if (isWeb && typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    } else {
      AsyncStorage.setItem('token', token);
    }
  } catch (e) {
    console.log('Token save error:', e);
  }
};

export const getUser = () => {
  try {
    if (isWeb && typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }

    return cachedUser;
  } catch (e) {
    return cachedUser;
  }
};

export const setUser = (user) => {
  try {
    cachedUser = user;

    if (isWeb && typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.setItem('user', JSON.stringify(user));
    }
  } catch (e) {
    console.log('User save error:', e);
  }
};

export const removeAuth = () => {
  try {
    cachedToken = null;
    cachedUser = null;

    if (isWeb && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    }
  } catch (e) {
    console.log('Logout error:', e);
  }
};

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

export const getListings = (params) => api.get('/listings', { params });
export const getListing = (id) => api.get(`/listings/${id}`);
export const createListing = (data) => api.post('/listings', data);
export const getMyListings = () => api.get('/listings/my/listings');
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);

export const createRental = (data) => api.post('/rentals', data);
export const getMyRentals = () => api.get('/rentals/my');
export const getLandlordRentals = () => api.get('/rentals/landlord');
export const updateRentalStatus = (id, status) =>
  api.put(`/rentals/${id}/status`, { status });

export default api;