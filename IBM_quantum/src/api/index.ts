import { Api } from './Api';

export const api = new Api({
    baseURL: 'http://localhost:5173/api',
});

/*
import { Api } from './Api';



export const api = new Api({
    baseURL: '/api',
});

api.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
*/