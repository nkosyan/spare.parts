import axios from 'axios';

import { API_ROOT } from '../config/env-vars';

export default (headers = {}) => {
    const service = axios.create({
        baseURL: API_ROOT,
        headers: {
            // Authorization: getAccessToken(),
            ...headers,
        },
    });
    // service.interceptors.response.use(
    //     response => response,
    //     (error) => {
    //         const errorResponse = error.response;
    //         if (process.env.NODE_ENV === 'production') {
    //             switch (errorResponse.status) {
    //                 case 404:
    //                     window.location.pathname = '/not-found';
    //                     break;
    //                 case 403:
    //                     window.location.pathname = '/not-permitted';
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //         if (errorResponse.status === 401) {
    //             localStorage.clear();
    //             window.location.pathname = '/sign-in';
    //         }
    //         throw error;
    //     },
    // );
    return service;
};
