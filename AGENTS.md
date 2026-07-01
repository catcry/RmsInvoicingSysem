# AGENTS.md — RMS Invoicing System

## Project Overview

Spring Boot 3.5.16 (Java 21) backend + React 19 (TypeScript) frontend for roaming settlement/invoicing. Company: SuppTel.

## Build & Run

### Full build order

```bash
# 1. Build frontend (copies output to backend resources/static/)
cd "Backend/Invoicing System/src/main/Frontend Codebase"
npm install
npm run build

# 2. Build backend JAR
cd "Backend/Invoicing System"
./mvnw clean package -DskipTests

# 3. Run
java -jar target/InvoicingSystem-3.0.0.jar --spring.profiles.active=development
```

### Frontend only (dev server)

```bash
cd "Backend/Invoicing System/src/main/Frontend Codebase"
npm start  # runs on localhost:3000
```

### Run tests

```bash
cd "Backend/Invoicing System"
./mvnw test -Dspring.profiles.active=development
```

Tests require the `development` profile (connects to PostgreSQL at `172.29.11.110:5433/bonsett`). There is only one test file currently (`InvoicingSystemApplicationTests.java` — context-loads check).

**Important**: `./mvnw` is the Maven wrapper — no global Maven install needed.

## Repository Structure

The repo root is NOT the Maven project root. The actual project lives at:

```
RMS-Invoicing-System/
├── Backend/
│   └── Invoicing System/          ← Maven project root (has pom.xml, mvnw)
│       ├── src/main/java/com/supptel/invoicingsystem/
│       │   ├── config/            ← Security, CORS, JWT filter, exception handler
│       │   ├── controller/        ← REST controllers
│       │   ├── converter/         ← JPA type converters
│       │   ├── entity/            ← JPA entities
│       │   ├── enumeration/       ← Enums (StreamType, TapFileType, ExcludeIncludeType)
│       │   ├── record/            ← DTOs / response records
│       │   ├── repository/        ← Spring Data JPA repositories
│       │   ├── service/           ← Business logic
│       │   ├── Utils.java
│       │   └── InvoicingSystemApplication.java  ← Entry point
│       ├── src/main/Frontend Codebase/  ← React app (CRA + TypeScript + MUI)
│       ├── src/main/resources/
│       │   ├── application.properties
│       │   ├── application-development.properties
│       │   ├── application-production.properties
│       │   └── static/            ← Frontend build output (gitignored)
│       └── src/test/java/
└── Documents/
    ├── api-docs.json              ← OpenAPI spec snapshot
    └── howtorun.md
```

## Key Architecture Notes

### Backend

- **Package**: `com.supptel.invoicingsystem`
- **Database**: PostgreSQL, JPA/Hibernate with `ddl-auto=update` (schema auto-migrates)
- **Auth**: Stateless JWT. Token via `POST /login`, then `Authorization: Bearer <token>` header. 30-min expiration.
- **Security**: `@PreAuthorize("hasAnyRole('ADMIN', 'USER')")` on most endpoints. `/login`, `/stop`, static assets, and Swagger are public.
- **CORS**: Wide open (`*`) — configured in `SecurityConfig.java`.
- **API docs**: SpringDoc OpenAPI at `/swagger-ui/**` and `/v3/api-docs/**` (disabled in production profile).
- **Lombok**: Used across entities and records — annotations like `@Data`, `@Builder`, etc. are not visible in some records but the annotation processor is configured.
- **Profiles**: `development` (local DB at 172.29.11.110:5433) and `production` (192.168.5.84:7432). Swagger disabled in production.
- **Logging**: Console in dev, rolling file in production (`logs/backend.log`).

### Frontend

- **Location**: `src/main/Frontend Codebase/` (path has spaces — quote it in shell commands)
- **Stack**: React 19, TypeScript, MUI v6, React Router v7, TanStack React Query, Formik + Yup, Axios, styled-components, Bootstrap
- **Build output**: `npm run build` builds React, then copies `index.html`, `static/*`, and images to `../resources/static/`. The static directory is gitignored.
- **Serving**: `ReactAppController.java` serves `static/index.html` as a catch-all for any non-file route (SPA routing).
- **State**: JWT stored in `sessionStorage`. Token expiry checked in `App.tsx` on load.

### Domain Concepts

- **Settlements**: Inbound/outbound statement processing. Stream types: II (Inbound Inbound), IO, NI, NO. Tap file types: TAP_IN, TAP_OUT.
- **Entities**: InboundStatement, OutboundStatement, InOutStatement, BaseAggregation, InternationalOutboundSummary, Country, Operator, User (with roles), ProfileView.
- **CSV Upload**: `POST /api/upload-csv` — multipart file upload for inbound statements.

## Gotchas

- **Frontend path has spaces**: Always quote `"Frontend Codebase"` in shell commands.
- **Maven wrapper**: Use `./mvnw` not `mvn`. The wrapper is at `Backend/Invoicing System/mvnw`.
- **Frontend build modifies backend resources**: `npm run build` deletes and recreates `src/main/resources/static/`. Don't modify that directory manually.
- **No test coverage**: Only a context-loads test exists. New endpoints should get tests.
- **`static/` is gitignored**: The frontend build artifacts are not in git. You must build the frontend before the backend JAR works end-to-end.
- **Hibernate `ddl-auto=update`**: Schema changes happen automatically on startup. Be cautious with entity changes in production.
- **`/stop` endpoint**: `ShutdownController` exposes a POST `/stop` that shuts down the app — it's public (no auth). Security-sensitive.
- **JWT secret**: Falls back to `defaultSecretKey` if `JWT_SECRET` env var is not set. Never commit real secrets.
- **Database credentials in properties files**: `application-development.properties` and `application-production.properties` contain hardcoded DB credentials. Treat these as needing external override in real deployments.
