import axios from 'axios';

import { Api } from '@/shared/constants/api-routes.constants';
import { Routes } from '@/shared/constants/routes.constants';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const AUTH_CHECK_PATHS = [Api.auth.me, Api.auth.login, Api.auth.register];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url as string | undefined;
    const isAuthCheck = requestPath && AUTH_CHECK_PATHS.some((path) => requestPath.includes(path));

    if (
      error.response?.status === 401 &&
      !isAuthCheck &&
      !window.location.pathname.startsWith(Routes.login) &&
      !window.location.pathname.startsWith(Routes.register)
    ) {
      window.location.href = Routes.login;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
