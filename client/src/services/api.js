import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors globally — clear bad token & redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || '';

        // JWT invalid/expired or unauthorized
        const isAuthError =
            status === 401 ||
            (status === 500 && (
                message.toLowerCase().includes('invalid signature') ||
                message.toLowerCase().includes('jwt') ||
                message.toLowerCase().includes('token')
            ));

        if (isAuthError) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default API;