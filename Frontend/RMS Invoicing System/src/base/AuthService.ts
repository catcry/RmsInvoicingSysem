import api from './Api';
import {jwtDecode, JwtPayload} from 'jwt-decode';

// interface JwtPayload {
//     exp: number;
//     [key: string]: any;
// }


export const loginApi = async (username: string, password: string) => {
    try {
        const response = await api.post('/login', {username, password});
        let token = response.data.token;
        sessionStorage.setItem('jwtToken', token + '');
        if (sessionStorage.getItem('jwtToken')) return token;
        // return token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const isTokenExpired = () => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) return true;
    try {
        const {exp} = jwtDecode<JwtPayload>(token);
        if (!exp) return true;
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
};
export const logout = () => {
    sessionStorage.removeItem('jwtToken');
};