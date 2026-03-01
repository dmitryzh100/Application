import { useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

import { isPastEvent, type EventWithDetails } from '@event-management/shared';

import { useAuthStore } from '@/modules/auth';
import { Button } from '@/shared/components/ui/button';
import { Routes } from '@/shared/constants/routes.constants';

import { ParticipantAction } from '../../enums/events.enum';
import { useJoinEvent, useLeaveEvent } from '../../hooks/useEventsQueries';

export interface OptimisticAction {
  type: ParticipantAction;
  userId: string;
  userName: string;
  userEmail: string;
}

interface JoinLeaveButtonProps {
  event: EventWithDetails;
  size?: 'default' | 'sm' | 'lg';
  onOptimisticUpdate?: (action: OptimisticAction) => void;
}

export const EventsJoinLeaveButton = (props: JoinLeaveButtonProps): React.ReactElement => {
  const { event, size = 'default', onOptimisticUpdate } = props;

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const joinMutation = useJoinEvent();
  const leaveMutation = useLeaveEvent();
  const [isPending, startTransition] = useTransition();

  const isJoined = event.participants?.some((p) => p.id === user?.id);
  const isFull = event.capacity !== null && event.participants?.length >= event.capacity;
  const isOrganizer = event.organizerId === user?.id;

  const handleJoin = (): void => {
    if (!user) return;

    startTransition(async () => {
      onOptimisticUpdate?.({
        type: ParticipantAction.Join,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      await joinMutation.mutateAsync(event.id);
    });
  };

  const handleLeave = (): void => {
    if (!user) return;

    startTransition(async () => {
      onOptimisticUpdate?.({
        type: ParticipantAction.Leave,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      await leaveMutation.mutateAsync(event.id);
    });
  };

  if (isPastEvent(event.dateTime)) {
    return (
      <Button variant="secondary" size={size} disabled>
        Past
      </Button>
    );
  }

  if (isFull && !isJoined) {
    return (
      <Button variant="secondary" size={size} disabled>
        Full
      </Button>
    );
  }

  if (isOrganizer) {
    return <></>;
  }

  if (!isAuthenticated) {
    return (
      <Button variant="success" size={size} onClick={() => navigate(Routes.login)}>
        Join Event
      </Button>
    );
  }

  if (isJoined) {
    return (
      <Button variant="outline" size={size} disabled={isPending} onClick={handleLeave}>
        {isPending ? 'Leaving...' : 'Leave'}
      </Button>
    );
  }

  return (
    <Button variant="success" size={size} disabled={isPending} onClick={handleJoin}>
      {isPending ? 'Joining...' : 'Join Event'}
    </Button>
  );
};
