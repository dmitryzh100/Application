import { format } from 'date-fns';

import { ViewMode } from '@event-management/shared';

import { formatWeekRange } from '../../utils/calendar.utils';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarViewToggle } from './CalendarViewToggle';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  viewMode: ViewMode;
  selectedWeekStart: Date | null;
  onPrev: () => void;
  onNext: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export const CalendarHeader = (props: CalendarHeaderProps): React.ReactElement => {
  const {
    currentMonth,
    currentYear,
    viewMode,
    selectedWeekStart,
    onPrev,
    onNext,
    onViewModeChange,
  } = props;

  const title =
    viewMode === ViewMode.WEEK && selectedWeekStart
      ? formatWeekRange(selectedWeekStart)
      : format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <CalendarNavigation title={title} onPrev={onPrev} onNext={onNext} />
      <CalendarViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
};
