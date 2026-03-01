import { Suspense, useCallback, useEffect } from 'react';

import { startOfWeek } from 'date-fns';

import { ViewMode } from '@event-management/shared';

import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { Typography } from '@/shared/components/ui/typography';

import { CalendarHeader } from '../../components/calendar/CalendarHeader';
import { useCalendarStore } from '../../stores/calendar.store';
import { MyEventsContent } from './MyEventsContent';

export const MyEventsPage = (): React.ReactElement => {
  const {
    currentMonth,
    currentYear,
    viewMode,
    selectedWeekStart,
    prevMonth,
    nextMonth,
    prevWeek,
    nextWeek,
    setViewMode,
    setSelectedWeekStart,
  } = useCalendarStore();

  useEffect(() => {
    if (!selectedWeekStart) {
      setSelectedWeekStart(startOfWeek(new Date()));
    }
  }, [selectedWeekStart, setSelectedWeekStart]);

  const handlePrev = useCallback((): void => {
    if (viewMode === ViewMode.WEEK) {
      prevWeek();
    } else {
      prevMonth();
    }
  }, [viewMode, prevWeek, prevMonth]);

  const handleNext = useCallback((): void => {
    if (viewMode === ViewMode.WEEK) {
      nextWeek();
    } else {
      nextMonth();
    }
  }, [viewMode, nextWeek, nextMonth]);

  return (
    <div className="space-y-6">
      <title>My Events - Event Management</title>

      <div className="flex items-center justify-between">
        <Typography variant="h1">My Events</Typography>
      </div>

      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        viewMode={viewMode}
        selectedWeekStart={selectedWeekStart}
        onPrev={handlePrev}
        onNext={handleNext}
        onViewModeChange={setViewMode}
      />

      <Suspense fallback={<LoadingSpinner />}>
        <MyEventsContent />
      </Suspense>
    </div>
  );
};
