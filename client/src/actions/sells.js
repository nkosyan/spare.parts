import { loadSellsApi, createSellApi, deleteSellApi } from '../apis/sells';

export const loadSells = async () => {
    try {
        return await loadSellsApi();
    } catch (error) {
        console.log('Cannot load sells: error = ', error);
    }
};

export const createSell = async (data) => {
    try {
        return await createSellApi(data);
    } catch (error) {
        console.log('Cannot save sell: error = ', error);
    }
};

export const deleteSell = async (id) => {
    try {
        return await deleteSellApi(id);
    } catch (error) {
        console.log('Cannot delete sell: error = ', error);
    }
};
