import axios from 'axios';
import { getToken, logout } from './KeycloakService';

const api = axios.create({
    baseURL: '/',
    //baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    async config => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(new Error('Something went wrong' + error.toString()));
    }
);

api.interceptors.response.use(
    response => response,
    async error => {
        if (
            error.response &&
            error.response.status === 401
        ) {
            await logout();
        }
        return Promise.reject(new Error('Authentication Failed: ' + error.toString()));
    }
);

export default api;
