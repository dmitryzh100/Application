import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  DEFAULT_PASSWORD,
  PARTICIPANTS_PER_EVENT_MAX,
  PARTICIPANTS_PER_EVENT_MIN,
  TOTAL_PAST_PRIVATE_EVENTS,
  TOTAL_PAST_PUBLIC_EVENTS,
  TOTAL_PRIVATE_EVENTS,
  TOTAL_PUBLIC_EVENTS,
  TOTAL_USERS,
} from '../../seeds/constants/seed.constants';
import {
  buildParticipantAssignments,
  generateEvents,
  generatePastEvents,
  generateUsers,
} from '../../seeds/helpers/seed.helpers';
import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Participant) private readonly participantRepo: Repository<Participant>,
  ) {}

  async onModuleInit(): Promise<void> {
    const userCount = await this.userRepo.count();

    if (userCount > 0) {
      this.logger.log('Database already has data, skipping seed');

      return;
    }

    this.logger.log('Empty database detected, running auto-seed...');
    await this.seed();
  }

  private async seed(): Promise<void> {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const usersData = generateUsers(TOTAL_USERS, hashedPassword);
    const users: User[] = [];

    for (const userData of usersData) {
      const user = await this.userRepo.save(this.userRepo.create(userData));
      users.push(user);
    }

    this.logger.log(`Created ${users.length} users`);

    const organizerIds = users.map((u) => u.id);

    const eventsData = generateEvents(organizerIds, TOTAL_PUBLIC_EVENTS, TOTAL_PRIVATE_EVENTS);
    const events: Event[] = [];

    for (const eventData of eventsData) {
      const event = await this.eventRepo.save(this.eventRepo.create(eventData));
      events.push(event);
    }

    this.logger.log(`Created ${events.length} future events`);

    const pastEventsData = generatePastEvents(
      organizerIds,
      TOTAL_PAST_PUBLIC_EVENTS,
      TOTAL_PAST_PRIVATE_EVENTS,
    );
    const pastEvents: Event[] = [];

    for (const eventData of pastEventsData) {
      const event = await this.eventRepo.save(this.eventRepo.create(eventData));
      pastEvents.push(event);
    }

    this.logger.log(`Created ${pastEvents.length} past events`);

    const allEvents = [...events, ...pastEvents];
    const assignments = buildParticipantAssignments(
      users.map((u) => u.id),
      allEvents.map((e) => ({ id: e.id, organizerId: e.organizerId, capacity: e.capacity })),
      PARTICIPANTS_PER_EVENT_MIN,
      PARTICIPANTS_PER_EVENT_MAX,
    );

    for (const assignment of assignments) {
      await this.participantRepo.save(this.participantRepo.create(assignment));
    }

    this.logger.log(`Created ${assignments.length} participant assignments`);
    this.logger.log('Auto-seed completed successfully');
  }
}
