# Magic Mobile - Assignment Project

## Project Links

- **Frontend Link:** [http://localhost:3000](http://localhost:3000)
- **Backend Link:** [http://localhost:9090](http://localhost:9090)
- **Worker API Link:** [http://localhost:9091](http://localhost:9091)
- **Working Drive Link:** [Add your Google Drive demo link here](https://drive.google.com/)

> Replace the frontend, backend, and Drive links above with deployed links before final submission if you have hosted versions.

## About The Project

Magic Mobile is an AI-powered web application builder assignment project. It allows users to describe the app or website they want to build, then creates and stores projects based on those prompts. The platform includes user authentication, project creation, project listing, prompt processing, and database storage.

The project is built as a full-stack Bun + Turborepo monorepo. It includes a Next.js frontend, an Express primary backend, an Express worker service, Prisma ORM, and PostgreSQL.

## Platform Screenshot

![Magic Mobile Platform Screenshot](./assets/platform-screenshot.svg)

## What Is This Project?

Magic Mobile is a prompt-based application generation platform. The idea is similar to an AI app builder: a user enters a prompt such as "create a portfolio website" or "build a dashboard", and the system creates a project entry for that request.

This assignment demonstrates a complete full-stack architecture with authentication, API communication, database persistence, and a separate worker service for AI-related processing.

## What It Does

- Provides a modern Next.js frontend where users can enter prompts.
- Uses Clerk authentication so each user has their own project data.
- Sends authenticated requests from the frontend to the backend.
- Creates new projects from user prompts.
- Lists previously created projects for the signed-in user.
- Stores users, projects, prompts, and actions in PostgreSQL using Prisma.
- Uses a worker service to process AI prompts with the Gemini API.
- Supports local development and Docker-based setup.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Clerk authentication
- **Primary Backend:** Express.js, Bun, JWT authentication
- **Worker Service:** Express.js, Bun, Gemini API prompt processing
- **Database:** PostgreSQL with Prisma ORM
- **Monorepo Tools:** Turborepo, Bun workspaces
- **Deployment Support:** Docker and Docker Compose

## Installation Guide

Follow these steps to install and set up the project on a new system.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd magic-mobile
```

### 2. Install prerequisites

Make sure these are installed:

- Node.js `18` or above
- Bun `1.2.x`
- PostgreSQL
- Docker Desktop, optional but recommended for easy setup

Check installed versions:

```bash
node --version
bun --version
docker --version
```

### 3. Install project dependencies

```bash
bun install
```

### 4. Set up environment variables

For Docker setup, create the Docker environment file:

```bash
cp .env.docker.example .env.docker
```

On Windows PowerShell:

```powershell
copy .env.docker.example .env.docker
```

Then add the required values in `.env.docker`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
JWT_PUBLIC_KEY=
GOOGLE_API_KEY=
DATABASE_URL=postgresql://postgres:mypassword@postgres:5432/postgres
```

For local setup without Docker, create these environment files:

- `packages/db/.env`
- `apps/primaryBackend/.env`
- `apps/worker/.env`
- `apps/frontend/.env`

Use this local database URL:

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres
```

### 5. Set up the database

If using Docker, the database starts automatically with Docker Compose.

If running locally, start PostgreSQL first, then run:

```bash
bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma
bunx prisma generate --schema packages/db/prisma/schema.prisma
```

### 6. Start the project

Recommended Docker command:

```bash
docker compose up --build
```

Or run locally in separate terminals:

```bash
bun --cwd apps/frontend dev
bun --cwd apps/primaryBackend run index.ts
bun --cwd apps/worker run index.ts
```

### 7. Open the application

```text
Frontend: http://localhost:3000
Backend:  http://localhost:9090
Worker:   http://localhost:9091
```

## Project Structure

```text
magic-mobile/
  apps/
    frontend/        # Main Next.js user interface
    primaryBackend/  # Express API for projects and authentication
    worker/          # Prompt processing service
    docs/            # Starter docs app
    web/             # Starter web app
  packages/
    db/              # Prisma schema and database client
    ui/              # Shared UI package
    redis/           # Shared Redis package
```

## Features

- User authentication using Clerk
- Create projects from AI prompts
- List user-specific projects
- Store project and prompt history in PostgreSQL
- Backend authentication middleware using JWT
- Worker service for AI prompt processing
- Docker setup for running the complete stack

## Architecture Overview

1. The user signs in from the frontend using Clerk.
2. The frontend sends authenticated requests to the primary backend.
3. The primary backend handles project creation and project listing.
4. The worker service handles prompt processing and stores prompt/action history.
5. Backend services use Prisma to read and write data in PostgreSQL.

## API Endpoints

### Primary Backend

- `POST /project` - Create a new project
- `GET /projects` - Get all projects for the signed-in user

Base URL:

```text
http://localhost:9090
```

### Worker Service

- `POST /prompt` - Process a prompt with the AI worker

Base URL:

```text
http://localhost:9091
```

## Run With Docker

### 1. Create Docker environment file

```bash
cp .env.docker.example .env.docker
```

On Windows PowerShell:

```powershell
copy .env.docker.example .env.docker
```

Update `.env.docker` with real values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
JWT_PUBLIC_KEY=
GOOGLE_API_KEY=
```

The Docker database URL is already configured as:

```env
DATABASE_URL=postgresql://postgres:mypassword@postgres:5432/postgres
```

### 2. Start all services

```bash
docker compose up --build
```

This starts:

- Frontend: `http://localhost:3000`
- Primary backend: `http://localhost:9090`
- Worker service: `http://localhost:9091`
- PostgreSQL: `localhost:5432`

### 3. Stop all services

```bash
docker compose down
```

To remove the database volume also:

```bash
docker compose down -v
```

## Run Locally Without Docker

### 1. Prerequisites

- Bun `1.2.x`
- Node.js `>=18`
- PostgreSQL running locally

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment files

Create and update these files:

- `packages/db/.env`
- `apps/primaryBackend/.env`
- `apps/worker/.env`
- `apps/frontend/.env`

Required values include:

```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/postgres
JWT_PUBLIC_KEY=
GOOGLE_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 4. Run Prisma migrations and generate client

```bash
bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma
bunx prisma generate --schema packages/db/prisma/schema.prisma
```

### 5. Start services

Run these commands in separate terminals:

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

## Root Scripts

```bash
bun run dev
bun run build
bun run lint
bun run check-types
bun run format
```

## Notes For Evaluation

- The frontend currently calls the backend from `apps/frontend/config.ts`.
- The primary backend runs on port `9090`.
- The worker service runs on port `9091`.
- The frontend runs on port `3000`.
- Docker Compose runs database migration before starting backend services.
