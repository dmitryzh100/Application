import { useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import type { CreateEventFormData, EventVisibility } from '@event-management/shared';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Routes } from '@/shared/constants/routes.constants';

import { EventForm } from '../components/events/EventForm';
import { useCreateEvent } from '../hooks/useEventsQueries';

export const CreateEventPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const createEventMutation = useCreateEvent();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: CreateEventFormData): void => {
    startTransition(async () => {
      try {
        const event = await createEventMutation.mutateAsync({
          title: data.title,
          description: data.description ?? '',
          dateTime: new Date(data.dateTime).toISOString(),
          location: data.location,
          capacity: data.capacity ?? null,
          visibility: data.visibility as EventVisibility,
        });

        toast.success('Event created successfully');
        navigate(Routes.eventDetails(event.id));
      } catch {
        toast.error('Failed to create event');
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <title>Create Event - Event Management</title>

      <Button variant="ghost" size="sm" onClick={() => navigate(Routes.events)}>
        <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        Back to Events
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} submitLabel="Create Event" isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  );
};
