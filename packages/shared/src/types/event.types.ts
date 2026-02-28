import { UserBase } from './user.types';

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
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
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  dateTime?: string;
  location?: string;
  capacity?: number | null;
  visibility?: EventVisibility;
}

export interface EventsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface MyEventsQueryParams {
  month?: number;
  year?: number;
}

export enum ViewMode {
  MONTH = 'month',
  WEEK = 'week',
}
