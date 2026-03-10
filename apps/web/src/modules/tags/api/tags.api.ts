import type { ApiResponse, TagBase } from '@event-management/shared';

import apiClient from '@/shared/config/client';
import { Api } from '@/shared/constants/api-routes.constants';

export const tagsApi = {
  getAll: async (): Promise<TagBase[]> => {
    const response = await apiClient.get<ApiResponse<TagBase[]>>(Api.tags.base);

    return response.data.data;
  },
};
