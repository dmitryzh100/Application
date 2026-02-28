import { ViewMode } from '@event-management/shared';

import { Button } from '@/shared/components/ui/button';

interface CalendarViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const CalendarViewToggle = (props: CalendarViewToggleProps): React.ReactElement => {
  const { viewMode, onViewModeChange } = props;

  return (
    <div className="flex justify-center gap-1 rounded-lg border p-1 sm:justify-end">
      <Button
        variant={viewMode === ViewMode.MONTH ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange(ViewMode.MONTH)}
      >
        Month
      </Button>
      <Button
        variant={viewMode === ViewMode.WEEK ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange(ViewMode.WEEK)}
      >
        Week
      </Button>
    </div>
  );
};
