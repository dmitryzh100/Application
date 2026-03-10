import { format } from 'date-fns';

import {
  EventVisibility,
  type CreateEventFormData,
  type EventWithDetails,
} from '@event-management/shared';

export function resetEventFormData(): CreateEventFormData {
  return {
    title: '',
    description: '',
    dateTime: '',
    location: '',
    capacity: undefined,
    visibility: EventVisibility.PUBLIC,
    tagIds: [],
  };
}

export function mapEventToFormData(event: EventWithDetails): CreateEventFormData {
  return {
    title: event.title,
    description: event.description,
    dateTime: format(new Date(event.dateTime), "yyyy-MM-dd'T'HH:mm"),
    location: event.location,
    capacity: event.capacity ?? undefined,
    visibility: event.visibility,
    tagIds: event.tags.map((t) => t.id),
  };
}
