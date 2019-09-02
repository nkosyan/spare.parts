import client from './client';

export const loadFirmsApi = params => client().get('/api/firms', { params });

export const saveFirmApi = ({ _id, ...data }) => client().put(`/api/firms/${_id}`, data);

export const deleteFirmApi = ({ id }) => console.log(id, 'api') || client().delete(`/api/firms/${id}`);
