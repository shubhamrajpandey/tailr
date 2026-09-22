# AGENT.md

This file gives any AI coding agent (Claude, Cursor, Copilot, etc.) the
context needed to work correctly in this repository. Read this before
making changes.

## Project

Production-grade authentication backend: Login + Signup with email OTP
verification, JWT access/refresh tokens, and secure cookie handling.

## Stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Runtime    | Bun                              |
| Framework  | Elysia.js                        |
| Database   | PostgreSQL                       |
| ORM        | Drizzle ORM                      |
| Auth       | @elysiajs/jwt + HttpOnly cookies |
| Email      | Resend (swap-able)               |
| Passwords  | Bun.password (argon2id)          |

## Folder structure

```
src/
  config/
    env.ts              # validated, typed environment config — read this first
  db/
    schema.ts            # Drizzle tables: users, otps, refresh_tokens
    client.ts             # pooled Postgres connection (singleton)
    migrate.ts             # migration runner
  modules/
    auth/
      auth.model.ts         # Elysia `t.Object` request validation schemas
      auth.service.ts        # ALL business logic + DB queries live here
      auth.routes.ts           # HTTP layer only: parses request, calls service, shapes response
  middleware/
    authGuard.ts            # protects routes requiring a valid access token
    rateLimit.ts              # in-memory fixed-window limiter (swap for Redis at scale)
    errorHandler.ts             # single source of truth for error response shape
  utils/
    password.ts                  # hashing + strength validation
    otp.ts                        # OTP generation/hashing
    email.ts                       # transactional email sending
  index.ts                          # app composition root
drizzle.config.ts
.env.example
```

## Architectural rules — follow these when adding code

1. **Controller/route files never touch the database directly.**
   Routes call `authService.*` functions. All Drizzle queries live in
   `*.service.ts`. This keeps HTTP concerns and business logic separable
   and testable.
2. **Every new input-accepting route needs an Elysia `t.Object` schema**
   in the matching `*.model.ts` file. Never trust `body` without one.
3. **Never return raw errors to the client.** Throw `AppError` (see
   `middleware/errorHandler.ts`) with a real HTTP status code and a
   stable `code` string the frontend can branch on. Unhandled errors are
   caught centrally and logged server-side only.
4. **Secrets only via `env.ts`.** Never read `process.env` directly in
   route/service files — add the variable to `env.ts` (and
   `.env.example`) so missing config fails at boot, not mid-request.
5. **Refresh tokens are HttpOnly cookies. Access tokens are not.**
   Don't change this. The access token is short-lived and meant to live
   in memory on the client; only the refresh token touches a cookie,
   scoped to `/auth` and `Secure` in production.
6. **Passwords and OTP codes are always hashed before storage.** Never
   log or persist a raw password or raw OTP.
7. **Rate-limit any new public auth-adjacent endpoint** using the
   `rateLimit()` middleware factory — brute force is the default threat
   model for this service.

## Common tasks

- **Add a new protected route:** `new Elysia().use(authGuard).get(...)`
  — `userId` is then available in context, already verified.
- **Add a new environment variable:** add it to `.env.example` with a
  comment, then to `src/config/env.ts` (use `required()` if it's
  mandatory).
- **Change token lifetimes:** `JWT_ACCESS_EXPIRY` / `JWT_REFRESH_EXPIRY`
  in `.env` — do not hardcode expiry in route files.
- **Run migrations:** `bun run db:generate` then `bun run db:migrate`.

## What NOT to do

- Don't store JWTs (access or refresh) in `localStorage` — this is an
  intentional XSS mitigation; refresh lives in an HttpOnly cookie only.
- Don't add a third-party auth dependency without checking it supports
  Bun's runtime.
- Don't bypass `authService` and query Drizzle directly from a route.
