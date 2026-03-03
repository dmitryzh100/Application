import { Suspense, useCallback, useDeferredValue, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { Typography } from '@/shared/components/ui/typography';

import { EventGrid } from '../components/events/EventGrid';
import { EventsSearchBar } from '../components/events/EventsSearchBar';
import {
  eventKeys,
  useInfiniteEventsSuspense,
  usePrefetchNextEventsPage,
} from '../hooks/useEventsQueries';
import { useEventsStore } from '../stores/events.store';

const EventsContent = (props: { search: string; startPage: number }): React.ReactElement => {
  const { search, startPage } = props;
  const setStartPage = useEventsStore((s) => s.setStartPage);
  const queryClient = useQueryClient();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteEventsSuspense(
    search || undefined,
    startPage,
  );

  const pages = useMemo(
    () => data.pages.map((page) => ({ pageNumber: page.meta.page, events: page.data })),
    [data.pages],
  );

  const totalPages = data.pages[0]?.meta.totalPages ?? 1;

  const loadedPages = useMemo(() => data.pages.map((page) => page.meta.page), [data.pages]);

  usePrefetchNextEventsPage(search || undefined, data.pages, hasNextPage);

  const handlePageChange = useCallback(
    (page: number): void => {
      queryClient.removeQueries({ queryKey: eventKeys.list(search || undefined, startPage) });
      queryClient.removeQueries({ queryKey: eventKeys.list(search || undefined, page) });
      setStartPage(page);
    },
    [queryClient, search, startPage, setStartPage],
  );

  return (
    <EventGrid
      pages={pages}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      currentPage={startPage}
      totalPages={totalPages}
      loadedPages={loadedPages}
      onPageChange={handlePageChange}
    />
  );
};

export const EventsPage = (): React.ReactElement => {
  const { search, setSearch, startPage } = useEventsStore();
  const deferredSearch = useDeferredValue(search);

  return (
    <div className="flex flex-col gap-4 lg:min-h-0 lg:flex-1">
      <title>Events - Event Management</title>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h1">Events</Typography>
        <div className="w-full sm:w-72">
          <EventsSearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <EventsContent search={deferredSearch} startPage={startPage} />
      </Suspense>
    </div>
  );
};
