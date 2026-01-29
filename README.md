# Omni Site

Monorepo template with **Next.js** (frontend), **NestJS** (API), **TypeScript**, **Zod**, **MUI**, **TanStack Query**, **Prisma**, **MongoDB**, **JWT auth** (cookies + refresh tokens), and **axios**.

## Stack

| Layer    | Tech                                                                |
| -------- | ------------------------------------------------------------------- |
| Frontend | Next.js (App Router), MUI, Zod, TanStack Query, axios, auth hooks   |
| Backend  | NestJS, Prisma, MongoDB, JWT, cookies, refresh tokens (store in DB) |
| Language | TypeScript                                                          |

## Setup

```bash
npm install
```

**1. MongoDB (local, replica set)**  
Prisma + MongoDB requires a **replica set** (even for single-node). Use Docker Compose:

```bash
docker compose up -d mongodb && docker compose run --rm mongo-init
```

Then set `DATABASE_URL=mongodb://localhost:27017/omni` in `apps/api/.env`.  
Alternatively, use **MongoDB Atlas** (free tier has replica set by default).

**2. API env**  
Copy `apps/api/.env.example` to `apps/api/.env`, set `DATABASE_URL` and JWT secrets, then:

```bash
cd apps/api && npx prisma db push
```

**3. Run**

```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

**4. Auth**

- Register at http://localhost:3000/register
- Login at http://localhost:3000/login
- Access token and refresh token are stored in **httpOnly cookies**.
- Refresh tokens are stored in **MongoDB** and invalidated on logout.

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Run web + API in dev (concurrently) |
| `npm run dev:web`       | Next.js dev server (port 3000)      |
| `npm run dev:api`       | NestJS dev server (port 4000)       |
| `npm run build`         | Build all apps                      |
| `npm run build:web`     | Build Next.js only                  |
| `npm run build:api`     | Build NestJS only                   |
| `npm run start:web`     | Start Next.js (production)          |
| `npm run start:api`     | Start NestJS (production)           |
| `npm run prisma:dbpush` | Push Prisma schema to MongoDB (API) |

## Project structure

### Next.js (`apps/web/`)

```
app/
  (app)/
  (auth)/
  layout.tsx
  globals.css
components/
  features/example/
    ExampleForm.tsx
    ExampleList.tsx
  providers/
    AuthProvider.tsx
    QueryProvider.tsx
hooks/
  useAuth.ts
lib/
  api/
    axios.ts
    auth.api.ts
    example.api.ts
  services/
    auth.service.ts
    example.service.ts
  query/keys.ts
  tanstack/useCustomQuery.ts
  validations/
  constants.ts
  theme.ts
  utils/
    cn.ts
    date.ts
    string.ts
```

### NestJS (`apps/api/`)

```
src/
  modules/
    auth/                # JWT, cookies, refresh in DB
      auth.controller    # POST login, logout, refresh; GET me; POST register
      auth.service       # validate, login, logout, refresh, me
      dto/               # Login, Register, MeResponse
      jwt.strategy       # extract from cookie or Bearer
      jwt-auth.guard
      cookie.util
    health/              # GET /health
    example/             # GET /examples, POST /example
  prisma/
  app.module.ts
  main.ts
prisma/
  schema.prisma          # MongoDB: User, RefreshToken, Example
```

## Auth flow

- **Login:** `POST /auth/login` with `{ email, password }` → sets `access_token` and `refresh_token` httpOnly cookies, returns `{ user }`.
- **Refresh:** `POST /auth/refresh` (no body; sends refresh cookie) → new access + refresh, new cookies.
- **Logout:** `POST /auth/logout` (access cookie or Bearer) → deletes refresh tokens in DB, clears cookies.
- **Me:** `GET /auth/me` (access cookie or Bearer) → `{ id, email }`.

Axios uses `withCredentials: true`. On 401, the client calls `/auth/refresh` and retries the request.

## Env

- **API:** `DATABASE_URL` (MongoDB), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES` (e.g. `15m`), `JWT_REFRESH_EXPIRES` (e.g. `7d`), optional `API_PORT` (default `4000`).
- **Web:** Optional `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

Use `apps/api/.env.example` as a template.
