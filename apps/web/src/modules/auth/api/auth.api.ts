import type {
  ApiResponse,
  AuthResponse,
  UserLoginRequest,
  UserRegisterRequest,
} from '@event-management/shared';

import apiClient from '@/shared/config/client';
import { Api } from '@/shared/constants/api-routes.constants';

export const authApi = {
  login: async (data: UserLoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(Api.auth.login, data);

    return response.data.data;
  },

  register: async (data: UserRegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(Api.auth.register, data);

    return response.data.data;
  },

  me: async (): Promise<AuthResponse | null> => {
    const response = await apiClient.get<ApiResponse<AuthResponse>>(Api.auth.me);

    if (!response.data.data.user) {
      return null;
    }

    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(Api.auth.logout);
  },
};
