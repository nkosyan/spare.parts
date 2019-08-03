import client from './client';

export const createFirmApi = data => client().post('/api/firms', data);

export const loadFirmsApi = data => client().get('/api/firms', data);