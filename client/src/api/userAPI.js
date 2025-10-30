import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, updates) => {
  const response = await api.put(`/api/users/${userId}`, updates);
  return response.data;
};
