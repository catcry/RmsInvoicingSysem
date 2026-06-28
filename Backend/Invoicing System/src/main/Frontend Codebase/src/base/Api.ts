import axios from 'axios';

const api = axios.create({
    baseURL: '/',
});

api.interceptors.request.use(
    config => {
        const token: string | null = sessionStorage.getItem('jwtToken');
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
    error => {
        if (
            !api.getUri().includes('/login') &&
            error.response &&
            error.response.status === 401
        ) {
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/login'; // adjust to your login route
        }
        return Promise.reject(new Error('Authentication Failed: ' + error.toString()));
    }
);

export default api;