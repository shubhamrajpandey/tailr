# CLAUDE.md

Instructions for Claude Code (and Claude acting as a coding agent) when
working in this repository. This file is Claude-specific; for
stack/architecture context that applies to any agent, read `AGENT.md`
first — everything there still applies here.

## Before doing anything

1. Read `AGENT.md` for architecture and folder-structure rules.
2. Read `src/config/env.ts` to see what environment variables exist.
3. Check `.env.example` — if `.env` is missing locally, copy it:
   `cp .env.example .env` and fill in real values before running.

## Commands Claude should use

```bash
bun install              # install dependencies
bun run dev               # start dev server with hot reload
bun run db:generate        # generate a new Drizzle migration after schema.ts changes
bun run db:migrate          # apply migrations to the database
bun run db:studio            # open Drizzle Studio to inspect data
```

Do not use `npm` or `yarn` in this repo — it is a Bun project
(`bun.lockb` is the lockfile of record). Do not introduce Express,
Fastify, or other Node HTTP frameworks; the entire app is built on
Elysia's plugin/derive model.

## When asked to add or modify a route

Follow this exact order, matching the existing `auth` module:

1. Add/update the request schema in `<module>.model.ts` using Elysia's
   `t.Object`.
2. Add/update the business logic in `<module>.service.ts`. This is
   where Drizzle queries, hashing, and validation errors (`AppError`)
   live. Service functions should be framework-agnostic — no `set`,
   `cookie`, or Elysia context objects here.
3. Wire it up in `<module>.routes.ts`: parse `body`/`params`, call the
   service, shape the HTTP response. Keep this file thin.
4. If the route is public-facing and auth-adjacent (login, signup,
   otp, password reset), wrap it with `.use(rateLimit("route-name", n))`.
5. If the route requires a logged-in user, wrap it with
   `.use(authGuard)` and read `userId` from context — don't re-verify
   JWTs manually in the route.

## Database changes

Never hand-edit generated SQL in `/drizzle`. To change the schema:
1. Edit `src/db/schema.ts`.
2. Run `bun run db:generate` to produce a new migration file.
3. Review the generated SQL before running `bun run db:migrate`.

## Security invariants Claude must preserve

These are intentional and should not be "simplified" away:

- Passwords hashed with `Bun.password` (argon2id) — never bcrypt-in-JS,
  never plaintext, never logged.
- OTP codes are hashed before storage and rate-limited on resend.
- Refresh tokens are stored server-side (hashed) in `refresh_tokens` so
  they can be revoked on logout — don't switch to a stateless-only
  refresh flow.
- Refresh token cookie: `httpOnly: true`, `secure: env.isProd`,
  `sameSite: "lax"`, scoped to `path: "/auth"`.
- Login and signup return generic error messages ("Invalid email or
  password") — do not change these to reveal whether an email exists
  in the system (user enumeration protection).
- All error responses go through `middleware/errorHandler.ts` — don't
  return raw `error.message` or stack traces from a route handler
  directly.

## Testing changes

There is no test suite scaffolded yet. If asked to add tests, use
`bun:test` (Bun's built-in test runner) and mirror the `src/` structure
under `src/**/*.test.ts` — do not introduce Jest or Vitest.

## Style

- TypeScript strict mode is on — don't add `any` to silence errors; fix
  the type.
- Use the `@/` path alias (see `tsconfig.json`) instead of relative
  `../../..` imports.
- Keep comments focused on *why*, not *what* — the existing files in
  this repo (e.g. `auth.service.ts`) are the tone/style reference.
