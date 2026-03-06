import { useEffect } from 'react';

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import type {
  CreateEventRequest,
  EventWithDetails,
  PaginatedResponse,
  UpdateEventRequest,
} from '@event-management/shared';

import { eventsApi } from '../api/events.api';

export const eventKeys = {
  all: ['events'] as const,
  list: (search?: string, startPage?: number, tagIds?: string[]) =>
    [...eventKeys.all, { search, startPage, tagIds }] as const,
  page: (search?: string, page?: number, tagIds?: string[]) =>
    [...eventKeys.all, 'page', { search, page, tagIds }] as const,
  detail: (id: string) => [...eventKeys.all, id] as const,
  my: (month: number, year: number) => ['my-events', { month, year }] as const,
};

export function useEvents(search?: string): ReturnType<typeof useQuery<EventWithDetails[], Error>> {
  return useQuery<EventWithDetails[], Error>({
    queryKey: eventKeys.list(search),
    queryFn: async () => {
      const result = await eventsApi.getAll({ search });

      return result.data;
    },
  });
}

export function useEvent(
  id: string | undefined,
): ReturnType<typeof useQuery<EventWithDetails, Error>> {
  return useQuery<EventWithDetails, Error>({
    queryKey: eventKeys.detail(id ?? ''),
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });
}

export function useEventsSuspense(
  search?: string,
): ReturnType<typeof useSuspenseQuery<EventWithDetails[], Error>> {
  return useSuspenseQuery<EventWithDetails[], Error>({
    queryKey: eventKeys.list(search),
    queryFn: async () => {
      const result = await eventsApi.getAll({ search });

      return result.data;
    },
  });
}

export function useEventSuspense(
  id: string,
): ReturnType<typeof useSuspenseQuery<EventWithDetails, Error>> {
  return useSuspenseQuery<EventWithDetails, Error>({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
  });
}

export function useInfiniteEventsSuspense(
  search?: string,
  startPage: number = 1,
  tagIds?: string[],
): ReturnType<typeof useSuspenseInfiniteQuery<PaginatedResponse<EventWithDetails>, Error>> {
  const queryClient = useQueryClient();

  return useSuspenseInfiniteQuery<PaginatedResponse<EventWithDetails>, Error>({
    queryKey: eventKeys.list(search, startPage, tagIds),
    queryFn: async ({ pageParam }) => {
      const pageNumber = pageParam as number;
      const prefetched = queryClient.getQueryData<PaginatedResponse<EventWithDetails>>(
        eventKeys.page(search, pageNumber, tagIds),
      );

      if (prefetched) {
        queryClient.removeQueries({ queryKey: eventKeys.page(search, pageNumber, tagIds) });

        return prefetched;
      }

      return eventsApi.getAll({ search, page: pageNumber, tagIds });
    },
    initialPageParam: startPage,
    getNextPageParam: (lastPage) => (lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined),
  });
}

export function usePrefetchNextEventsPage(
  search: string | undefined,
  pages: PaginatedResponse<EventWithDetails>[],
  hasNextPage: boolean,
  tagIds?: string[],
): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasNextPage || pages.length === 0) {
      return;
    }

    const lastPage = pages[pages.length - 1];
    const nextPage = lastPage.meta.page + 1;

    queryClient.prefetchQuery({
      queryKey: eventKeys.page(search, nextPage, tagIds),
      queryFn: () => eventsApi.getAll({ search, page: nextPage, tagIds }),
    });
  }, [queryClient, search, pages, hasNextPage, tagIds]);
}

export function useMyEvents(
  month: number,
  year: number,
): ReturnType<typeof useQuery<EventWithDetails[], Error>> {
  return useQuery<EventWithDetails[], Error>({
    queryKey: eventKeys.my(month, year),
    queryFn: () => eventsApi.getMyEvents(month, year),
  });
}

export function useMyEventsSuspense(
  month: number,
  year: number,
): ReturnType<typeof useSuspenseQuery<EventWithDetails[], Error>> {
  return useSuspenseQuery<EventWithDetails[], Error>({
    queryKey: eventKeys.my(month, year),
    queryFn: () => eventsApi.getMyEvents(month, year),
  });
}

export function useCreateEvent(): ReturnType<
  typeof useMutation<EventWithDetails, Error, CreateEventRequest>
> {
  const queryClient = useQueryClient();

  return useMutation<EventWithDetails, Error, CreateEventRequest>({
    mutationFn: (data) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useUpdateEvent(): ReturnType<
  typeof useMutation<EventWithDetails, Error, { id: string; data: UpdateEventRequest }>
> {
  const queryClient = useQueryClient();

  return useMutation<EventWithDetails, Error, { id: string; data: UpdateEventRequest }>({
    mutationFn: ({ id, data }) => eventsApi.update(id, data),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useDeleteEvent(): ReturnType<typeof useMutation<void, Error, string>> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useJoinEvent(): ReturnType<typeof useMutation<EventWithDetails, Error, string>> {
  const queryClient = useQueryClient();

  return useMutation<EventWithDetails, Error, string>({
    mutationFn: (id) => eventsApi.join(id),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useLeaveEvent(): ReturnType<typeof useMutation<EventWithDetails, Error, string>> {
  const queryClient = useQueryClient();

  return useMutation<EventWithDetails, Error, string>({
    mutationFn: (id) => eventsApi.leave(id),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
