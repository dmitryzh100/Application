import { useOptimistic } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import { CalendarDays, MapPin, Users } from 'lucide-react';

import type { EventWithDetails } from '@event-management/shared';

import { useAuthStore } from '@/modules/auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Typography } from '@/shared/components/ui/typography';
import { Routes } from '@/shared/constants/routes.constants';

import { ParticipantAction } from '../../enums/events.enum';
import { EventsJoinLeaveButton, type OptimisticAction } from './EventsJoinLeaveButton';

interface EventCardProps {
  event: EventWithDetails;
}

function applyOptimisticUpdate(
  current: EventWithDetails,
  action: OptimisticAction,
): EventWithDetails {
  if (action.type === ParticipantAction.Join) {
    return {
      ...current,
      participants: [
        ...current.participants,
        {
          id: action.userId,
          name: action.userName,
          email: action.userEmail,
          joinedAt: new Date().toISOString(),
        },
      ],
    };
  }

  return {
    ...current,
    participants: current.participants.filter((p) => p.id !== action.userId),
  };
}

export const EventCard = (props: EventCardProps): React.ReactElement => {
  const { event } = props;
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const [optimisticEvent, addOptimistic] = useOptimistic(event, applyOptimisticUpdate);

  const isOrganizer = user?.id === optimisticEvent.organizerId;
  const participantCount = optimisticEvent.participants?.length ?? 0;

  return (
    <Card
      role="link"
      tabIndex={0}
      className={`flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md ${isOrganizer ? 'border-primary/40' : ''}`}
      onClick={() => navigate(Routes.eventDetails(optimisticEvent.id))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(Routes.eventDetails(optimisticEvent.id));
        }
      }}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className={`line-clamp-1 text-lg ${isOrganizer ? 'text-primary' : ''}`}>
          {optimisticEvent.title}
        </CardTitle>
        <Typography variant="muted" className="line-clamp-2">
          {optimisticEvent.description}
        </Typography>
      </CardHeader>

      <CardContent className="flex-1 space-y-1.5 px-4 pb-3 pt-0">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{format(new Date(optimisticEvent.dateTime), 'MMM d, yyyy · h:mm a')}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{optimisticEvent.location}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {participantCount}
            {optimisticEvent.capacity ? ` / ${optimisticEvent.capacity}` : ''} participants
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-3 pt-2" onClick={(e) => e.stopPropagation()}>
        <EventsJoinLeaveButton
          event={optimisticEvent}
          size="sm"
          onOptimisticUpdate={addOptimistic}
        />
      </CardFooter>
    </Card>
  );
};
