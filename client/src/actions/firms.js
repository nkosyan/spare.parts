import { loadFirmsApi, saveFirmApi, deleteFirmApi } from '../apis/firms';
import { fetchEntity } from '../utils/helper-methods';

export const loadFirms = params => fetchEntity(loadFirmsApi, params);

export const saveFirm = params => fetchEntity(saveFirmApi, params);

export const deleteFirm = id => fetchEntity(deleteFirmApi, { id });
