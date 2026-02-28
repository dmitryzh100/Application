# @event-management/database

Database package containing TypeORM entities, repositories, and seed scripts for the Event Management System.

## Entities

| Entity        | Table          | Description                                                               |
| ------------- | -------------- | ------------------------------------------------------------------------- |
| `User`        | `users`        | Registered users with hashed passwords                                    |
| `Event`       | `events`       | Events with title, description, date/time, location, capacity, visibility |
| `Participant` | `participants` | Join table linking users to events they've joined                         |

### Relationships

- One user can organize many events (`User.organizedEvents`)
- Many-to-many between users and events through the `participants` table

## Seed Script

The seed script populates the database with realistic sample data for development and testing.

### Running the Seed

From the project root:

```bash
pnpm run seed
```

Or directly from this package:

```bash
pnpm --filter @event-management/database run seed
```

Via Docker:

```bash
docker-compose exec api node -e "require('./dist/database/seeds/seed.js')"
```

### What Gets Seeded

The seed script clears all existing data and creates:

| Data                    | Count | Details                                                                                      |
| ----------------------- | ----- | -------------------------------------------------------------------------------------------- |
| Users                   | 5     | 2 fixed + 2 random with names + 1 random without name                                        |
| Future public events    | 6     | Scheduled 3-60 days ahead; first event has capacity=2 to test "Full" label                   |
| Future private events   | 4     | Scheduled 3-60 days ahead                                                                    |
| Past public events      | 6     | 6 clustered on the same day (different hours) for calendar overflow testing                  |
| Past private events     | 2     | Spread across last 90 days                                                                   |
| Participant assignments | ~50   | 1-4 random participants per event; small-capacity events filled exactly to test "Full" state |

### Test Credentials

| Email              | Password      | Name       |
| ------------------ | ------------- | ---------- |
| `john@example.com` | `password123` | John Doe   |
| `jane@example.com` | `password123` | Jane Smith |

### Configuration

Seed constants are defined in `seeds/constants/seed.constants.ts`:

| Constant                     | Default       | Description                             |
| ---------------------------- | ------------- | --------------------------------------- |
| `TOTAL_USERS`                | 5             | Total number of users to create         |
| `TOTAL_PUBLIC_EVENTS`        | 6             | Future public events                    |
| `TOTAL_PRIVATE_EVENTS`       | 4             | Future private events                   |
| `TOTAL_PAST_PUBLIC_EVENTS`   | 6             | Past public events                      |
| `TOTAL_PAST_PRIVATE_EVENTS`  | 2             | Past private events                     |
| `PARTICIPANTS_PER_EVENT_MIN` | 1             | Minimum participants assigned per event |
| `PARTICIPANTS_PER_EVENT_MAX` | 4             | Maximum participants assigned per event |
| `DEFAULT_PASSWORD`           | `password123` | Password used for all seeded users      |

### Special Seed Behaviors

- **Nameless user**: One randomly generated user is created without a name to test the optional name field
- **Full event**: The first future public event has `capacity: 2` and its participant slots are filled exactly, so the "Full" label is visible on the events list
- **Capacity-aware assignments**: Events with small capacity (≤ max participants per event) are filled to exactly their capacity; larger/unlimited events get 1-4 random participants

### Past Event Clustering

To test calendar cell overflow, the seeder clusters up to 6 past events on a single random day (7-14 days ago) at staggered times (9:00, 10:30, 12:00, 13:30, 15:00, 16:30). Remaining past events are spread randomly.

### Structure

```
seeds/
├── seed.ts                        # Main seed runner
├── constants/
│   └── seed.constants.ts          # Counts, titles, descriptions, locations
└── helpers/
    └── seed.helpers.ts            # Generator functions
```

### Environment Variables

The seed script reads database connection details from environment variables (via `.env`):

| Variable      | Default            | Description       |
| ------------- | ------------------ | ----------------- |
| `DB_HOST`     | `localhost`        | PostgreSQL host   |
| `DB_PORT`     | `5432`             | PostgreSQL port   |
| `DB_USERNAME` | `postgres`         | Database user     |
| `DB_PASSWORD` | `postgres`         | Database password |
| `DB_NAME`     | `event_management` | Database name     |
