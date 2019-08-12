import { loadFirmsApi, saveFirmApi, deleteFirmApi } from '../apis/firms';

export const loadFirms = async () => {
    try {
        return await loadFirmsApi();
    } catch (error) {
        console.log('Cannot load firms: error = ', error);
    }
};

export const saveFirm = async (data) => {
    try {
        return await saveFirmApi(data);
    } catch (error) {
        console.log('Cannot save firm: error = ', error);
    }
};

export const deleteFirm = async (id) => {
    try {
        return await deleteFirmApi(id);
    } catch (error) {
        console.log('Cannot delete firm: error = ', error);
    }
};
