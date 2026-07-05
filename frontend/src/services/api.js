import axios from 'axios';

const BASE_URL = 'https://trustrent-backend-ozhd.onrender.com/api';

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (e) {}
};

export const setUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {}
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const removeAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {}
};

const api = axios.create({
  baseURL: BASE_URL
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

export const createRental = (data) => api.post('/rentals', data);
export const getMyRentals = () => api.get('/rentals/my');

export const getLandlordRentals = () => api.get('/rentals/landlord');

export const updateRentalStatus = (id, status) =>
  api.put(`/rentals/${id}/status`, { status });
export const getMyListings = () => api.get('/listings/my/listings');
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);

export default api;