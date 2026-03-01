import { faker } from '@faker-js/faker';

import { EventVisibility } from '../../src/entities/event.entity';
import {
  EVENT_DESCRIPTIONS,
  EVENT_LOCATIONS,
  EVENT_TITLES,
  FIXED_USERS,
  PAST_EVENT_DESCRIPTIONS,
  PAST_EVENT_TITLES,
} from '../constants/seed.constants';

interface UserSeedData {
  email: string;
  name?: string;
  password: string;
}

interface EventSeedData {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  visibility: EventVisibility;
  organizerId: string;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateUsers(count: number, hashedPassword: string): UserSeedData[] {
  const users: UserSeedData[] = FIXED_USERS.map((u) => ({
    email: u.email,
    name: u.name,
    password: hashedPassword,
  }));

  for (let i = users.length; i < count; i++) {
    const isNameless = i === users.length;

    users.push({
      email: faker.internet.email().toLowerCase(),
      ...(isNameless ? {} : { name: faker.person.fullName() }),
      password: hashedPassword,
    });
  }

  return users;
}

export function generateEvents(
  organizerIds: string[],
  publicCount: number,
  privateCount: number,
): EventSeedData[] {
  const events: EventSeedData[] = [];
  const now = Date.now();
  const usedTitles = new Set<number>();

  for (let i = 0; i < publicCount + privateCount; i++) {
    let titleIndex: number;

    do {
      titleIndex = Math.floor(Math.random() * EVENT_TITLES.length);
    } while (usedTitles.has(titleIndex) && usedTitles.size < EVENT_TITLES.length);

    usedTitles.add(titleIndex);

    const daysAhead = faker.number.int({ min: 3, max: 60 });
    const hour = faker.number.int({ min: 9, max: 18 });
    const dateTime = new Date(now + daysAhead * 24 * 60 * 60 * 1000);
    dateTime.setHours(hour, 0, 0, 0);

    const isPublic = i < publicCount;
    const isFullEvent = i === 0;
    const capacity = isFullEvent
      ? 2
      : (faker.helpers.maybe(() => faker.number.int({ min: 10, max: 100 }), {
          probability: 0.7,
        }) ?? null);

    events.push({
      title: EVENT_TITLES[titleIndex] ?? `Event ${i + 1}`,
      description: EVENT_DESCRIPTIONS[titleIndex] ?? '',
      dateTime,
      location: getRandomElement(EVENT_LOCATIONS),
      capacity,
      visibility: isPublic ? EventVisibility.PUBLIC : EventVisibility.PRIVATE,
      organizerId: getRandomElement(organizerIds),
    });
  }

  return events;
}

export function generatePastEvents(
  organizerIds: string[],
  publicCount: number,
  privateCount: number,
): EventSeedData[] {
  const events: EventSeedData[] = [];
  const now = Date.now();
  const usedTitles = new Set<number>();
  const totalCount = publicCount + privateCount;

  const clusterDaysAgo = faker.number.int({ min: 7, max: 14 });
  const clusterDate = new Date(now - clusterDaysAgo * 24 * 60 * 60 * 1000);
  const clusterSize = Math.min(6, totalCount);

  for (let i = 0; i < totalCount; i++) {
    let titleIndex: number;

    do {
      titleIndex = Math.floor(Math.random() * PAST_EVENT_TITLES.length);
    } while (usedTitles.has(titleIndex) && usedTitles.size < PAST_EVENT_TITLES.length);

    usedTitles.add(titleIndex);

    let dateTime: Date;

    if (i < clusterSize) {
      const hour = 9 + i * 1.5;
      dateTime = new Date(clusterDate);
      dateTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    } else {
      const daysAgo = faker.number.int({ min: 3, max: 90 });
      const hour = faker.number.int({ min: 9, max: 18 });
      dateTime = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      dateTime.setHours(hour, 0, 0, 0);
    }

    const isPublic = i < publicCount;
    const capacity = faker.helpers.maybe(() => faker.number.int({ min: 10, max: 100 }), {
      probability: 0.7,
    });

    events.push({
      title: PAST_EVENT_TITLES[titleIndex] ?? `Past Event ${i + 1}`,
      description: PAST_EVENT_DESCRIPTIONS[titleIndex] ?? '',
      dateTime,
      location: getRandomElement(EVENT_LOCATIONS),
      capacity: capacity ?? null,
      visibility: isPublic ? EventVisibility.PUBLIC : EventVisibility.PRIVATE,
      organizerId: getRandomElement(organizerIds),
    });
  }

  return events;
}

export function buildParticipantAssignments(
  userIds: string[],
  events: { id: string; organizerId: string; capacity: number | null }[],
  minPerEvent: number,
  maxPerEvent: number,
): { userId: string; eventId: string }[] {
  const assignments: { userId: string; eventId: string }[] = [];

  for (const event of events) {
    const eligibleUsers = userIds.filter((id) => id !== event.organizerId);
    const fillExact = event.capacity !== null && event.capacity <= maxPerEvent;
    const count =
      fillExact && event.capacity !== null
        ? Math.min(event.capacity, eligibleUsers.length)
        : faker.number.int({
            min: minPerEvent,
            max: Math.min(maxPerEvent, eligibleUsers.length),
          });
    const selected = getRandomElements(eligibleUsers, count);

    for (const userId of selected) {
      assignments.push({ userId, eventId: event.id });
    }
  }

  return assignments;
}
