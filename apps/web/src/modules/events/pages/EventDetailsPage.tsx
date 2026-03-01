import { Suspense, useOptimistic, useState, useTransition } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { format } from 'date-fns';
import { ArrowLeft, CalendarDays, Edit, MapPin, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

import { getDisplayName, isPastEvent, type EventWithDetails } from '@event-management/shared';

import { useAuthStore } from '@/modules/auth';
import { AuthErrorBoundary } from '@/shared/components/app/AuthErrorBoundary';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { Typography } from '@/shared/components/ui/typography';
import { Routes } from '@/shared/constants/routes.constants';

import { EventsDeleteConfirmDialog } from '../components/events/EventsDeleteConfirmDialog';
import {
  EventsJoinLeaveButton,
  type OptimisticAction,
} from '../components/events/EventsJoinLeaveButton';
import { EventsParticipantList } from '../components/events/EventsParticipantList';
import { ParticipantAction } from '../enums/events.enum';
import { useDeleteEvent, useEventSuspense } from '../hooks/useEventsQueries';

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

const EventDetailsContent = (props: { id: string }): React.ReactElement => {
  const { id } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { data: currentEvent } = useEventSuspense(id);
  const user = useAuthStore((s) => s.user);
  const deleteEventMutation = useDeleteEvent();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const [optimisticEvent, addOptimistic] = useOptimistic(currentEvent, applyOptimisticUpdate);

  const handleDelete = (): void => {
    startDeleteTransition(async () => {
      try {
        await deleteEventMutation.mutateAsync(id);
        toast.success('Event deleted successfully');
        navigate(backRoute);
      } catch {
        toast.error('Failed to delete event');
      } finally {
        setDeleteOpen(false);
      }
    });
  };

  const displayEvent = optimisticEvent ?? currentEvent;
  const isOrganizer = user?.id === displayEvent.organizerId;
  const isPast = isPastEvent(displayEvent.dateTime);
  const participantCount = displayEvent.participants?.length ?? 0;
  const cameFromMyEvents = (location.state as { from?: string })?.from === 'my-events';
  const backRoute = cameFromMyEvents ? Routes.myEvents : Routes.events;
  const backLabel = cameFromMyEvents ? 'Back to My Events' : 'Back to Events';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <title>{displayEvent.title} - Event Management</title>

      <Button variant="ghost" size="sm" onClick={() => navigate(backRoute)}>
        <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className={`text-2xl ${isOrganizer ? 'text-primary' : ''}`}>
              {displayEvent.title}
            </CardTitle>

            {isOrganizer && !isPast && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(Routes.eventEdit(id))}>
                  <Edit className="mr-1 h-4 w-4" aria-hidden="true" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Typography className="text-muted-foreground">{displayEvent.description}</Typography>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="text-primary h-4 w-4" aria-hidden="true" />
              <span>{format(new Date(displayEvent.dateTime), 'EEEE, MMM d, yyyy · h:mm a')}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-primary h-4 w-4" aria-hidden="true" />
              <span>{displayEvent.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="text-primary h-4 w-4" aria-hidden="true" />
              <span>
                {participantCount}
                {displayEvent.capacity ? ` / ${displayEvent.capacity}` : ''} participants
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <EventsJoinLeaveButton event={displayEvent} onOptimisticUpdate={addOptimistic} />

            {displayEvent.organizer && (
              <Typography as="span" variant="muted">
                Organized by{' '}
                {getDisplayName(displayEvent.organizer.name, displayEvent.organizer.email)}
                {isOrganizer && ' (you)'}
              </Typography>
            )}
          </div>

          <hr />

          <EventsParticipantList participants={displayEvent.participants ?? []} />
        </CardContent>
      </Card>

      <EventsDeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isLoading={isDeletePending}
      />
    </div>
  );
};

export const EventDetailsPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <LoadingSpinner />;
  }

  return (
    <AuthErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <EventDetailsContent id={id} />
      </Suspense>
    </AuthErrorBoundary>
  );
};
