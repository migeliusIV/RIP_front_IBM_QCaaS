import { Api } from './Api';

export const api = new Api({
    baseURL: 'https://localhost:5173/',
    securityWorker: () => {
    // ЧИТАЕМ ТОКЕН ИЗ localStorage ПРИ КАЖДОМ ВЫЗОВЕ (не при импорте!)
    const token = localStorage.getItem('authToken');
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`, // именно так — Bearer + пробел
        },
      };
    }
    return {}; // без токена — без заголовка
  },
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