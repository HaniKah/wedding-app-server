# Graph Report - wedding-app-server  (2026-08-26)

## Corpus Check
- 143 files · ~19,983 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 961 nodes · 1890 edges · 99 communities (37 shown, 62 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c724c14`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PhotosService
- webhooks.controller.ts
- EmailOtpRepositoryService
- app.module.ts
- scripts
- Public
- GuestsRepositoryService
- PlacesController
- planner/planner.service.ts
- compilerOptions
- places/places.dto.ts
- PlannerService
- app-version.controller.ts
- Wedding Planner Server
- UsersService
- apple.dto.ts
- AuthService
- Money
- db.d.ts
- auth.controller.ts
- priceRange-transformer-plugin.ts
- EmailService
- Categories
- dependencies
- devDependencies
- exclude
- google.strategy.ts
- nest-cli.json
- auth.module.ts
- VideosService
- LatLng
- PlacesService
- GoogleAuthGuard
- RefreshAuthGuard
- DbService
- errors.dto.ts
- blurhash
- decimal.js
- axios
- eslint-config-prettier
- @eslint/js
- eslint-plugin-prettier
- express-session
- globals
- @googlemaps/places
- jest
- jose
- kysely
- kysely-codegen
- minio
- @nestjs/axios
- @nestjs/cli
- @nestjs/common
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- @nestjs/passport
- @nestjs/platform-express
- @nestjs/schematics
- @nestjs/swagger
- @nestjs/testing
- class-transformer
- passport-apple
- passport-google-oauth20
- passport-jwt
- passport-local
- pg
- rxjs
- sharp
- uuid
- prettier
- source-map-support
- supertest
- ts-jest
- ts-loader
- ts-node
- tsconfig-paths
- @types/express
- @types/express-session
- CLAUDE.md
- @types/multer
- @types/node
- @eslint/eslintrc
- @types/pg
- typescript
- typescript-eslint
- webhook-auth.dto.ts
- ffprobe-static
- fluent-ffmpeg
- reflect-metadata
- @types/fluent-ffmpeg
- @types/passport-jwt
- @types/supertest

## God Nodes (most connected - your core abstractions)
1. `AuthService` - 29 edges
2. `Public()` - 29 edges
3. `VideosService` - 25 edges
4. `PhotosService` - 24 edges
5. `Categories` - 24 edges
6. `compilerOptions` - 24 edges
7. `DbService` - 23 edges
8. `UsersService` - 23 edges
9. `CountryCode` - 20 edges
10. `scripts` - 18 edges

## Surprising Connections (you probably didn't know these)
- `CI postgres:17 service container` --semantically_similar_to--> `postgres_test service`  [INFERRED] [semantically similar]
  .github/workflows/deploy.yml → docker-compose.yaml
- `migrations job` --conceptually_related_to--> `Kysely ORM`  [INFERRED]
  .github/workflows/deploy.yml → README.md
- `minio service` --conceptually_related_to--> `MinIO Storage`  [EXTRACTED]
  docker-compose.yaml → README.md
- `postgres_17 service` --conceptually_related_to--> `PostgreSQL v17`  [EXTRACTED]
  docker-compose.yaml → README.md
- `AdminPlacesController` --references--> `Roles()`  [EXTRACTED]
  src/admin/admin-places.controller.ts → src/auth/decorators/roles.decorator.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI Test-then-Migrate Deploy Pipeline** — github_workflows_deploy_tests_job, github_workflows_deploy_migrations_job, github_workflows_deploy_postgres_ci_service [EXTRACTED 1.00]
- **Local Development Infrastructure Services** — docker_compose_postgres_17, docker_compose_postgres_test, docker_compose_minio_service [EXTRACTED 1.00]

## Communities (99 total, 62 thin omitted)

### Community 0 - "PhotosService"
Cohesion: 0.06
Nodes (34): generateBlurhash(), GoogleVisionApiService, Inject, Injectable, MinioService, Inject, Injectable, PhotosController (+26 more)

### Community 1 - "webhooks.controller.ts"
Cohesion: 0.09
Nodes (20): HttpCode, Injectable, WebhookJwtAuthGuard, PromotionRepositoryService, Injectable, PromotionsService, Injectable, CreatePromotionRequest (+12 more)

### Community 2 - "EmailOtpRepositoryService"
Cohesion: 0.11
Nodes (5): Body, Post, Inject, EmailOtpRepositoryService, Injectable

### Community 3 - "app.module.ts"
Cohesion: 0.06
Nodes (38): Global, AdminModule, Module, AppController, Controller, Get, AppModule, Module (+30 more)

### Community 4 - "scripts"
Cohesion: 0.05
Nodes (37): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+29 more)

### Community 5 - "Public"
Cohesion: 0.10
Nodes (20): Res, AuthController, Body, Controller, Get, Inject, Post, Query (+12 more)

### Community 6 - "GuestsRepositoryService"
Cohesion: 0.11
Nodes (18): GuestsController, Body, Controller, Get, Post, GuestsModule, Module, GuestsRepositoryService (+10 more)

### Community 7 - "PlacesController"
Cohesion: 0.14
Nodes (9): ApiExtraModels, PlacesController, Body, Controller, Get, Post, Query, Req (+1 more)

### Community 8 - "planner/planner.service.ts"
Cohesion: 0.15
Nodes (23): @nestjs/swagger, PlannerService, getPlaceRequestStub(), placesViewModelStub(), CountryCode, CountryInfoViewModel, PlacesFeatures, PriceType (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+16 more)

### Community 10 - "places/places.dto.ts"
Cohesion: 0.22
Nodes (15): MoneyColumn, CountryInfo, ApiProperty, AdminCreatePlaceRequest, CreatePlaceRequest, DeletePlaceRequest, PlaceInfo, PublishPlaceRequest (+7 more)

### Community 11 - "PlannerService"
Cohesion: 0.10
Nodes (10): PlannerRepositoryService, Injectable, PlannerService, Injectable, PlansRepositoryService, Injectable, ApiProperty, UpdateDateRequest (+2 more)

### Community 12 - "app-version.controller.ts"
Cohesion: 0.17
Nodes (9): AppVersionController, Controller, Get, AppVersionModule, Module, AppVersionService, Inject, Injectable (+1 more)

### Community 13 - "Wedding Planner Server"
Cohesion: 0.15
Nodes (16): minio service, postgres_17 service, postgres_test service, migrations job, CI postgres:17 service container, tests job, Deploy Workflow, Google Places API (+8 more)

### Community 14 - "UsersService"
Cohesion: 0.07
Nodes (26): Delete, AdminUsersController, Controller, Get, Param, Roles(), ROLES_KEY, RolesGuard (+18 more)

### Community 15 - "apple.dto.ts"
Cohesion: 0.15
Nodes (11): AppleAuthGuard, Inject, Injectable, AppleAuthorizeRequestParams, AppleAuthorizeResponse, AppleIdTokenPayload, AppleJWKPayload, AppleJWKSetKeys (+3 more)

### Community 16 - "AuthService"
Cohesion: 0.15
Nodes (8): AuthService, Injectable, JwtStrategy, Inject, Injectable, RefreshJwtStrategy, Inject, Injectable

### Community 18 - "db.d.ts"
Cohesion: 0.14
Nodes (13): DB, EmailOtps, Generated, Guests, Numeric, Photos, PhotosVariants, Places (+5 more)

### Community 19 - "auth.controller.ts"
Cohesion: 0.17
Nodes (12): Length, ExchangeAuthGuard, Inject, Injectable, AuthJwtPayload, Provider, ResendVerificationDto, SignInDto (+4 more)

### Community 20 - "priceRange-transformer-plugin.ts"
Cohesion: 0.24
Nodes (3): NumRangeValueTransformer, PriceRangeTransformerPlugin, NumRangeDto

### Community 21 - "EmailService"
Cohesion: 0.24
Nodes (5): EmailModule, Module, EmailService, Inject, Injectable

### Community 22 - "Categories"
Cohesion: 0.26
Nodes (9): Categories, GeneratePackagesRequest, PackagesDto, ApiProperty, UpdateFeaturesRequest, StepsDto, StepsInfo, StepsViewModel (+1 more)

### Community 23 - "dependencies"
Cohesion: 0.22
Nodes (9): argon2, class-validator, ffmpeg-static, dependencies, argon2, class-validator, ffmpeg-static, passport (+1 more)

### Community 24 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, @types/jest, @types/passport-apple, @types/passport-google-oauth20, @types/jest, @types/passport-apple (+1 more)

### Community 25 - "exclude"
Cohesion: 0.25
Nodes (7): dist, node_modules, **/*spec.ts, test, ./tsconfig.json, exclude, extends

### Community 26 - "google.strategy.ts"
Cohesion: 0.15
Nodes (8): GoogleStrategy, Inject, Injectable, GoogleProfileDto, GoogleCreateUserDto, ApiProperty, IsEmail, IsString

### Community 27 - "nest-cli.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, plugins, $schema, sourceRoot

### Community 28 - "auth.module.ts"
Cohesion: 0.15
Nodes (8): IS_PUBLIC_KEY, JwtAuthGuard, Injectable, Controller, WellKnownController, Inject, Injectable, WebhookJwtStrategy

### Community 29 - "VideosService"
Cohesion: 0.07
Nodes (25): HeroMediaType, VideosDto, VideosViewModel, ALLOWED_VIDEO_MIME_TYPES, DeleteVideoRequest, MAX_VIDEO_DURATION_MS, MAX_VIDEO_FILE_SIZE_BYTES, VideoBucketName (+17 more)

### Community 31 - "PlacesService"
Cohesion: 0.13
Nodes (11): AdminPlacesController, Body, Controller, Get, Param, Post, Query, PlacesService (+3 more)

### Community 34 - "DbService"
Cohesion: 0.20
Nodes (4): DbService, Injectable, PlacesRepositoryService, Injectable

## Knowledge Gaps
- **173 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Public()` connect `Public` to `PhotosService`, `webhooks.controller.ts`, `app.module.ts`, `planner/planner.service.ts`, `app-version.controller.ts`, `auth.controller.ts`, `auth.module.ts`, `VideosService`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `planner/planner.service.ts` to `PhotosService`, `app.module.ts`, `errors.dto.ts`, `GuestsRepositoryService`, `places/places.dto.ts`, `PlannerService`, `UsersService`, `auth.controller.ts`, `Categories`, `nest-cli.json`, `VideosService`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `EmailOtpRepositoryService`, `Public`, `apple.dto.ts`, `auth.controller.ts`, `google.strategy.ts`, `auth.module.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PhotosService` be split into smaller, more focused modules?**
  _Cohesion score 0.05639097744360902 - nodes in this community are weakly interconnected._
- **Should `webhooks.controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08669354838709678 - nodes in this community are weakly interconnected._
- **Should `EmailOtpRepositoryService` be split into smaller, more focused modules?**
  _Cohesion score 0.11067193675889328 - nodes in this community are weakly interconnected._