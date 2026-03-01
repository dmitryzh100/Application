import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Typography } from '@/shared/components/ui/typography';

interface CalendarNavigationProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarNavigation = (props: CalendarNavigationProps): React.ReactElement => {
  const { title, onPrev, onNext } = props;

  return (
    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
      <Button variant="outline" size="icon" aria-label="Previous period" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Typography variant="h2" className="min-w-[160px] text-center text-base sm:text-xl">
        {title}
      </Typography>
      <Button variant="outline" size="icon" aria-label="Next period" onClick={onNext}>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
};
