import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository, type SelectQueryBuilder } from 'typeorm';

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
  tagIds?: string[];
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
    const { search, page, limit, tagIds } = params;

    const qb = this.baseEventsQuery()
      .orderBy('event.dateTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    this.applySearchFilter(qb, search);
    this.applyTagFilter(qb, tagIds);

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findPublicEvents(params: FindEventsParams): Promise<PaginatedResult> {
    const { search, page, limit, tagIds } = params;

    const qb = this.baseEventsQuery()
      .where('event.visibility = :visibility', { visibility: EventVisibility.PUBLIC })
      .orderBy('event.dateTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    this.applySearchFilter(qb, search);
    this.applyTagFilter(qb, tagIds);

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findByIdWithRelations(id: string): Promise<Event | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user', 'tags'],
    });
  }

  async findUserEvents(userId: string, month?: number, year?: number): Promise<Event[]> {
    const qb = this.baseEventsQuery()
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

  private baseEventsQuery(): SelectQueryBuilder<Event> {
    return this.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('event.tags', 'tags');
  }

  private applySearchFilter(qb: SelectQueryBuilder<Event>, search?: string): void {
    if (!search) return;

    qb.andWhere('(event.title ILIKE :search OR event.description ILIKE :search)', {
      search: `%${search}%`,
    });
  }

  private applyTagFilter(qb: SelectQueryBuilder<Event>, tagIds?: string[]): void {
    if (!tagIds?.length) return;

    qb.andWhere((sub) => {
      const subQuery = sub
        .subQuery()
        .select('et.event_id')
        .from('event_tags', 'et')
        .where('et.tag_id IN (:...tagIds)')
        .getQuery();

      return `event.id IN ${subQuery}`;
    }).setParameters({ tagIds });
  }
}
