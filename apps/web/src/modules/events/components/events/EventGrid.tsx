import { Fragment, useEffect, useRef } from 'react';

import type { EventWithDetails } from '@event-management/shared';

import { EventCard } from './EventCard';
import { EventsEmptyState } from './EventsEmptyState';
import { EventsPaginationControls } from './EventsPaginationControls';

interface PageData {
  pageNumber: number;
  events: EventWithDetails[];
}

interface EventGridProps {
  pages: PageData[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  currentPage: number;
  totalPages: number;
  loadedPages: number[];
  onPageChange: (page: number) => void;
}

export const EventGrid = (props: EventGridProps): React.ReactElement => {
  const {
    pages,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    currentPage,
    totalPages,
    loadedPages,
    onPageChange,
  } = props;

  const shouldScrollRef = useRef(false);
  const prevPageCountRef = useRef(pages.length);

  useEffect(() => {
    if (shouldScrollRef.current && pages.length > prevPageCountRef.current) {
      const lastPage = pages[pages.length - 1];

      if (lastPage) {
        const el = document.getElementById(`events-page-${lastPage.pageNumber}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      shouldScrollRef.current = false;
    }

    prevPageCountRef.current = pages.length;
  }, [pages]);

  const handleLoadMore = (): void => {
    shouldScrollRef.current = true;
    onLoadMore();
  };

  const allEvents = pages.flatMap((p) => p.events);

  if (!allEvents.length) {
    return <EventsEmptyState />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, pageIndex) => (
          <Fragment key={page.pageNumber}>
            {pageIndex > 0 && (
              <div id={`events-page-${page.pageNumber}`} className="col-span-full scroll-mt-20" />
            )}
            {page.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Fragment>
        ))}
      </div>

      <EventsPaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        loadedPages={loadedPages}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};
