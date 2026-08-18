# Graph Report - wedding-app-server  (2026-08-19)

## Corpus Check
- Corpus is ~16,001 words - fits in a single context window. You may not need a graph.

## Summary
- 827 nodes · 1552 edges · 93 communities (36 shown, 57 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Photos & Vision Upload Flow
- Webhooks, Promotions & Repositories
- Auth Service & User Management
- App Bootstrap & Feature Modules
- package.json Scripts & Jest Config
- Auth & Planner Controllers
- Guests Feature
- Places Controller & Service
- Planner Places & Favorites DTOs
- tsconfig Compiler Options
- Places DTOs & Money Type
- Planner Repository & Service
- App Version Feature
- Project Docs & Infra Config
- Roles Guard & Express Types
- Apple OAuth Guard & DTOs
- JWT Strategy & Refresh Config
- Money Value Object & DB Transformer
- Generated DB Types
- Auth Controller & DTOs
- Price Range DB Transformer
- Email/OTP Service
- Steps & Packages DTOs
- Validation & HTTP Dependencies
- Passport & Test Type Defs
- TS Build Config
- Google OAuth Strategy
- Nest CLI Config
- Webhook JWT Strategy
- Public Decorator & JWT Guard
- LatLng Value Object
- Exchange Auth Guard
- Google Auth Guard
- Refresh Auth Guard
- Wedding Date DTO
- Errors DTO
- Argon2 Dependency
- Blurhash Dependency
- Decimal.js Dependency
- ESLint Dependency
- ESLint Config Prettier
- ESLint JS Dependency
- ESLint Prettier Plugin
- Express Session Dependency
- Globals Dependency
- Google Maps Places Dependency
- Jest Dependency
- Jose (JWT) Dependency
- Kysely Dependency
- Kysely Codegen Dependency
- MinIO Client Dependency
- NestJS Axios Dependency
- NestJS CLI Dependency
- NestJS Common Dependency
- NestJS Config Dependency
- NestJS Core Dependency
- NestJS JWT Dependency
- NestJS Passport Dependency
- NestJS Platform Express Dependency
- NestJS Schematics Dependency
- NestJS Swagger Dependency
- NestJS Testing Dependency
- Passport Dependency
- Passport Apple Dependency
- Passport Google OAuth Dependency
- Passport JWT Dependency
- Passport Local Dependency
- pg Dependency
- RxJS Dependency
- Sharp Dependency
- UUID Dependency
- Prettier Dependency
- Source Map Support Dependency
- Supertest Dependency
- ts-jest Dependency
- ts-loader Dependency
- ts-node Dependency
- tsconfig-paths Dependency
- Express Type Defs
- Express Session Type Defs
- Jest Type Defs
- Multer Type Defs
- Node Type Defs
- Passport Apple Type Defs
- pg Type Defs
- TypeScript Dependency
- typescript-eslint Dependency
- Webhook Auth DTO

## God Nodes (most connected - your core abstractions)
1. `AuthService` - 29 edges
2. `Public()` - 24 edges
3. `PhotosService` - 24 edges
4. `compilerOptions` - 24 edges
5. `DbService` - 21 edges
6. `Categories` - 21 edges
7. `scripts` - 18 edges
8. `PhotoSize` - 18 edges
9. `UsersService` - 18 edges
10. `PhotosRepositoryService` - 17 edges

## Surprising Connections (you probably didn't know these)
- `CI postgres:17 service container` --semantically_similar_to--> `postgres_test service`  [INFERRED] [semantically similar]
  .github/workflows/deploy.yml → docker-compose.yaml
- `migrations job` --conceptually_related_to--> `Kysely ORM`  [INFERRED]
  .github/workflows/deploy.yml → README.md
- `minio service` --conceptually_related_to--> `MinIO Storage`  [EXTRACTED]
  docker-compose.yaml → README.md
- `postgres_17 service` --conceptually_related_to--> `PostgreSQL v17`  [EXTRACTED]
  docker-compose.yaml → README.md
- `PhotosController` --references--> `Public()`  [EXTRACTED]
  src/photos/photos.controller.ts → src/auth/decorators/public.decorator.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Local Development Infrastructure Services** — docker_compose_postgres_17, docker_compose_postgres_test, docker_compose_minio_service [EXTRACTED 1.00]
- **CI Test-then-Migrate Deploy Pipeline** — github_workflows_deploy_tests_job, github_workflows_deploy_migrations_job, github_workflows_deploy_postgres_ci_service [EXTRACTED 1.00]

## Communities (93 total, 57 thin omitted)

### Community 0 - "Photos & Vision Upload Flow"
Cohesion: 0.06
Nodes (33): ApiBody, ApiConsumes, Param, GoogleVisionApiService, Inject, Injectable, MinioService, Inject (+25 more)

### Community 1 - "Webhooks, Promotions & Repositories"
Cohesion: 0.05
Nodes (29): Global, HttpCode, Injectable, WebhookJwtAuthGuard, DbModule, Module, DbService, Injectable (+21 more)

### Community 2 - "Auth Service & User Management"
Cohesion: 0.06
Nodes (17): AuthService, Inject, Injectable, EmailOtpRepositoryService, Injectable, Inject, User, Inject (+9 more)

### Community 3 - "App Bootstrap & Feature Modules"
Cohesion: 0.06
Nodes (31): AppController, Controller, Get, AppModule, Module, AppService, Injectable, AuthModule (+23 more)

### Community 4 - "package.json Scripts & Jest Config"
Cohesion: 0.05
Nodes (37): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+29 more)

