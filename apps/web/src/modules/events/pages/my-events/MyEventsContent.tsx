import { CalendarView } from '../../components/calendar/CalendarView';
import { useMyEventsSuspense } from '../../hooks/useEventsQueries';
import { useCalendarStore } from '../../stores/calendar.store';

export const MyEventsContent = (): React.ReactElement => {
  const { currentMonth, currentYear, viewMode, selectedWeekStart } = useCalendarStore();
  const { data: events } = useMyEventsSuspense(currentMonth, currentYear);

  return (
    <CalendarView
      viewMode={viewMode}
      events={events}
      currentMonth={currentMonth}
      currentYear={currentYear}
      selectedWeekStart={selectedWeekStart}
    />
  );
};
