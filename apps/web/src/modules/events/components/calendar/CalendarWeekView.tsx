import { eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek } from 'date-fns';

import type { EventWithDetails } from '@event-management/shared';

import { WEEKDAY_LABELS } from '../../constants/labels.constants';
import { CalendarEventChip } from './CalendarEventChip';

interface WeekViewProps {
  weekStart: Date;
  events: EventWithDetails[];
}

export const CalendarWeekView = (props: WeekViewProps): React.ReactElement => {
  const { weekStart, events } = props;

  const weekEnd = endOfWeek(startOfWeek(weekStart));
  const days = eachDayOfInterval({ start: startOfWeek(weekStart), end: weekEnd });

  const getEventsForDay = (day: Date): EventWithDetails[] => {
    return events
      .filter((event) => isSameDay(new Date(event.dateTime), day))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  return (
    <div>
      {/* Desktop: horizontal 7-column grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 border-b">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={label} className="p-2 text-center">
              <div className="text-muted-foreground text-sm font-medium">{label}</div>
              <div
                className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center text-sm ${
                  isToday(days[i])
                    ? 'bg-primary text-primary-foreground rounded-full font-bold'
                    : ''
                }`}
              >
                {format(days[i], 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-l">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);

            return (
              <div key={day.toISOString()} className="min-h-[220px] border-b border-r p-1">
                <div className="max-h-[210px] space-y-0.5 overflow-y-auto">
                  {dayEvents.map((event) => (
                    <CalendarEventChip key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical day list */}
      <div className="flex flex-col border md:hidden">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);

          return (
            <div key={day.toISOString()} className="border-b px-3 py-2">
              <div className="mb-1.5 flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center text-sm ${
                    today ? 'bg-primary text-primary-foreground rounded-full font-bold' : ''
                  }`}
                >
                  {format(day, 'd')}
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {WEEKDAY_LABELS[i]}, {format(day, 'MMM d')}
                </span>
              </div>

              {dayEvents.length > 0 ? (
                <div className="space-y-1 pl-10">
                  {dayEvents.map((event) => (
                    <CalendarEventChip key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground pl-10 text-xs">No events</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
