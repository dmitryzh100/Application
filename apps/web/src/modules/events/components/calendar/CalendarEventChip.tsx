import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';

import type { EventWithDetails } from '@event-management/shared';

import { Routes } from '@/shared/constants/routes.constants';

interface EventChipProps {
  event: EventWithDetails;
}

export const CalendarEventChip = (props: EventChipProps): React.ReactElement => {
  const { event } = props;
  const navigate = useNavigate();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(Routes.eventDetails(event.id), { state: { from: 'my-events' } });
      }}
      className="bg-primary/90 text-primary-foreground hover:bg-primary w-full truncate rounded px-1.5 py-0.5 text-left text-xs transition-colors"
      aria-label={`${event.title} at ${format(new Date(event.dateTime), 'h:mm a')}`}
    >
      <span className="font-medium">{format(new Date(event.dateTime), 'h:mm')}</span> {event.title}
    </button>
  );
};
