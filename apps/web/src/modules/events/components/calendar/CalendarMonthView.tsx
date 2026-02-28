import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { EventWithDetails } from '@event-management/shared';

import { WEEKDAY_LABELS } from '../../constants/labels.constants';
import { CalendarEventChip } from './CalendarEventChip';

interface MonthViewProps {
  currentMonth: number;
  currentYear: number;
  events: EventWithDetails[];
}

export const CalendarMonthView = (props: MonthViewProps): React.ReactElement => {
  const { currentMonth, currentYear, events } = props;

  const monthDate = new Date(currentYear, currentMonth - 1, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date): EventWithDetails[] => {
    return events.filter((event) => isSameDay(new Date(event.dateTime), day));
  };

  return (
    <div>
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-muted-foreground p-2 text-center text-sm font-medium">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] border-b border-r p-1 ${
                !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''
              }`}
            >
              <div
                className={`mb-1 flex h-7 w-7 items-center justify-center text-sm ${
                  today ? 'bg-primary text-primary-foreground rounded-full font-bold' : ''
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="max-h-[76px] space-y-0.5 overflow-y-auto">
                {dayEvents.map((event) => (
                  <CalendarEventChip key={event.id} event={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
