import { Suspense, useTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import type { CreateEventFormData, EventVisibility } from '@event-management/shared';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';
import { Routes } from '@/shared/constants/routes.constants';

import { EventForm } from '../components/events/EventForm';
import { useEventSuspense, useUpdateEvent } from '../hooks/useEventsQueries';
import { mapEventToFormData } from '../utils/form.utils';

const EditEventContent = (props: { id: string }): React.ReactElement => {
  const { id } = props;
  const navigate = useNavigate();
  const { data: currentEvent } = useEventSuspense(id);
  const updateEventMutation = useUpdateEvent();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: CreateEventFormData): void => {
    startTransition(async () => {
      try {
        await updateEventMutation.mutateAsync({
          id,
          data: {
            title: data.title,
            description: data.description ?? '',
            dateTime: new Date(data.dateTime).toISOString(),
            location: data.location,
            capacity: data.capacity ?? null,
            visibility: data.visibility as EventVisibility,
          },
        });

        toast.success('Event updated successfully');
        navigate(Routes.eventDetails(id));
      } catch {
        toast.error('Failed to update event');
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <title>Edit Event - Event Management</title>

      <Button variant="ghost" size="sm" onClick={() => navigate(Routes.eventDetails(id))}>
        <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        Back to Event
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            onSubmit={handleSubmit}
            defaultValues={mapEventToFormData(currentEvent)}
            submitLabel="Save Changes"
            isSubmitting={isPending}
            minCapacity={currentEvent.participants?.length || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export const EditEventPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditEventContent id={id} />
    </Suspense>
  );
};
