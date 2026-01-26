# Booking Backend Review & Summary

## Snapshot

- NestJS + MongoDB backend with modular domain layout (auth, role/permission, booking, reception, etc.), global validation pipe, CASL-based RBAC, and Swagger enabled under /api/docs.
- Global guards: JWT then CASL; global interceptors: faculty selection and mongoose error normalization. Static assets served from `src/client`.

## Findings (ordered by severity)

1. CASL guard action/subject reversed: guard calls `ability.can(subject, action)`, but abilities are defined as `can(action, resource)`. Any protected route will deny legitimate access when permissions exist. Ref: [src/casl/casl.guard.ts](src/casl/casl.guard.ts#L57-L63).
2. Duplicate module import: `DatabaseModule` is registered twice in `AppModule` (seeding/initialization may run twice, creating duplicate records or extra connections). Ref: [src/app.module.ts](src/app.module.ts#L50) and [src/app.module.ts](src/app.module.ts#L74).

## Suggested fixes

- Swap CASL check to `ability.can(action, subject)` to align with ability definitions; add a CASL unit/e2e test covering a permitted action to prevent regression.
- Remove the second `DatabaseModule` import (keep only one in the imports array) to avoid double initialization/seeding.

## Quick context

- Entrypoint config in [src/main.ts](src/main.ts) enables CORS (multi-origin via `CORS_ORIGIN`), cookie parsing, validation with whitelisting/transforming, and Swagger setup.
- RBAC: abilities constructed per user role/permissions in [src/casl/casl-ability.factory.ts](src/casl/casl-ability.factory.ts), with a super-admin escape hatch (`manage all`).
