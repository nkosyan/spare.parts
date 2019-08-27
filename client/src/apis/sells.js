import client from './client';

export const loadSellsApi = () => client().get('/api/sells');

export const createSellApi = data => client().post(`/api/sells/`, data);

export const deleteSellApi = id => client().delete(`/api/sells/${id}`);
