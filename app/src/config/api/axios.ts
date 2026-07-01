import axios from 'axios'
import { getAuthStoreState } from '@/stores/auth'
import { isTokenExpired } from '@/lib/token';
import { environments } from '@/config/environments';
import { ApiRoutes } from '@/config/api/routes';

const axiosInstance = axios.create({
    baseURL: environments.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const is_public_auth_request = (url?: string) => {
    if (!url) return false;

    const public_paths = [
        ApiRoutes.auth.email.login,
        ApiRoutes.auth.email.register,
        ApiRoutes.auth.email.forgot_password,
        ApiRoutes.auth.email.reset_password,
    ];

    return public_paths.some((path) => url.includes(path));
};

axiosInstance.interceptors.request.use((config) => {
    const authState = getAuthStoreState();

    if (authState?.expires_in && isTokenExpired(authState.expires_in)) {
        authState.logout();
        return Promise.reject(new Error('Token expired'));
    }

    if (authState.access_token) {
        config.headers.Authorization = `Bearer ${authState.access_token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const request_url = error?.config?.url as string | undefined;

        if (status === 401 && !is_public_auth_request(request_url)) {
            const authState = getAuthStoreState();
            if (authState.isLoggedIn) {
                authState.logout();
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance