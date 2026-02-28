import type { Event } from '@event-management/database';
import type { EventWithDetails } from '@event-management/shared';

export function serializeEvent(event: Event): EventWithDetails {
  const participants = (event.participants ?? []).map((p) => ({
    id: p.user?.id ?? p.userId,
    name: p.user?.name ?? '',
    email: p.user?.email ?? '',
    joinedAt: p.joinedAt?.toISOString() ?? '',
  }));

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    dateTime: event.dateTime?.toISOString() ?? '',
    location: event.location,
    capacity: event.capacity,
    visibility: event.visibility,
    organizerId: event.organizerId,
    createdAt: event.createdAt?.toISOString() ?? '',
    updatedAt: event.updatedAt?.toISOString() ?? '',
    organizer: event.organizer
      ? {
          id: event.organizer.id,
          name: event.organizer.name,
          email: event.organizer.email,
          createdAt: event.organizer.createdAt?.toISOString() ?? '',
        }
      : { id: event.organizerId, name: '', email: '', createdAt: '' },
    participants,
    participantCount: participants.length,
  };
}
