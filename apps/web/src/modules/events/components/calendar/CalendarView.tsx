import { startOfWeek } from 'date-fns';

import { ViewMode, type EventWithDetails } from '@event-management/shared';

import { CalendarEmptyView } from './CalendarEmptyView';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';

interface CalendarViewProps {
  viewMode: ViewMode;
  events: EventWithDetails[];
  currentMonth: number;
  currentYear: number;
  selectedWeekStart: Date | null;
}

export const CalendarView = (props: CalendarViewProps): React.ReactElement => {
  const { viewMode, events, currentMonth, currentYear, selectedWeekStart } = props;

  if (!events.length) {
    return <CalendarEmptyView />;
  }

  if (viewMode === ViewMode.MONTH) {
    return (
      <CalendarMonthView currentMonth={currentMonth} currentYear={currentYear} events={events} />
    );
  }

  return (
    <CalendarWeekView weekStart={selectedWeekStart || startOfWeek(new Date())} events={events} />
  );
};
