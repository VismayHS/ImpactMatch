import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const verifyMatch = async (matchId, verifierId) => {
  const response = await api.post('/api/verify', { matchId, verifierId });
  return response.data;
};

export const getUnverifiedMatches = async (userId) => {
  const response = await api.get(`/api/verify/pending?userId=${userId}`);
  return response.data;
};
