# Wedding Planner Server

A robust backend for the Wedding Planner application, built with [NestJS](https://nestjs.com/).

## Features

- **User & Auth Management**: Secure authentication via Local, Google, and Apple strategies.
- **Wedding Planning**: Comprehensive tools for managing wedding details, planners, and guests.
- **Vendor & Place Integration**: Integration with Google Places API for venue and vendor discovery.
- **Image Processing**: Image recognition using Google Vision API and storage via MinIO.
- **Communications**: Transactional emails (OTP) via Resend and Webhook support.
- **App Versioning**: Management of supported app versions and store links.
- **Database**: Type-safe database operations using Kysely with PostgreSQL.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (v17)
- **ORM**: Kysely
- **Storage**: MinIO (S3-compatible)
- **Authentication**: Passport.js (JWT, OAuth2)
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v20+ recommended)
- Docker and Docker Compose
- NPM

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd wedding-app-server
```

### 2. Project setup

```bash
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env` and fill in the required credentials.

```bash
cp .env.example .env
```

### 4. Start Infrastructure

Use Docker Compose to start the PostgreSQL and MinIO services:

```bash
docker-compose up -d
```

### 5. Database Migrations

Run migrations to set up the database schema:

```bash
npm run migrate
```

To generate types for the database:

```bash
npm run codegen
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger UI at:
`http://localhost:3000/swagger`

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## License

This project is [UNLICENSED](LICENSE).
