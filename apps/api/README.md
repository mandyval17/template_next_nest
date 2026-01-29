# API (NestJS)

- **Port:** `API_PORT` or 4000
- **DB:** MongoDB (Prisma). Use `DATABASE_URL` in `.env`. For local replica set see root `docker-compose.yml` and README.
- **Auth:** JWT (access + refresh), httpOnly cookies. Env: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES`.
- **Optional:** `CORS_ORIGIN` (default `http://localhost:3000`), `COOKIE_DOMAIN`.

## Commands

- `npm run start:dev` – watch mode
- `npm run build` – build
- `npm test` – unit tests
- `npm run test:e2e` – e2e (requires MongoDB)
- `npm run lint` – ESLint
- `npm run format` – Prettier
- `npm run prisma:dbpush` – push schema to DB
- `npm run prisma:studio` – Prisma Studio

## Endpoints

- `GET /health` – health check
- `POST /auth/register` – register
- `POST /auth/login` – login (sets cookies)
- `POST /auth/logout` – logout (requires auth)
- `POST /auth/refresh` – refresh tokens (cookie)
- `GET /auth/me` – current user (requires auth)
- `GET /examples` – list examples
- `POST /example` – create example
