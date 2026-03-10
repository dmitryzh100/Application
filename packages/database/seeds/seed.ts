import 'dotenv/config';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Event } from '../src/entities/event.entity';
import { Participant } from '../src/entities/participant.entity';
import { Tag } from '../src/entities/tag.entity';
import { User } from '../src/entities/user.entity';
import {
  DEFAULT_PASSWORD,
  PARTICIPANTS_PER_EVENT_MAX,
  PARTICIPANTS_PER_EVENT_MIN,
  TAG_NAMES,
  TOTAL_PAST_PRIVATE_EVENTS,
  TOTAL_PAST_PUBLIC_EVENTS,
  TOTAL_PRIVATE_EVENTS,
  TOTAL_PUBLIC_EVENTS,
  TOTAL_USERS,
} from './constants/seed.constants';
import {
  buildParticipantAssignments,
  generateEvents,
  generatePastEvents,
  generateUsers,
  getRandomElements,
} from './helpers/seed.helpers';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'event_management',
  entities: [User, Event, Participant, Tag],
  synchronize: true,
});

async function seed(): Promise<void> {
  await dataSource.initialize();
  console.log('Database connected');

  const userRepo = dataSource.getRepository(User);
  const eventRepo = dataSource.getRepository(Event);
  const participantRepo = dataSource.getRepository(Participant);

  const tagRepo = dataSource.getRepository(Tag);

  // Clean existing data (order matters due to foreign keys)
  console.log('Cleaning existing data...');
  await participantRepo.createQueryBuilder().delete().execute();
  await dataSource.createQueryBuilder().delete().from('event_tags').execute();
  await eventRepo.createQueryBuilder().delete().execute();
  await tagRepo.createQueryBuilder().delete().execute();
  await userRepo.createQueryBuilder().delete().execute();

  // Create users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const usersData = generateUsers(TOTAL_USERS, hashedPassword);
  const users: User[] = [];

  for (const userData of usersData) {
    const user = await userRepo.save(userRepo.create(userData));
    users.push(user);
  }

  console.log(`  Created ${users.length} users`);

  // Create future events
  console.log('Creating future events...');
  const organizerIds = users.map((u) => u.id);
  const eventsData = generateEvents(organizerIds, TOTAL_PUBLIC_EVENTS, TOTAL_PRIVATE_EVENTS);
  const events: Event[] = [];

  for (const eventData of eventsData) {
    const event = await eventRepo.save(eventRepo.create(eventData));
    events.push(event);
  }

  console.log(`  Created ${events.length} future events`);

  // Create past events
  console.log('Creating past events...');
  const pastEventsData = generatePastEvents(
    organizerIds,
    TOTAL_PAST_PUBLIC_EVENTS,
    TOTAL_PAST_PRIVATE_EVENTS,
  );
  const pastEvents: Event[] = [];

  for (const eventData of pastEventsData) {
    const event = await eventRepo.save(eventRepo.create(eventData));
    pastEvents.push(event);
  }

  console.log(`  Created ${pastEvents.length} past events`);

  // Create tags
  console.log('Creating tags...');
  const tags: Tag[] = [];

  for (const name of TAG_NAMES) {
    const tag = await tagRepo.save(tagRepo.create({ name }));
    tags.push(tag);
  }

  console.log(`  Created ${tags.length} tags`);

  // Assign tags to events (1-3 random tags per event)
  console.log('Assigning tags to events...');
  const allEvents = [...events, ...pastEvents];
  let tagAssignmentCount = 0;

  for (const event of allEvents) {
    const tagCount = faker.number.int({ min: 1, max: 3 });
    const selectedTags = getRandomElements(tags, tagCount);
    event.tags = selectedTags;
    await eventRepo.save(event);
    tagAssignmentCount += selectedTags.length;
  }

  console.log(`  Created ${tagAssignmentCount} tag assignments`);

  // Assign participants
  console.log('Assigning participants...');
  const assignments = buildParticipantAssignments(
    users.map((u) => u.id),
    allEvents.map((e) => ({ id: e.id, organizerId: e.organizerId, capacity: e.capacity })),
    PARTICIPANTS_PER_EVENT_MIN,
    PARTICIPANTS_PER_EVENT_MAX,
  );

  for (const assignment of assignments) {
    await participantRepo.save(participantRepo.create(assignment));
  }

  console.log(`  Created ${assignments.length} participant assignments`);

  // Summary
  console.log('\nSeed Summary:');
  console.log(`  Users: ${users.length}`);
  console.log(`  Future events: ${events.length}`);
  console.log(`  Past events: ${pastEvents.length}`);
  console.log(`  Tags: ${tags.length}`);
  console.log(`  Tag assignments: ${tagAssignmentCount}`);
  console.log(`  Participants: ${assignments.length}`);
  console.log('\nTest credentials:');
  console.log(`  john@example.com / ${DEFAULT_PASSWORD}`);
  console.log(`  jane@example.com / ${DEFAULT_PASSWORD}`);
  console.log('\nSeed completed successfully!');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
