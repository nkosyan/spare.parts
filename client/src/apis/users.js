import client from './client';

export const loginUserApi = data => client().post('/api/login', data);
