import { loadFirmsApi, saveFirmApi, deleteFirmApi } from '../apis/firms';
import { fetchEntity } from '../utils/helper-methods';

export const loadFirms = () => fetchEntity(loadFirmsApi);

export const saveFirm = params => fetchEntity(saveFirmApi, params);

export const deleteFirm = id => fetchEntity(deleteFirmApi, { id });
