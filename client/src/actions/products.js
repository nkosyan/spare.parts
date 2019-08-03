import { loadProductsApi, saveProductApi, deleteProductApi } from '../apis/products';

export const loadProducts = async () => {
    try {
        return await loadProductsApi();
    } catch (error) {
        console.log('Cannot load firms: error = ', error);
    }
};

export const saveProduct = async (data) => {
    try {
        return await saveProductApi(data);
    } catch (error) {
        console.log('Cannot save firms: error = ', error);
    }
};

export const deleteProduct = async (id) => {
    try {
        return await deleteProductApi(id);
    } catch (error) {
        console.log('Cannot delete firms: error = ', error);
    }
};