### Community 5 - "Auth & Planner Controllers"
Cohesion: 0.12
Nodes (19): Res, AuthController, Body, Controller, Get, Inject, Post, Query (+11 more)

### Community 6 - "Guests Feature"
Cohesion: 0.11
Nodes (18): GuestsController, Body, Controller, Get, Post, GuestsModule, Module, GuestsRepositoryService (+10 more)

### Community 7 - "Places Controller & Service"
Cohesion: 0.13
Nodes (13): ApiExtraModels, PlacesController, Body, Controller, Get, Post, Query, Req (+5 more)

### Community 8 - "Planner Places & Favorites DTOs"
Cohesion: 0.20
Nodes (17): PlannerService, getPlaceRequestStub(), placesViewModelStub(), CountryCode, PlacesFeatures, PriceType, FavoritePlaceDto, ApiProperty (+9 more)

### Community 9 - "tsconfig Compiler Options"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+16 more)

### Community 10 - "Places DTOs & Money Type"
Cohesion: 0.18
Nodes (17): @nestjs/swagger, MoneyColumn, CountryInfo, CountryInfoViewModel, ApiProperty, ApiProperty, UpdateFeaturesRequest, CreatePlaceRequest (+9 more)

### Community 11 - "Planner Repository & Service"
Cohesion: 0.12
Nodes (8): IsOptional, PlannerRepositoryService, Injectable, PlannerService, Injectable, SearchFilter, IsString, SaleLabel

### Community 12 - "App Version Feature"
Cohesion: 0.17
Nodes (9): AppVersionController, Controller, Get, AppVersionModule, Module, AppVersionService, Inject, Injectable (+1 more)

### Community 13 - "Project Docs & Infra Config"
Cohesion: 0.15
Nodes (16): minio service, postgres_17 service, postgres_test service, migrations job, CI postgres:17 service container, tests job, Deploy Workflow, Google Places API (+8 more)

### Community 14 - "Roles Guard & Express Types"
Cohesion: 0.15
Nodes (10): ROLES_KEY, RolesGuard, Injectable, Role, Express, User, GoogleCreateUserDto, ApiProperty (+2 more)

### Community 15 - "Apple OAuth Guard & DTOs"
Cohesion: 0.17
Nodes (10): AppleAuthGuard, Injectable, AppleAuthorizeRequestParams, AppleAuthorizeResponse, AppleIdTokenPayload, AppleJWKPayload, AppleJWKSetKeys, AppleTokenRequest (+2 more)

