import { EventVisibility } from '../enums/event.enum';
import { UserBase } from './user.types';

export { EventVisibility };

export interface TagBase {
  id: string;
  name: string;
}

export interface EventBase {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number | null;
  visibility: EventVisibility;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventWithDetails extends EventBase {
  organizer: UserBase;
  participants: ParticipantInfo[];
  participantCount: number;
  isJoined?: boolean;
  tags: TagBase[];
}

export interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity?: number | null;
  visibility: EventVisibility;
  tagIds?: string[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  dateTime?: string;
  location?: string;
  capacity?: number | null;
  visibility?: EventVisibility;
  tagIds?: string[];
}

export interface EventsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  tagIds?: string[];
}

export interface MyEventsQueryParams {
  month?: number;
  year?: number;
}
