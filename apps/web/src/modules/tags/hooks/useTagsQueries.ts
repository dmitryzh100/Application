import { useSuspenseQuery } from '@tanstack/react-query';

import type { TagBase } from '@event-management/shared';

import { tagsApi } from '../api/tags.api';

export const tagKeys = {
  all: ['tags'] as const,
};

export function useTagsSuspense(): ReturnType<typeof useSuspenseQuery<TagBase[], Error>> {
  return useSuspenseQuery<TagBase[], Error>({
    queryKey: tagKeys.all,
    queryFn: () => tagsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}
