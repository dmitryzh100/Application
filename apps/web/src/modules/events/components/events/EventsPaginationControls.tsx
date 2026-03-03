import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { PaginationBar } from '@/shared/components/ui/pagination';

interface EventsPaginationControlsProps {
  currentPage: number;
  totalPages: number;
  loadedPages: number[];
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export const EventsPaginationControls = (
  props: EventsPaginationControlsProps,
): React.ReactElement => {
  const {
    currentPage,
    totalPages,
    loadedPages,
    onPageChange,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  } = props;

  return (
    <div className="mt-3 flex flex-col items-center gap-4 md:relative md:flex-row md:items-center">
      <div className="order-2 md:order-1">
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          loadedPages={loadedPages}
          onPageChange={onPageChange}
        />
      </div>

      <div className="pointer-events-none order-1 flex md:absolute md:inset-x-0 md:order-2 md:justify-center">
        {isFetchingNextPage && <LoadingSpinner />}

        {hasNextPage && !isFetchingNextPage && (
          <Button className="pointer-events-auto" variant="outline" onClick={onLoadMore}>
            Show more
          </Button>
        )}
      </div>
    </div>
  );
};
