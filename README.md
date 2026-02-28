# Event Management System (PoC)

A full-stack Event Management application (PoC) built with React 19, NestJS, and PostgreSQL.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, React Hook Form
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT Authentication, Swagger
- **Shared:** TypeScript types and Yup validation schemas
- **Infrastructure:** Docker, Docker Compose, Nginx, Turborepo

## Live Demo

Deployed on Render: https://event-management-web.onrender.com

> Free-tier services spin down after inactivity — the first request may take 30-60 seconds to wake up.

## Quick Start (Docker)

The entire application launches with a single command — no `.env` files, no manual seeding, no extra configuration:

```bash
docker-compose up --build
```

This builds and starts all services (frontend, backend API, PostgreSQL). On first launch, the backend automatically detects an empty database and seeds it with sample users and events.

Once running:

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs

**Default credentials** (created automatically):

- `john@example.com` / `password123`
- `jane@example.com` / `password123`

### Re-seeding

The auto-seed only runs when the database is empty. To re-seed with fresh data, remove the volume and restart:

```bash
docker-compose down -v
docker-compose up --build
```

Or seed manually (locally):

```bash
pnpm run seed
```

For full seeder documentation, see the [Database & Seeder README](packages/database/README.md).

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- pnpm 10+

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd Application
```

2. Copy environment files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env
```

3. Install dependencies:

```bash
pnpm install
```

4. Build the shared package:

```bash
pnpm --filter @event-management/shared run build
```

5. Start PostgreSQL and create the database `event_management`.

6. Start development servers:

```bash
pnpm run dev
```

The database is seeded automatically on first launch when it detects an empty database. To re-seed manually:

```bash
pnpm run seed
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Project Structure

```
Application/
├── turbo.json                       # Turborepo config
├── docker-compose.yml               # Docker orchestration
├── packages/
│   ├── shared/                      # Shared types & validation schemas
│   │   └── src/
│   │       ├── types/               # TypeScript interfaces
│   │       ├── utils/               # Shared utilities (isPastEvent, etc.)
│   │       └── validation/          # Yup schemas
│   └── database/                    # TypeORM entities, repositories & seeder
│       ├── src/
│       │   ├── db/                  # DatabaseModule, config, SeederService
│       │   ├── entities/            # User, Event, Participant entities
│       │   └── repositories/        # TypeORM repositories
│       └── seeds/                   # Database seed script & helpers
│           ├── constants/           # Seed data (titles, descriptions, counts)
│           └── helpers/             # Generator functions
├── apps/
│   ├── api/                         # NestJS REST API
│   │   └── src/
│   │       ├── common/              # Config, guards, pipes, filters, decorators
│   │       └── modules/             # Auth, events, users modules
│   └── web/                         # React 19 + Vite SPA
│       └── src/
│           ├── modules/
│           │   ├── auth/            # Login, register, auth store & API
│           │   └── events/          # Events feature module
│           │       ├── api/         # Events API client
│           │       ├── components/  # EventCard, EventForm, Calendar views
│           │       ├── hooks/       # React Query hooks
│           │       ├── pages/       # EventsPage, EventDetailsPage, etc.
│           │       ├── stores/      # Zustand stores
│           │       └── utils/       # Form utilities
│           └── shared/              # UI components, layout, constants, config
├── references/                      # Design wireframes
└── tooling/                         # ESLint, Prettier, TypeScript configs
```

## API Endpoints

| Method | Endpoint              | Auth | Description                 |
| ------ | --------------------- | ---- | --------------------------- |
| POST   | /api/auth/register    | No   | Register a new user         |
| POST   | /api/auth/login       | No   | Login and get JWT token     |
| GET    | /api/events           | No   | List public events          |
| GET    | /api/events/:id       | No   | Get event details           |
| POST   | /api/events           | JWT  | Create a new event          |
| PATCH  | /api/events/:id       | JWT  | Update an event (organizer) |
| DELETE | /api/events/:id       | JWT  | Delete an event (organizer) |
| POST   | /api/events/:id/join  | JWT  | Join an event               |
| POST   | /api/events/:id/leave | JWT  | Leave an event              |
| GET    | /api/users/me/events  | JWT  | Get user's calendar events  |

## Features

- User registration and login with JWT authentication
- Browse and search public events
- Join/leave events with capacity checking (full events show a "Full" label)
- Create, edit, and delete events (organizer only)
- Past events are read-only (no join/leave/edit/delete)
- Capacity cannot be reduced below current participant count
- Monthly and weekly calendar views for personal events (scrollable cells for overflow)
- Context-aware navigation (Back button returns to originating page)
- Responsive design for desktop and mobile
- API documentation with Swagger
