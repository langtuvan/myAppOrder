# Booking Backend

NestJS + MongoDB platform for bookings with modular domains (auth, RBAC, booking, reception, catalog, users, rooms, amenities, etc.), global validation, Swagger docs, and daily reception seeding.

## Features

- Modules: auth, users/roles/permissions (CASL), categories/products/product services, booking/reception/orders/items/rooms/amenities, customers/exams/faculty, health, logger.
- Security: JWT auth, CASL RBAC guard, request validation/whitelisting, global error interceptor for Mongoose.
- Docs: Swagger at `/api/docs` with grouped tags; static client served from `src/client`.
- Ops: CORS configurable via `CORS_ORIGIN`; daily cron seeds up to 15 example receptions at 01:00; PM2/Node friendly.

## Quick Start

1. Install deps (pnpm recommended): `pnpm install` (or `npm install`).
2. Create `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booking-db
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=change-me
```

3. Run dev: `pnpm start:dev` (or `npm run start:dev`).
4. Swagger UI: http://localhost:5000/api/docs

## Scripts

- `start:dev` – watch mode.
- `start` – production start (after build).
- `start:prod` – build + run.
- `build` – compile TypeScript.
- `start:debug` – debug mode.

## Environment

- Core: `PORT`, `MONGODB_URI`, `NODE_ENV`.
- Security: `JWT_SECRET` (and related JWT settings if configured elsewhere).
- CORS: `CORS_ORIGIN` supports semicolon-separated origins.

## Notes

- Global prefix `api` is set; all routes sit under `/api/*`.
- Guards order: JWT guard runs first, then CASL guard evaluates `@CheckPermission` metadata.
- Reception seeder runs daily; ensure prerequisite sample data (customers/faculties/users) exists if you rely on the examples.

## Contributing

- Fork, branch, commit, and open a PR. Keep lint/type checks passing and include tests where applicable.
