import { loadFirmsApi } from '../services/firms';

export const requestFirms = async (data) => {
    try {
        return await loadFirmsApi(data);
    } catch (error) {
        console.log('Cannot load firms: error = ', error);
    }
};