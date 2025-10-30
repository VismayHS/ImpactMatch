import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMatches = async (userId) => {
  const response = await api.post('/api/match', { userId });
  return response.data;
};

export const joinCause = async (userId, causeId) => {
  const response = await api.post('/api/match/join', { userId, causeId });
  return response.data;
};

export const getDashboard = async (userId) => {
  const response = await api.get(`/api/dashboard?userId=${userId}`);
  return response.data;
};

export const getMapData = async (userId) => {
  const response = await api.get(`/api/dashboard/map?userId=${userId}`);
  return response.data;
};

export const chatSuggest = async (query) => {
  const response = await api.post('/api/chat/suggest', { query });
  return response.data;
};
