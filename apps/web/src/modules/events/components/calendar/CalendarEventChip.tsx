import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';

import type { EventWithDetails } from '@event-management/shared';

import { getCalendarChipClasses } from '@/modules/tags';
import { Routes } from '@/shared/constants/routes.constants';

interface EventChipProps {
  event: EventWithDetails;
}

export const CalendarEventChip = (props: EventChipProps): React.ReactElement => {
  const { event } = props;
  const navigate = useNavigate();

  const firstTagName = event.tags?.[0]?.name;
  const chipClasses = getCalendarChipClasses(firstTagName);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(Routes.eventDetails(event.id), { state: { from: 'my-events' } });
      }}
      className={`${chipClasses} w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium transition-colors`}
      aria-label={`${event.title} at ${format(new Date(event.dateTime), 'h:mm a')}`}
    >
      <span className="font-semibold">{format(new Date(event.dateTime), 'h:mm')}</span>{' '}
      {event.title}
    </button>
  );
};
