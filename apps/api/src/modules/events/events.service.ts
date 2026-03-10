import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  EventRepository,
  EventVisibility,
  ParticipantRepository,
  TagRepository,
  type Event,
} from '@event-management/database';
import type { EventWithDetails, PaginatedResponse, PaginationMeta } from '@event-management/shared';

import { serializeEvent } from './events.serializer';

interface CreateEventData {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity?: number | null;
  visibility: string;
  tagIds?: string[];
}

interface UpdateEventData {
  title?: string;
  description?: string;
  dateTime?: string;
  location?: string;
  capacity?: number | null;
  visibility?: string;
  tagIds?: string[];
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly eventRepository: EventRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async findEvents(
    search?: string,
    userId?: string,
    page?: string,
    limit?: string,
    tagIds?: string[],
  ): Promise<PaginatedResponse<EventWithDetails>> {
    const pageNum = page ? parseInt(page, 10) : DEFAULT_PAGE;
    const limitNum = limit ? parseInt(limit, 10) : DEFAULT_LIMIT;
    const clampedPage = Math.max(1, pageNum);
    const clampedLimit = Math.min(MAX_LIMIT, Math.max(1, limitNum));

    const params = { search, page: clampedPage, limit: clampedLimit, tagIds };

    const { data, total } = userId
      ? await this.eventRepository.findAllEvents(params)
      : await this.eventRepository.findPublicEvents(params);

    const totalPages = Math.ceil(total / clampedLimit);

    const meta: PaginationMeta = {
      total,
      page: clampedPage,
      limit: clampedLimit,
      totalPages,
      hasMore: clampedPage < totalPages,
    };

    return { data: data.map(serializeEvent), meta };
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findByIdWithRelations(id);

    if (!event) {
      this.logger.warn(`Event not found: ${id}`);
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findOne(id: string, userId?: string): Promise<EventWithDetails> {
    const event = await this.findById(id);

    if (event.visibility === EventVisibility.PRIVATE && !userId) {
      throw new UnauthorizedException('Authentication required to view this event');
    }

    return serializeEvent(event);
  }

  async create(data: CreateEventData, organizerId: string): Promise<EventWithDetails> {
    const tags = data.tagIds?.length ? await this.tagRepository.findByIds(data.tagIds) : [];

    const saved = await this.eventRepository.create({
      title: data.title,
      description: data.description || '',
      dateTime: new Date(data.dateTime),
      location: data.location,
      capacity: data.capacity ?? null,
      visibility: data.visibility as EventVisibility,
      organizerId,
      tags,
    });

    return serializeEvent(await this.findById(saved.id));
  }

  async update(id: string, data: UpdateEventData, userId: string): Promise<EventWithDetails> {
    const event = await this.findById(id);

    if (event.organizerId !== userId) {
      this.logger.warn(`Update forbidden - user ${userId} is not organizer of event ${id}`);
      throw new ForbiddenException('Not allowed to edit this event');
    }

    if (data.capacity !== undefined && data.capacity !== null) {
      const participantCount = event.participants?.length ?? 0;

      if (data.capacity < participantCount) {
        throw new BadRequestException(
          `Capacity cannot be less than current number of participants (${participantCount})`,
        );
      }
    }

    const updateData: Partial<Event> = {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.dateTime && { dateTime: new Date(data.dateTime) }),
      ...(data.location && { location: data.location }),
      ...(data.capacity !== undefined && { capacity: data.capacity ?? null }),
      ...(data.visibility && { visibility: data.visibility as EventVisibility }),
    };

    await this.eventRepository.update(id, updateData);

    if (data.tagIds !== undefined) {
      const tags = data.tagIds.length ? await this.tagRepository.findByIds(data.tagIds) : [];
      const updated = await this.findById(id);
      updated.tags = tags;
      await this.eventRepository.save(updated);
    }

    return serializeEvent(await this.findById(id));
  }

  async delete(id: string, userId: string): Promise<{ deleted: boolean }> {
    const event = await this.findById(id);

    if (event.organizerId !== userId) {
      this.logger.warn(`Delete forbidden - user ${userId} is not organizer of event ${id}`);
      throw new ForbiddenException('Not allowed to delete this event');
    }

    await this.eventRepository.delete({ id } as never);

    return { deleted: true };
  }

  async join(eventId: string, userId: string): Promise<EventWithDetails> {
    const event = await this.findById(eventId);

    const existingParticipant = await this.participantRepository.findByUserAndEvent(
      userId,
      eventId,
    );

    if (existingParticipant) {
      this.logger.warn(`Join failed - user ${userId} already joined event ${eventId}`);
      throw new BadRequestException('Already joined this event');
    }

    if (event.capacity !== null && event.participants.length >= event.capacity) {
      this.logger.warn(`Join failed - event ${eventId} is full`);
      throw new BadRequestException('Event is full');
    }

    await this.participantRepository.create({ userId, eventId });

    return serializeEvent(await this.findById(eventId));
  }

  async leave(eventId: string, userId: string): Promise<EventWithDetails> {
    const participant = await this.participantRepository.findByUserAndEvent(userId, eventId);

    if (!participant) {
      this.logger.warn(`Leave failed - user ${userId} is not a participant of event ${eventId}`);
      throw new BadRequestException('Not a participant of this event');
    }

    await this.participantRepository.deleteByUserAndEvent(userId, eventId);

    return serializeEvent(await this.findById(eventId));
  }

  async findUserEvents(userId: string, month?: number, year?: number): Promise<Event[]> {
    return await this.eventRepository.findUserEvents(userId, month, year);
  }
}
