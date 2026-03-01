import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from './button';

type PageItem = number | 'ellipsis';

function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [1];

  if (current > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('ellipsis');
  }

  pages.push(total);

  return pages;
}

function getPageVariant(
  page: number,
  currentPage: number,
  loadedPages: number[],
): 'default' | 'outline' | 'ghost' {
  if (page === currentPage) {
    return 'default';
  }

  if (loadedPages.includes(page)) {
    return 'outline';
  }

  return 'ghost';
}

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  loadedPages: number[];
  onPageChange: (page: number) => void;
}

export const PaginationBar = (props: PaginationBarProps): React.ReactElement | null => {
  const { currentPage, totalPages, loadedPages, onPageChange } = props;

  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1 md:justify-start"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <Button key={`ellipsis-${index}`} variant="ghost" size="icon" disabled aria-hidden>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={getPageVariant(page, currentPage, loadedPages)}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
