import client from './client';

export const loadProductsApi = () => client().get('/api/products');

export const saveProductApi = ({ _id, ...data }) => client().put(`/api/products/${_id}`, data);

export const deleteProductApi = id => client().delete(`/api/products/${id}`);
