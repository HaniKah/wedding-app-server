# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Run with file watch
npm run start:debug     # Run with Node debugger + file watch

# Build & Production
npm run build           # Compile TypeScript (nest build)
npm run start:prod      # Run compiled output

# Testing
npm run test            # Unit tests (Jest)
npm run test:watch      # Unit tests in watch mode
npm run test:cov        # Unit tests with coverage
npm run test:e2e        # End-to-end tests

# Code Quality
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting

# Database
npm run migrate         # Run Kysely migrations (ts-node migrations/migrate.ts)
npm run codegen         # Regenerate DB types from schema (kysely-codegen → src/types/db/db.d.ts)

# Local infra
docker-compose up -d    # Start PostgreSQL + MinIO
npm run ngrok           # Expose local server (for webhook testing)
```

## Architecture

**NestJS 11 + TypeScript** backend for a wedding planning mobile app. PostgreSQL via **Kysely** ORM, **MinIO** for
object storage, **Sharp** for image processing.

### Module Structure

Each feature is a self-contained NestJS module. Most modules follow a three-layer pattern:

- **Controller** — HTTP endpoints, Swagger decorators, DTO validation
- **Service** — Business logic
- **Repository service(s)** — All Kysely DB queries

Key modules:

- `auth/` — JWT (access + refresh tokens), Google OAuth 2.0, Apple ID. A **global JWT guard** (`JwtAuthGuard`) protects
  all routes by default; use `@Public()` decorator to opt out.
- `planner/` — Core feature. Manages the user's wedding plan: favorite/picked places, wedding date, step filters.
- `places/` — Venue/vendor catalog (read-heavy). Separate from planner; planner references places by ID.
- `photos/` — Upload, store, and retrieve wedding photos. Stores metadata in DB, files in MinIO, generates variants via
  Sharp.
- `google-api/` — Google Maps Places API integration for venue search and photo retrieval.
- `webhooks/` — RevenueCat webhook handler (uses a separate `WebhookJwtStrategy` Passport strategy).
- `guests/`, `checklist/`, `promotions/`, `vendors/` — Supporting features.

### Database

- PostgreSQL using the `planner` schema.
- Kysely with `CamelCasePlugin` — write camelCase in code, stored as snake_case in DB.
- **Always run `npm run codegen` after schema migrations** to regenerate `src/types/db/db.d.ts`.
- Migration files live in `/migrations/`.

### Authentication Flow

- Signup/signin with email+password (Argon2 hashing).
- Google OAuth and Apple ID (Passport strategies in `src/strategies/`).
- JWT access tokens + refresh tokens; refresh tokens are hashed and stored in `users.hashedRefreshToken`.
- `@User()` decorator (`src/decorators/user.decorator.ts`) extracts the current user from the JWT payload in
  controllers.

### Object Storage (MinIO)

- S3-compatible. Configured via environment variables (`MINIO_*`).
- `minio/minio.service.ts` wraps the MinIO client.
- Photos are stored with generated keys; `photos_variants` table tracks each variant (thumbnail, full, etc.).

### Configuration

- All secrets and connection strings come from `.env` (JWT secrets, OAuth credentials, DB URL, MinIO config).
- Auth strategy configs are in `src/auth/config/` (one file per strategy).
- Swagger UI is available at `/api` in development (`src/main.ts`).
- NestJS Swagger plugin is enabled in `nest-cli.json` — DTO properties are auto-documented without explicit
  `@ApiProperty()` in many cases.

### Types

- `src/types/db/db.d.ts` — **auto-generated**, do not edit manually. its used by Kysely to infer DB types.
- `src/types/` — Hand-written DTOs and interfaces organized by domain.
- `src/common/` — Shared utilities (e.g., `Money` class).