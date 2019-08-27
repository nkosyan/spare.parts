import client from './client';

export const loadFirmsApi = () => client().get('/api/firms');

export const saveFirmApi = ({ _id, ...data }) => client().put(`/api/firms/${_id}`, data);

export const deleteFirmApi = ({ id }) => console.log(id, 'api') || client().delete(`/api/firms/${id}`);
