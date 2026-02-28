import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event, EventVisibility } from '../entities/event.entity';
import { BaseRepository } from './base.repository';

interface PaginatedResult {
  data: Event[];
  total: number;
}

interface FindEventsParams {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class EventRepository extends BaseRepository<Event> {
  constructor(
    @InjectRepository(Event)
    repository: Repository<Event>,
  ) {
    super(repository);
  }

  async findAllEvents(params: FindEventsParams): Promise<PaginatedResult> {
    const { search, page, limit } = params;

    const qb = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .orderBy('event.dateTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('(event.title ILIKE :search OR event.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findPublicEvents(params: FindEventsParams): Promise<PaginatedResult> {
    const { search, page, limit } = params;

    const qb = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .where('event.visibility = :visibility', { visibility: EventVisibility.PUBLIC })
      .orderBy('event.dateTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('(event.title ILIKE :search OR event.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findByIdWithRelations(id: string): Promise<Event | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user'],
    });
  }

  async findUserEvents(userId: string, month?: number, year?: number): Promise<Event[]> {
    const qb = this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoin('event.participants', 'p')
      .where('(event.organizerId = :userId OR p.userId = :userId)', { userId })
      .orderBy('event.dateTime', 'ASC');

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      qb.andWhere('event.dateTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return await qb.getMany();
  }
}
