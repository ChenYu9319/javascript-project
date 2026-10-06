import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('libhub_token');
        const user = JSON.parse(localStorage.getItem('libhub_user') || '{}');
        const authToken = token || user.token;

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;