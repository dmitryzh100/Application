import type {
  ApiResponse,
  CreateEventRequest,
  EventWithDetails,
  PaginatedResponse,
  UpdateEventRequest,
} from '@event-management/shared';

import apiClient from '@/shared/config/client';
import { Api } from '@/shared/constants/api-routes.constants';

interface GetAllParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const eventsApi = {
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<EventWithDetails>> => {
    const queryParams: Record<string, string | number> = {};

    if (params.search) queryParams.search = params.search;
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;

    const response = await apiClient.get<ApiResponse<PaginatedResponse<EventWithDetails>>>(
      Api.events.base,
      { params: queryParams },
    );

    return response.data.data;
  },

  getById: async (id: string): Promise<EventWithDetails> => {
    const response = await apiClient.get<ApiResponse<EventWithDetails>>(Api.events.byId(id));

    return response.data.data;
  },

  create: async (data: CreateEventRequest): Promise<EventWithDetails> => {
    const response = await apiClient.post<ApiResponse<EventWithDetails>>(Api.events.base, data);

    return response.data.data;
  },

  update: async (id: string, data: UpdateEventRequest): Promise<EventWithDetails> => {
    const response = await apiClient.patch<ApiResponse<EventWithDetails>>(
      Api.events.byId(id),
      data,
    );

    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(Api.events.byId(id));
  },

  join: async (id: string): Promise<EventWithDetails> => {
    const response = await apiClient.post<ApiResponse<EventWithDetails>>(Api.events.join(id));

    return response.data.data;
  },

  leave: async (id: string): Promise<EventWithDetails> => {
    const response = await apiClient.post<ApiResponse<EventWithDetails>>(Api.events.leave(id));

    return response.data.data;
  },

  getMyEvents: async (month?: number, year?: number): Promise<EventWithDetails[]> => {
    const params: Record<string, number> = {};

    if (month) params.month = month;
    if (year) params.year = year;

    const response = await apiClient.get<ApiResponse<EventWithDetails[]>>(Api.users.myEvents, {
      params,
    });

    return response.data.data;
  },
};
