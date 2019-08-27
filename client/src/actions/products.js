import { loadProductsApi, saveProductApi, deleteProductApi } from '../apis/products';
import { fetchEntity } from '../utils/helper-methods';

export const loadProducts = () => fetchEntity(loadProductsApi);

export const saveProduct = params => fetchEntity(saveProductApi, params);

export const deleteProduct = id => fetchEntity(deleteProductApi, { id });