### Community 16 - "JWT Strategy & Refresh Config"
Cohesion: 0.29
Nodes (5): JwtStrategy, Injectable, RefreshJwtStrategy, Injectable, AuthJwtPayload

### Community 18 - "Generated DB Types"
Cohesion: 0.15
Nodes (12): DB, EmailOtps, Generated, Guests, Numeric, Photos, PhotosVariants, Places (+4 more)

### Community 19 - "Auth Controller & DTOs"
Cohesion: 0.38
Nodes (8): Length, Provider, ResendVerificationDto, SignInDto, SignUpDto, IsEmail, IsString, VerifyEmailDto

### Community 20 - "Price Range DB Transformer"
Cohesion: 0.24
Nodes (3): NumRangeValueTransformer, PriceRangeTransformerPlugin, NumRangeDto

### Community 21 - "Email/OTP Service"
Cohesion: 0.24
Nodes (5): EmailModule, Module, EmailService, Inject, Injectable

### Community 22 - "Steps & Packages DTOs"
Cohesion: 0.33
Nodes (7): Categories, GeneratePackagesRequest, PackagesDto, StepsDto, StepsInfo, StepsViewModel, ApiProperty

### Community 23 - "Validation & HTTP Dependencies"
Cohesion: 0.22
Nodes (9): axios, class-transformer, class-validator, dependencies, axios, class-transformer, class-validator, reflect-metadata (+1 more)

### Community 24 - "Passport & Test Type Defs"
Cohesion: 0.22
Nodes (9): @eslint/eslintrc, devDependencies, @eslint/eslintrc, @types/passport-google-oauth20, @types/passport-jwt, @types/supertest, @types/passport-google-oauth20, @types/passport-jwt (+1 more)

### Community 25 - "TS Build Config"
Cohesion: 0.25
Nodes (7): dist, node_modules, **/*spec.ts, test, ./tsconfig.json, exclude, extends

### Community 26 - "Google OAuth Strategy"
Cohesion: 0.32
Nodes (3): GoogleStrategy, Injectable, GoogleProfileDto

### Community 27 - "Nest CLI Config"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 28 - "Webhook JWT Strategy"
Cohesion: 0.29
Nodes (3): Inject, Injectable, WebhookJwtStrategy

### Community 29 - "Public Decorator & JWT Guard"
Cohesion: 0.33
Nodes (3): IS_PUBLIC_KEY, JwtAuthGuard, Injectable

### Community 31 - "Exchange Auth Guard"
Cohesion: 0.40
Nodes (3): ExchangeAuthGuard, Inject, Injectable

### Community 34 - "Wedding Date DTO"
Cohesion: 0.67
Nodes (3): ApiProperty, UpdateDateRequest, WeddingDateDto

## Knowledge Gaps
- **165 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Public()` connect `Auth & Planner Controllers` to `Photos & Vision Upload Flow`, `Webhooks, Promotions & Repositories`, `App Bootstrap & Feature Modules`, `Planner Places & Favorites DTOs`, `App Version Feature`, `Auth Controller & DTOs`, `Public Decorator & JWT Guard`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `Places DTOs & Money Type` to `Photos & Vision Upload Flow`, `Wedding Date DTO`, `App Bootstrap & Feature Modules`, `Errors DTO`, `Guests Feature`, `Planner Places & Favorites DTOs`, `Roles Guard & Express Types`, `Steps & Packages DTOs`, `Nest CLI Config`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `AuthService` connect `Auth Service & User Management` to `Auth & Planner Controllers`, `Apple OAuth Guard & DTOs`, `JWT Strategy & Refresh Config`, `Auth Controller & DTOs`, `Google OAuth Strategy`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Photos & Vision Upload Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.05673274094326726 - nodes in this community are weakly interconnected._
- **Should `Webhooks, Promotions & Repositories` be split into smaller, more focused modules?**
  _Cohesion score 0.0514216575922565 - nodes in this community are weakly interconnected._
- **Should `Auth Service & User Management` be split into smaller, more focused modules?**
  _Cohesion score 0.05639097744360902 - nodes in this community are weakly interconnected._