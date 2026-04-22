# Magic Mobile Monorepo

This project is a Bun + Turborepo monorepo with:

- `apps/frontend`: Next.js UI (Clerk auth, project creation/listing)
- `apps/primaryBackend`: Express API on `9090` (project CRUD + JWT auth)
- `apps/worker`: Express API on `9091` (Gemini prompt processing)
- `packages/db`: Prisma schema/client for PostgreSQL

## Architecture Overview

1. User signs in from the frontend (Clerk).
2. Frontend sends authenticated requests to primary backend:
   - `POST /project` creates a project
   - `GET /projects` lists user projects
3. Worker handles `POST /prompt`, streams model output, and stores prompt/action history.
4. Both backend and worker read/write PostgreSQL via Prisma (`packages/db`).

---

## Run With Docker (All Services + PostgreSQL)

### 1) Prepare Docker env file

From repo root:

```bash
cp .env.docker.example .env.docker
```

On Windows PowerShell:

```powershell
copy .env.docker.example .env.docker
```

Then edit `.env.docker` and set real values for:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `JWT_PUBLIC_KEY`
- `GOOGLE_API_KEY`

`DATABASE_URL` is preconfigured for Docker network:

`postgresql://postgres:mypassword@postgres:5432/postgres`

### 2) Start everything

```bash
docker compose up --build
```

This starts:

- `postgres` on `5432`
- `primary-backend` on `9090`
- `worker` on `9091`
- `frontend` on `3000`

Open: [http://localhost:3000](http://localhost:3000)

### 3) Stop everything

```bash
docker compose down
```

To also remove DB volume:

```bash
docker compose down -v
```

---

## Run Locally (Without Docker)

### 1) Prerequisites

- Bun `1.2.x`
- Node `>=18`
- PostgreSQL running locally

### 2) Install dependencies

```bash
bun install
```

### 3) Configure per-app env files

- `packages/db/.env`:
  - `DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres`
- `apps/primaryBackend/.env`:
  - `DATABASE_URL=...`
  - `JWT_PUBLIC_KEY=...`
- `apps/worker/.env`:
  - `DATABASE_URL=...`
  - `GOOGLE_API_KEY=...`
- `apps/frontend/.env`:
  - Clerk keys

### 4) Run Prisma migrations + generate client

```bash
bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma
bunx prisma generate --schema packages/db/prisma/schema.prisma
```

### 5) Start services (3 terminals)

Frontend:

```bash
bun --cwd apps/frontend dev
```

Primary backend:

```bash
bun --cwd apps/primaryBackend run index.ts
```

Worker:

```bash
bun --cwd apps/worker run index.ts
```

---

## Useful Endpoints

- Primary backend:
  - `POST http://localhost:9090/project`
  - `GET http://localhost:9090/projects`
- Worker:
  - `POST http://localhost:9091/prompt`

---

## Notes

- `apps/frontend/config.ts` uses `http://localhost:9090` for backend calls.
- `JWT_PUBLIC_KEY` supports escaped `\n` format in env files.
- Docker setup runs Prisma migration before APIs start.
