# Event Management System

A full-stack Event Management application built with React 19, NestJS, and PostgreSQL. Includes event tagging, AI-powered assistant, and a Storybook component library.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, React Hook Form, Storybook
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT Authentication, Swagger
- **AI:** Vercel AI SDK with Groq API (LLaMA 3.3 70B), streaming chat, react-markdown
- **Shared:** TypeScript types and Yup validation schemas
- **Infrastructure:** Docker, Docker Compose, Nginx, Turborepo

## Live Demo

Deployed on Render: https://event-management-web-5hdt.onrender.com

> Free-tier services spin down after inactivity — the first request may take 30-60 seconds to wake up.

## Quick Start (Docker)

The entire application launches with a single command — no manual seeding, no extra configuration:

```bash
docker-compose up --build
```

To enable the AI Assistant, set your Groq API key before starting:

```bash
GROQ_API_KEY=your-key-here docker-compose up --build
```

You can get a free API key at https://console.groq.com.

The AI model, max tokens, and temperature are also configurable via environment variables (`GROQ_MODEL`, `GROQ_MAX_TOKENS`, `GROQ_TEMPERATURE`) with sensible defaults.

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
- Storybook: http://localhost:6006 (run `pnpm --filter @event-management/web storybook`)

## Project Structure

```
Application/
├── turbo.json                       # Turborepo config
├── docker-compose.yml               # Docker orchestration
├── packages/
│   ├── shared/                      # Shared types & validation schemas
│   │   └── src/
│   │       ├── types/               # TypeScript interfaces (Event, Tag, User)
│   │       ├── utils/               # Shared utilities (isPastEvent, etc.)
│   │       └── validation/          # Yup schemas
│   └── database/                    # TypeORM entities, repositories & seeder
│       ├── src/
│       │   ├── db/                  # DatabaseModule, config, SeederService
│       │   ├── entities/            # User, Event, Participant, Tag entities
│       │   └── repositories/        # TypeORM repositories
│       └── seeds/                   # Database seed script & helpers
├── apps/
│   ├── api/                         # NestJS REST API
│   │   └── src/
│   │       ├── common/              # Config, guards, pipes, filters, decorators
│   │       └── modules/
│   │           ├── auth/            # Authentication (register, login, JWT)
│   │           ├── events/          # Events CRUD, join/leave
│   │           ├── tags/            # Tags listing
│   │           ├── ai/             # AI Assistant (Groq API)
│   │           └── users/           # User profile & calendar events
│   └── web/                         # React 19 + Vite SPA
│       ├── .storybook/              # Storybook configuration
│       └── src/
│           ├── modules/
│           │   ├── auth/            # Login, register, auth store & API
│           │   ├── events/          # Events feature module
│           │   ├── tags/            # Tag filter, multi-select, API
│           │   └── ai/             # AI Assistant chat page
│           ├── shared/              # UI components, layout, constants, config
│           └── stories/             # Storybook stories
├── references/                      # Design wireframes
└── tooling/                         # ESLint, Prettier, TypeScript configs
```

## API Endpoints

| Method | Endpoint              | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| POST   | /api/auth/register    | No   | Register a new user                  |
| POST   | /api/auth/login       | No   | Login and get JWT token              |
| GET    | /api/events           | No   | List public events (supports tagIds) |
| GET    | /api/events/:id       | No   | Get event details                    |
| POST   | /api/events           | JWT  | Create a new event                   |
| PATCH  | /api/events/:id       | JWT  | Update an event (organizer)          |
| DELETE | /api/events/:id       | JWT  | Delete an event (organizer)          |
| POST   | /api/events/:id/join  | JWT  | Join an event                        |
| POST   | /api/events/:id/leave | JWT  | Leave an event                       |
| GET    | /api/tags             | No   | List all available tags              |
| POST   | /api/ai/chat          | JWT  | Ask the AI assistant                 |
| GET    | /api/users/me/events  | JWT  | Get user's calendar events           |

## Features

### Core (Stage 1)

- User registration and login with JWT authentication
- Browse and search public events
- Join/leave events with capacity checking (full events show a "Full" label)
- Create, edit, and delete events (organizer only)
- Past events are read-only (no join/leave/edit/delete)
- Capacity cannot be reduced below current participant count
- Monthly and weekly calendar views for personal events
- Context-aware navigation (Back button returns to originating page)
- Responsive design for desktop and mobile
- API documentation with Swagger

### Tags & AI (Stage 2)

- **Tags:** Multi-tag classification for events (max 5 per event). Tags display as compact chips on event cards, details pages, and forms. Events page includes a multi-select tag filter.
- **AI Assistant:** Streaming natural-language chat powered by Vercel AI SDK + Groq API (LLaMA 3.3 70B). Ask questions like "What events am I attending this week?" or "Show my tech events." The assistant has read-only access to the user's events and tags. Responses are rendered as formatted markdown. Model, token limit, and temperature are configurable via environment variables.
- **Storybook:** Component library with stories for Button, Input, Textarea, Badge, Card, Typography, Dialog, Label, and RadioGroup.

### Performance

- `React.memo` on list-rendered components (EventCard, EventsPaginationControls, EventsSearchBar)
- `useDeferredValue` for search input debouncing
- `useOptimistic` for instant join/leave feedback
- `useCallback` / `useMemo` for stable references and derived data
- React Query with 30s `staleTime` and next-page prefetching
- Lazy-loaded routes with Suspense boundaries
- Vite manual chunks for optimal code splitting (react, query, ui, date, icons, http, state)
