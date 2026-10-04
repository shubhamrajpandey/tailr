 # CODE QUALITY AUDIT REPORT

**Project/File:** Tailr — Full-Stack (tailr-frontend + tailr-backend)
**Language/Framework:** TypeScript · Next.js 16 (App Router) · React 19 · Tailwind v4 · ElysiaJS · Bun · Drizzle ORM · PostgreSQL
**Audit Date:** October 4, 2026
**Auditor:** Antigravity (Strict Mode)

---

## SCORECARD SUMMARY

| # | Category | Score | Grade |
|---|----------|-------|-------|
| 1 | Code Structure & Organization | 6/10 | C |
| 2 | Naming Conventions | 7/10 | B- |
| 3 | Code Readability & Clarity | 6/10 | C |
| 4 | Comments & Documentation | 6/10 | C |
| 5 | Error Handling & Resilience | 5/10 | D |
| 6 | Security | 5/10 | D |
| 7 | Performance & Efficiency | 4/10 | F |
| 8 | Testing & Testability | 2/10 | F |
| 9 | SOLID & Design Principles | 5/10 | D |
| 10 | Dependency Management | 6/10 | C |
| 11 | Scalability & Maintainability | 5/10 | D |
| 12 | Consistency & Code Style | 6/10 | C |
| 13 | Logging & Observability | 3/10 | F |
| 14 | Configuration & Environment | 6/10 | C |
| 15 | Overall Architecture & Patterns | 6/10 | C |
| | **TOTAL** | **82/150** | **D** |

---

## OVERALL VERDICT

**Score:** 82/150 (55%)
**Grade:** D
**Production Ready:** NO

This codebase shows the DNA of a developer who understands *what* good architecture looks like — layered backend, token rotation, service/controller separation — but has not followed through with the discipline to actually execute it. The backend auth module is genuinely solid. Everything else ranges from mediocre to broken. The frontend's primary data layer is **localStorage**, the middleware performs client-side-only JWT validation that is trivially bypassed, there is an access token set as a non-HttpOnly cookie with a 7-day lifetime that defeats its own stated purpose, the app is deployed and completely non-functional, page files regularly exceed 600–800 lines, and the test suite covers exactly three files with zero integration coverage. Ship this as-is and you will embarrass yourself.

---

## DETAILED FINDINGS

### 1. Code Structure & Organization — 6/10

**What's wrong:**
- `app/(dashboard)/resume/page.tsx` is **22KB / ~600 lines**. One file is doing layout, state management, section rendering, and form logic simultaneously. This violates your own `AGENTS.md` 500-line rule.
- `app/(dashboard)/cover-letter/page.tsx` is **29KB / ~800 lines**. This is a god component. It has no excuse to exist at this size.
- `use-applications.ts` is **404 lines** for a hook. It contains a 120-line hardcoded sample data factory with real company names baked in — this belongs in a `fixtures/` directory or a seeding script, not a production hook.
- `shared/lib/api-client.ts` and `shared/lib/auth-api-client.ts` are two parallel API client files with diverging patterns. `api-client.ts` uses raw `fetch`. `auth-api-client.ts` uses Axios with interceptors. There is no single source of truth.
- The backend has a file named `auth.controller.ts` *and* `auth.routes.ts` — both contain controller logic. The controller handles cookie manipulation directly (setting, removing), which is an HTTP-layer concern that bleeds into what should be pure business delegation.
- `/resumes` (plural) and `/resume` (singular) both exist as protected routes in middleware. This is duplicated navigation with no redirect between them.

**What's right:**
- Domain-based folder structure (`applications/`, `resume/`, `cover-letter/`) in the frontend is correct.
- Backend module structure (`service` / `controller` / `routes` / `model`) is the right pattern.
- `shared/` directory separation from page-level code is correct.

**Required fixes:**
- Split `resume/page.tsx` and `cover-letter/page.tsx` into section-level subcomponents immediately.
- Extract the sample data factory in `use-applications.ts` into `shared/fixtures/sample-applications.ts`.
- Delete `api-client.ts` or convert it to use `authApiClient`. Pick one client.
- Redirect `/resumes` → `/resume` and remove the plural from `middleware.ts`.

---

### 2. Naming Conventions — 7/10

**What's wrong:**
- `getSnapshot` / `getServerSnapshot` in `use-applications.ts` (lines 14, 38) — these are `useSyncExternalStore` callbacks. The names are fine in isolation but the file gives no signal that this hook is implementing an external store subscription pattern. An engineer reading it cold will be confused.
- `d` as a variable name in `loadSampleApplications` (line 267) — `d` is a single-letter function for date arithmetic. This is exactly the abbreviation abuse the audit criteria targets.
- `jwtAccess: any` and `cookie: any` typed parameters throughout `auth.controller.ts` — naming is correct but the `any` typing is a naming/typing failure. These should be properly typed with Elysia's context types.
- Backend has `auth.controller.ts` but the AGENT.md only documents `auth.routes.ts` → `auth.service.ts`. The controller layer is undocumented in the architecture doc.
- `tempId` in `createApplication` (line 137) is fine, but the optimistic update pattern it enables is never communicated to the user if the server sync fails — the name promises temporariness but the behavior doesn't deliver on that promise.

**What's right:**
- File naming is consistently `kebab-case.tsx` throughout.
- Hook naming follows `use-kebab-case.ts` / `useCamelCase` export convention correctly.
- Backend error classes (`BadRequestError`, `UnauthorizedError`, `ConflictError`) are precise and expressive.
- Redux slice actions (`setCredentials`, `clearCredentials`, `setAuthStep`) are named with intent.

**Required fixes:**
- Rename `d` in `loadSampleApplications` to `daysAgo` or `offsetDate`.
- Type `jwtAccess` and `cookie` parameters in `auth.controller.ts` with Elysia's actual context types.

---

### 3. Code Readability & Clarity — 6/10

**What's wrong:**
- `verifyOtp` in `auth.service.ts` (line 120): `const code = input.code || input.otp;` — the schema allows both `code` and `otp` as field names for the same thing. This is ambiguous. Pick one. Both `VerifyOtpBody` in the model and `body.code || body.otp` in two separate files create confusion about what the canonical field name is.
- `auth.routes.ts` uses `(ctx) => authController.signup(ctx as any)` — the `as any` cast on every single route handler is a readability and type-safety disaster. This pattern appears 7 times across this file alone.
- `use-applications.ts` mixes three concerns in one hook: `useSyncExternalStore` subscription management, backend sync on mount, and all CRUD operations. A developer joining the project cannot understand what this hook does from its signature alone.
- `cookie.ts` line 28–31: sets TWO cookies (`tailr_access_token` AND `accessToken` alias) "for compatibility" with no comment explaining what it's compatible with. This is stealth technical debt.
- Dashboard `page.tsx` line 35: `const weeklyDelta = applications.length > 0 ? "+14% vs last week" : "0% vs last week"` — a magic hardcoded string disguised as computed data. Anyone reading this assumes it's real.
- `errorHandler` in `error.ts` uses `(error as any)?.statusCode` — triple `any` casting in a centralized error handler is unacceptable. If you defined `HttpError`, use `instanceof` cleanly.

**What's right:**
- The auth service methods are well-decomposed and individually readable.
- The Redux slice is clear, concise, and well-commented.
- `middleware.ts` logic flow (`isProtectedRoute` → `isAuthRoute` → redirect) is easy to follow.

**Required fixes:**
- Remove all `ctx as any` casts from `auth.routes.ts`. Use Elysia's typed context properly.
- Pick one field name for the OTP code (`code` or `otp`) and enforce it in the Zod/TypeBox schema.
- Replace `(error as any)` in `errorHandler` with proper `instanceof HttpError` checks.
- Delete the hardcoded `"+14%"` metric immediately.

---

### 4. Comments & Documentation — 6/10

**What's wrong:**
- Backend `auth.controller.ts` has zero inline comments on the cookie manipulation logic (lines 11–31), which is among the most security-sensitive code in the entire project. The cookie options silently set `maxAge: 7 * 24 * 60 * 60` — but the access token is supposed to be short-lived (15 minutes). Giving it a 7-day cookie lifetime completely contradicts the stated security model and there's no comment calling attention to this discrepancy.
- `use-applications.ts` line 32–34: `catch { // fallback }` — a silent swallow with a useless comment.
- `use-applications.ts` line 78: `catch { // ignore }` — same. Two separate `catch` blocks that swallow errors silently with non-comments.
- `AGENT.md` for the backend does not mention the `auth.controller.ts` layer, making the documented architecture inaccurate.
- No JSDoc on any exported hook (`useApplications`, `useDashboardData`, etc.). These are the public API of the shared layer.
- No API contract documentation between frontend and backend beyond Swagger — no typed response schemas shared across the boundary.

**What's right:**
- `auth-api-client.ts` has an excellent module-level JSDoc block explaining the security invariants and interceptor behavior (lines 1–16). This is exactly what every complex file should have.
- `auth-slice.ts` has precise comments on every action explaining why each exists.
- Backend `auth.service.ts` has per-method JSDoc that is accurate and informative.

**Required fixes:**
- Document the `getAccessTokenCookieOptions` function with a comment explaining why the access token cookie has a 7-day lifetime and whether this is intentional.
- Replace all `catch { // ignore }` and `catch { // fallback }` with either real error handling or at minimum `console.warn` with context.
- Add JSDoc to all exported hooks in `shared/hooks/`.

---

### 5. Error Handling & Resilience — 5/10

**What's wrong:**
- `use-applications.ts` `createApplication` (lines 191–193): when the backend API call fails after the optimistic update is already written to localStorage, the function returns the optimistic record with the temp `app-${Date.now()}` ID. The user sees the item, believes it was saved, navigates away, refreshes — and the item disappears because it was never persisted. **There is no rollback, no error toast, no user notification of any kind.** This is a silent data loss bug.
- `use-applications.ts` `updateApplication` (lines 222–227): patches are fire-and-forget. If the PATCH fails, the local state and server state are permanently diverged. No retry, no rollback, no user feedback.
- `use-applications.ts` `deleteApplication` (lines 255–259): same pattern. Delete from local state immediately, send DELETE request and swallow the error. If the server call fails, the item reappears on next sync — confusing to the user.
- Frontend has **zero error boundaries**. Any unhandled exception in a dashboard component will crash the entire app with Next.js's default white screen. No `error.tsx` files exist in any route segment.
- `cookie.ts` `getSnapshot` (lines 32–34): catches JSON.parse failures and returns `[]` silently. Corrupted localStorage data produces no user feedback.
- `auth.routes.ts` line 27: `.use(authGuard)` is applied globally to the router, then individual routes don't use it. The `authRateLimiter` and `otpResendRateLimiter` are applied mid-chain (lines 71, 91) after some routes are already registered. **The order of Elysia `.use()` middleware registration is sequential and scoped** — routes registered before the `.use()` call do NOT get that middleware. `signup` and `verify-otp` are registered BEFORE `authRateLimiter`. This means those routes have no rate limiting.

**What's right:**
- Backend error hierarchy (`HttpError` → `BadRequestError`, etc.) is correctly structured.
- Refresh token rotation logic properly handles the expired/revoked case.
- OTP replay attack prevention (marking as `consumedAt`) is correct.

**Required fixes:**
- Implement rollback in `createApplication` — if the backend call fails, remove the optimistic item from localStorage and show an error toast.
- Add `error.tsx` to every dashboard route segment.
- Fix the Elysia middleware registration order — apply `authRateLimiter` BEFORE the signup/login routes.
- Add a global React error boundary in the root layout.

---

### 6. Security — 5/10

**What's wrong:**
- **Access token stored in a non-HttpOnly cookie with a 7-day lifetime.** `getAccessTokenCookieOptions()` in `auth.controller.ts` (line 22–31) sets `httpOnly: false`. A JavaScript-accessible cookie containing a JWT is readable by any XSS payload on the page. The `AGENT.md` explicitly says "Don't store JWTs in localStorage" — but storing them in a non-HttpOnly cookie provides the **same XSS attack surface**. The `cookie.ts` client-side utility also writes this cookie directly from the browser. This is a fundamental security model contradiction.
- **Middleware JWT validation is client-side only.** `middleware.ts` `isTokenValid()` (lines 24–37) decodes the JWT in Next.js edge middleware using `atob()` — it verifies the expiry timestamp but **does NOT verify the signature**. A forged JWT with a valid expiry and any payload will pass this check and grant access to all protected routes. Actual signature verification only happens when the backend's `authGuard` runs, which is only on API calls.
- **`ctx as any` in all route handlers** strips Elysia's compile-time type safety. This means the TypeBox schema validation is active at runtime, but TypeScript cannot catch mismatches at build time.
- `cookie.ts` (lines 28–31): writes a duplicate `accessToken` alias cookie "for compatibility." This doubles the attack surface with no documented justification.
- `env.ts` (lines 33–34): JWT secrets have hardcoded development fallbacks with no minimum entropy check. The fallback `"default_dev_access_secret..."` is exactly 48 characters of known plaintext — anyone who deploys without setting the env var gets a predictable secret.
- **No CSRF protection beyond `SameSite=Lax`.** For cross-site requests via GET (which `SameSite=Lax` does not block), the application has no CSRF token mechanism.
- `next.config.ts` has **no security headers** — no `X-Frame-Options`, no `X-Content-Type-Options`, no `Content-Security-Policy`, no `Referrer-Policy`. The app is clickjackable.

**What's right:**
- Refresh token is stored HttpOnly, which is correct.
- Argon2id with proper memory/time cost parameters is best-in-class for password hashing.
- OTPs are SHA-256 hashed before storage — raw OTPs never touch the database.
- Token rotation on refresh (old token revoked, new one issued) is correctly implemented.
- Production env validation at startup for required secrets.

**Required fixes:**
- Change the access token cookie to `httpOnly: true` — or stop storing it in a cookie entirely and keep it only in Redux memory (which is what the auth slice comment says it should be doing).
- Add cryptographic signature verification to `middleware.ts` `isTokenValid()`, or replace the middleware check with an actual `/auth/validate` server call.
- Add security headers to `next.config.ts`.
- Remove the `accessToken` alias cookie from `cookie.ts`.

---

### 7. Performance & Efficiency — 4/10

**What's wrong:**
- **localStorage as the primary data store** for job applications is an architectural performance anti-pattern. localStorage is synchronous, blocking the main thread on every read/write. The app serializes and deserializes a potentially large array of applications on every mutation (`JSON.stringify(next)` / `JSON.parse(raw)`). As application count grows, this introduces measurable jank.
- **No pagination on the applications list.** The hook fetches ALL applications from the backend (`GET /applications` with no `?limit=` or `?cursor=`) and stores the entire result in localStorage. At 500+ applications, this is a memory and parse-time problem.
- **`useSyncExternalStore` subscription re-renders** the entire applications list on EVERY `storage` event, including storage events from unrelated keys. There's no key filtering — any tab's localStorage write triggers a full re-render.
- **`syncApplications` is called on every change of `isAuthenticated` or `accessToken`** (line 125 effect dependency). If the token refreshes silently, this triggers a full re-fetch of all applications. This is unnecessary — only trigger sync on mount and explicit user action.
- **Duplicate cookie writes on every auth operation.** `setAuthCookie` writes two cookies (`tailr_access_token` + `accessToken`). Every login, OTP verify, and refresh fires two `document.cookie` writes.
- The `persistRefreshToken` function in `auth.service.ts` (line 253) hardcodes `7 * 24 * 60 * 60 * 1000` instead of reading from `env.JWT_REFRESH_EXPIRY`. If someone changes the env var, the database expiry stays at 7 days regardless.
- There is no query result caching (TanStack Query is installed but not used for applications — it's wasted in `package.json` relative to actual usage).

**What's right:**
- Module-level `cachedSnapshot` / `cachedRaw` in `use-applications.ts` avoids redundant JSON.parse on repeated reads with the same data.
- Elysia's native handler is lightweight and non-blocking for backend routes.

**Required fixes:**
- Move applications to TanStack Query with proper pagination — kill the localStorage primary storage pattern.
- Filter the `storage` event in the `subscribe` function to only react to `tailr_applications_v2` key changes.
- Remove the `accessToken` dependency from the `syncApplications` effect. Sync on mount and user-triggered refresh only.
- Read refresh token expiry from `env.JWT_REFRESH_EXPIRY` in `persistRefreshToken`.

---

### 8. Testing & Testability — 2/10

**What's wrong:**
- **Zero integration tests.** The three test files that exist (`auth.test.ts`, `quota.test.ts`, `routes.test.ts`) test utility functions and error class constructors in isolation. Not a single test exercises an actual HTTP endpoint against a real or mock database.
- **Zero frontend tests.** No unit tests, no component tests, no E2E tests exist for the Next.js frontend. Zero. The entire frontend — auth flows, application CRUD, resume editing — is entirely untested.
- `auth.test.ts` tests that `BadRequestError.statusCode === 400`. This is a class property assignment test. It provides zero confidence in the actual auth system behavior.
- The `AuthService` class, which contains all critical business logic (signup, login, OTP verification, token rotation), has zero direct unit tests. The only way to test it is through a live database.
- **The hook `useApplications` is completely untestable** as written — it couples localStorage, Redux state, window events, and API calls in a single 404-line hook with no dependency injection. You cannot mock any of its dependencies without extensive wrapper setup.
- No testing infrastructure is set up on the frontend (`package.json` has no test runner, no Vitest, no Jest, no Playwright).
- The `loadSampleApplications` function in the production hook suggests the developer was manually testing in the browser instead of writing tests.

**What's right:**
- Bun's native test runner is used correctly (no unnecessary `jest` dependency).
- The tests that exist are syntactically correct and would pass.
- Utility functions (`generateNumericOtp`, `hashToken`, `generateSecureRandomToken`) are pure and testable.

**Required fixes:**
- Add Vitest + React Testing Library to the frontend immediately.
- Write integration tests for every auth endpoint using a test database.
- Split `useApplications` into smaller, injectable pieces so individual concerns can be unit tested.
- Write at minimum: a login success test, a login failure test, an OTP expiry test, a token refresh test, and a token revocation test — all against the actual route handlers.

---

### 9. SOLID & Design Principles — 5/10

**What's wrong:**
- **SRP violated massively in `useApplications`.** This hook is responsible for: (1) localStorage subscription, (2) backend sync on mount, (3) optimistic create, (4) optimistic update, (5) optimistic delete, (6) status-specific update logic, (7) sample data generation. That is seven distinct responsibilities in one 404-line hook.
- **DRY violated in `auth.service.ts`.** The password hashing block with identical `algorithm`, `memoryCost`, and `timeCost` parameters appears twice (lines 43–47 and 62–66) — once for the update path, once for the create path. This should be extracted to a `hashPassword(password)` utility.
- **DRY violated in `cookie.ts`.** `setAuthCookie` performs the same cookie-string construction twice for two different cookie names. The cookie serialization logic should be a helper function.
- **DRY violated in every dashboard page.** The outer shell — `<div className="flex min-h-screen bg-slate-50 dark:bg-[#090a0c]...">`, `<Sidebar />`, `<TopBar />`, wrapping `<div className="flex-1 flex flex-col...">` — is copy-pasted verbatim across `dashboard/page.tsx`, `applications/page.tsx`, `analytics/page.tsx`, etc. The layout group has a `layout.tsx` file that renders nothing — it's a missed opportunity to extract this repeated shell into a shared layout.
- **OCP violated in `errorHandler`.** Adding a new error type (e.g., a rate limit error from a third-party) requires modifying the central error handler's if/else chain. A registration-based error handler would be open for extension.
- **Dependency Inversion violated in `useApplications`.** The hook directly imports and calls `authApiClient`. It should receive the API client as a parameter or via context, making it mockable.

**What's right:**
- Backend `AuthService` class correctly owns all business logic and is separate from the HTTP layer.
- Redux slice correctly has a single responsibility (auth state management).
- `HttpError` hierarchy correctly uses inheritance for extension.

**Required fixes:**
- Extract the page layout shell into `app/(dashboard)/layout.tsx` immediately — stop repeating it in every page.
- Extract `hashPassword` utility in `auth.service.ts`.
- Split `useApplications` into: `useApplicationsStore` (localStorage sync), `useApplicationsApi` (backend calls), `useApplicationsActions` (CRUD operations).

---

### 10. Dependency Management — 6/10

**What's wrong:**
- `@tanstack/react-query` and `@tanstack/react-query-devtools` are both in `dependencies` — the devtools package should be in `devDependencies` only.
- `@tanstack/react-query` is installed but barely used. The applications feature bypasses it entirely in favor of a custom localStorage store. This is a wasted 47KB+ bundle dependency.
- `i18next` and `react-i18next` are installed for internationalization. The only evidence of actual i18n usage is a `shared/i18n/` directory and a `body.lang-nepali` CSS class. This is almost certainly underdeveloped. If Nepali is a real requirement, it needs proper translation files and testing; if not, remove the dependency.
- `next: 16.3.5` — this is a recent version but is pinned with an exact version (`16.3.5`) in `devDependencies` for eslint but with `^` nowhere visible. Mixed pinning strategy.
- `lucide-react: ^1.47.0` — Lucide at v1.x. Verify this is the correct package — `lucide-react` is typically below v1. This may be tracking a fork or re-released package. If using the official Lucide, the version number is suspicious.
- No `engines` field in `package.json` specifying the required Bun/Node version.

**What's right:**
- Dependencies are generally lean for the feature set.
- Bun-native features (argon2id, test runner) are used instead of adding third-party equivalents.
- Zod for validation is appropriate and consistent.
- Redux Toolkit is the correct modern Redux pattern.

**Required fixes:**
- Move `@tanstack/react-query-devtools` to `devDependencies`.
- Either actually use TanStack Query for all server state OR remove it and commit to the custom store pattern.
- Audit `lucide-react` version.
- Add `engines` field to `package.json`.

---

### 11. Scalability & Maintainability — 5/10

**What's wrong:**
- **localStorage as primary application storage does not scale.** It is synchronous, has a 5–10MB per-origin limit, provides no server-side visibility, no multi-device sync, and no real-time updates. This is acceptable for a personal prototype but is a complete rebuild for any production scale.
- **Hardcoded company names in production code.** `loadSampleApplications` in `use-applications.ts` (lines 273–387) contains real company names (Fusemachines, CloudFactory, Leapfrog Technology, Docsumo, Cotiviti Nepal, Programiz) and real person names (Sameer Maskey, Mark Sears, Himal Karmacharya, Rushabh Sheth). This is demo data baked into a production hook. When this is eventually removed, it will be a risky delete.
- **Rate limiting is in-memory** (`rateLimit.ts` referenced in middleware, Elysia plugin). In-memory rate limiting does not survive server restarts and does not work across multiple backend instances. For any horizontal scaling, this becomes useless immediately.
- **The auth refresh lock (`isRefreshing` boolean)** in `auth-api-client.ts` is a module-level singleton. It works in a single browser tab. Open two tabs and trigger simultaneous 401s and you have a race condition between two instances of the interceptor, each with their own `isRefreshing = false` state.
- **No database migrations automated in CI.** Migrations must be run manually (`bun run db:migrate`). This is a deployment reliability risk.
- The `weeklyDelta` stat is hardcoded — any new developer adding analytics will not know to look here for the fake computation and will build on top of it.

**What's right:**
- Drizzle ORM provides good database maintainability with typed queries.
- The Elysia plugin pattern allows modular route attachment.
- Environment validation at boot catches missing config before requests start failing.

**Required fixes:**
- Move rate limiting to Redis in production.
- Migrate applications from localStorage to TanStack Query + backend as primary source of truth.
- Remove sample data from the production hook.
- Document the `isRefreshing` lock's multi-tab limitation.

---

### 12. Consistency & Code Style — 6/10

**What's wrong:**
- **No Prettier configured.** `package.json` has `eslint` but no `prettier`. Code style consistency is enforced only at lint level.
- **No pre-commit hooks.** Husky and lint-staged are documented in `AGENTS.md` as "worth doing" but never set up. AI-generated and manually written code reaches commits without any automated style enforcement.
- **Tailwind arbitrary values are rampant.** `dark:bg-[#090a0c]`, `bg-[#111216]/90`, `bg-[#15161c]`, `dark:border-white/[0.08]` appear in nearly every component. A `globals.css` with semantic tokens exists and defines `--background: #090a0c` for dark mode — but `bg-background` is unused in favour of the raw hex. This is a direct violation of the project's own `AGENTS.md` rules, stated explicitly at rule 7.
- **Inconsistent button patterns.** The `applications/page.tsx` uses `<Button variant="primary">`. The `dashboard/page.tsx` uses raw `<button type="button" className="h-9 px-3.5 inline-flex...">`. Both pages are in the same app. The shared `Button` component exists but is not consistently used.
- **Mixed `async/await` and `.then()/.catch()` chains.** `updateApplication` uses `.catch()` (line 224), while the rest of the codebase uses `async/await` with `try/catch`. Pick one.
- **Inconsistent `"use client"` placement.** Some files have it (pages, hooks), others (lib files) don't but still use browser APIs with `typeof window === "undefined"` guards.

**What's right:**
- TypeScript is used throughout with reasonable strictness.
- File naming convention is consistently `kebab-case.tsx`.
- Import organization is reasonably consistent (framework first, then shared, then local).

**Required fixes:**
- Install and configure Prettier with a `.prettierrc`.
- Set up Husky + lint-staged as documented in `AGENTS.md`.
- Replace all `dark:bg-[#090a0c]` instances with `dark:bg-background`.
- Standardize on `async/await` + `try/catch` everywhere.

---

### 13. Logging & Observability — 3/10

**What's wrong:**
- **Frontend has no structured logging whatsoever.** The only "logging" is `console.warn` calls in hook catch blocks — and half of those are swallowed with `catch { // ignore }` or `catch { // fallback }`.
- **Backend logging is a single `console.error("Unhandled Server Error:", error)`** in the catch-all error handler. There is no request logging, no response time logging, no user ID context in logs, no correlation/request IDs, nothing that would help debug a production issue.
- There is no HTTP access log (no Morgan, no Elysia logging plugin, nothing). When something fails in production, you will have no visibility into which requests were made.
- No error tracking integration (Sentry, Axiom, Datadog, etc.) on either frontend or backend.
- No health check metrics — the `/health` endpoint returns status but is not connected to any monitoring system.
- Silent failures are endemic: `catch { // fallback }` (cookie.ts), `catch { // ignore }` (use-applications.ts), `catch (err) { console.warn(...) }` with no retry or escalation. None of these are actionable in production.
- TanStack Query's error states are installed but there are no `onError` callbacks that would log or report failures.

**What's right:**
- The `/health` endpoint exists and checks database connectivity.
- The backend startup logs the port, Swagger URL, and health URL — useful for deployment verification.
- `console.error` is at least used (rather than `console.log`) for the unhandled server error.

**Required fixes:**
- Install Pino or a structured logger on the backend. Log every request with method, path, status, duration, and userId.
- Add Sentry (or equivalent) to both frontend and backend.
- Replace all `catch { // ignore }` and `catch { // fallback }` with real error logging.
- Add a request correlation ID to backend middleware so you can trace a single request across logs.

---

### 14. Configuration & Environment Handling — 6/10

**What's wrong:**
- **Frontend has no environment validation at build time.** If `NEXT_PUBLIC_API_URL` is missing on Vercel, Next.js silently uses `undefined`, which falls through to the hardcoded `"http://localhost:3001"` fallback. There is no build-time assertion that required env vars are present.
- `env.ts` (lines 33–34): JWT secrets have hardcoded development fallbacks. In a team setting or if `NODE_ENV` is accidentally unset in production, the app boots with known weak secrets. The check (line 36–46) only enforces this in production — but if `NODE_ENV` is wrong (e.g., set to `"test"` in prod), the check is bypassed.
- `COOKIE_DOMAIN` is optional and defaults to `undefined` — meaning cookies are issued without a domain attribute. Depending on the deployment topology (subdomain frontend calling different-subdomain backend), this causes the refresh token cookie to not be sent. No documentation of when to set this.
- `GEMINI_RESUME_API_KEY` and `GEMINI_API_KEY` are both optional — but there's no fallback logic documented for when neither is set. The cover letter and resume features will silently fail.
- `persistRefreshToken` in `auth.service.ts` hardcodes `7 * 24 * 60 * 60 * 1000` (line 256) — it does not read `env.JWT_REFRESH_EXPIRY`. If you change the env var, the database expiry is stale.
- No `.env.production` or `.env.staging` files or documentation for environment-specific configuration.

**What's right:**
- `env.ts` uses `Object.freeze()` to prevent accidental mutation after boot.
- Production validation at startup (`getEnv()`) throws before the server accepts requests if critical vars are missing.
- `.env.example` is maintained and comprehensive.
- Secrets are read exclusively from `env.ts` — no direct `process.env` reads in routes (mostly, with exceptions).

**Required fixes:**
- Add a build-time env check in `next.config.ts` that throws if `NEXT_PUBLIC_API_URL` is not set in non-development builds.
- Parse `env.JWT_REFRESH_EXPIRY` in `persistRefreshToken` and use it for the database record expiry.
- Document `COOKIE_DOMAIN` usage in `.env.example` with deployment topology guidance.

---

### 15. Overall Architecture & Patterns — 6/10

**What's wrong:**
- **The primary user data flow is incoherent.** Backend has a proper PostgreSQL database. Frontend has a localStorage cache with optimistic sync. These two should be a client-server cache (TanStack Query pattern), but instead they're parallel truth sources with no conflict resolution. The current design means: a user on two devices will see different application states, server-side analytics cannot be trusted, and any backend data change not triggered by the frontend is invisible.
- **The access token is simultaneously in Redux (memory), in a browser cookie (JavaScript-accessible), AND potentially in the middleware cookie reader.** Three locations for one token with no single source of truth creates subtle bugs about which copy is used when.
- **The Next.js App Router layout hierarchy is not used.** `app/(dashboard)/layout.tsx` is 544 bytes — it renders nothing meaningful. Every dashboard page re-renders the full `<Sidebar>` and `<TopBar>` independently. This defeats the entire purpose of Next.js layouts and means every route transition re-mounts the sidebar.
- **The backend has a `controller` layer and a `routes` layer** — but the controller manipulates HTTP cookies directly (lines 76–83, 132–140, etc.). Cookie manipulation is an HTTP concern that belongs in the route/middleware layer. The service should return pure data; the route handler should set cookies. The controller currently sits awkwardly between them doing both.
- **Authentication is duplicated across two middleware layers**: Next.js edge middleware (`middleware.ts`) does client-side JWT inspection, and the backend `authGuard` does actual JWT verification. The edge middleware is security theater — it's not a real auth check.

**What's right:**
- The backend's service/controller/routes three-layer pattern is architecturally sound.
- The Elysia plugin system for attaching middleware (`authGuard`, `rateLimit`) to routes is used correctly in principle.
- Redux for in-memory client auth state (not server state) is the right choice.
- TanStack Query is installed for server state — the intent is correct, just not executed.

**Required fixes:**
- Fix `app/(dashboard)/layout.tsx` to contain the `<Sidebar>` and `<TopBar>` so they're rendered once at the layout level, not re-rendered per page.
- Commit to ONE access token location: Redux memory only. Remove it from cookies. Let the middleware use the refresh token cookie for bootstrapping and delegate actual route protection to `authGuard` on API calls.
- Move cookie manipulation out of `AuthController` into the Elysia route handlers (as Elysia hook callbacks or middleware plugins).

---

## 🔴 CRITICAL ISSUES (Must fix before any deployment)

1. **Access token in non-HttpOnly cookie** — `auth.controller.ts` `getAccessTokenCookieOptions()` — XSS readable, 7-day lifetime for a token meant to live 15 minutes.
2. **Middleware JWT validation has no signature verification** — `middleware.ts` `isTokenValid()` — any valid-shaped JWT with a future `exp` bypasses auth on all protected routes.
3. **`NEXT_PUBLIC_API_URL` not set in Vercel** — deployed app calls `localhost:3001`. The app is completely non-functional in production.
4. **Silent data loss on optimistic create failure** — `use-applications.ts` `createApplication` — user believes their job application was saved; it wasn't, and they get no indication.
5. **Rate limiter applied AFTER signup/verify-otp routes in Elysia** — `auth.routes.ts` — the first two auth endpoints have no rate limiting at all.

## 🟠 MAJOR ISSUES (Fix within current sprint)

1. Hardcoded `"Shubham Raj Pandey"` fallback in `dashboard/page.tsx:55` — PII data leak.
2. `dashboard/page.tsx:35` hardcoded `"+14% vs last week"` — fake metric presented as real data.
3. No `app/(dashboard)/layout.tsx` shell — `<Sidebar>` and `<TopBar>` re-mounted on every route transition.
4. `use-applications.ts` is 404 lines with 7 responsibilities — untestable, unmaintainable.
5. `resume/page.tsx` at 600+ lines and `cover-letter/page.tsx` at 800+ lines — violates stated coding standards.
6. `persistRefreshToken` ignores `env.JWT_REFRESH_EXPIRY` — hardcodes 7-day expiry in code.
7. No error boundaries on any dashboard page — exceptions show blank white screen.
8. `catch { // ignore }` / `catch { // fallback }` — silent failures throughout frontend.

## 🟡 MINOR ISSUES (Fix in next cleanup pass)

1. `dark:bg-[#090a0c]` copy-pasted across every page instead of `bg-background`.
2. `d` single-letter function name in `loadSampleApplications`.
3. `ctx as any` on every Elysia route handler — 7+ occurrences in `auth.routes.ts`.
4. `code || otp` dual field names for OTP input — pick one canonical field name.
5. `@tanstack/react-query-devtools` in `dependencies` instead of `devDependencies`.
6. No Prettier config, no Husky pre-commit hooks.
7. `/resumes` and `/resume` both in middleware protected routes — one is a ghost.
8. `accessToken` alias cookie alongside `tailr_access_token` — doubled surface area.
9. No `not-found.tsx` root 404 page.
10. No security headers in `next.config.ts`.
11. No `robots.ts` or `sitemap.ts`.

## 🟢 GOOD PRACTICES OBSERVED

1. **Argon2id with proper parameters** — password hashing is best-in-class.
2. **OTP hashed before storage, never persisted in plaintext** — correct.
3. **Refresh token rotation** — old token revoked server-side on every refresh. Correct.
4. **`Object.freeze(env)`** — prevents accidental mutation of config at runtime.
5. **`auth-api-client.ts` module-level JSDoc** — excellent documentation of security invariants and interceptor behavior.
6. **Queued refresh subscribers** — `subscribeToRefresh` pattern correctly handles concurrent 401s during a single refresh flow.
7. **`isBootstrapping` flag in Redux** — elegant solution for the SSR hydration auth race condition.
8. **`useSyncExternalStore` for localStorage** — correct React 18/19 primitive for external store subscription.
9. **Production startup validation** in `env.ts` — fails fast on missing required config.
10. **Semantic error class hierarchy** — `HttpError` → `BadRequestError`, `UnauthorizedError`, etc. are well-designed.

---

## REFACTORING PRIORITY LIST
Ordered by impact:

1. **Fix the deployed app** — Set `NEXT_PUBLIC_API_URL` in Vercel. Deploy the backend. Nothing else matters until users can log in.
2. **Fix the access token security model** — Make it HttpOnly OR keep it in Redux memory only. Never both. Never JavaScript-accessible with a 7-day lifetime.
3. **Fix middleware auth** — Add signature verification to `isTokenValid()` or remove the pretense and rely entirely on API-level `authGuard`.
4. **Fix the Elysia rate limiter ordering** — Signup and verify-otp routes must be protected.
5. **Fix silent optimistic write failures** — Add rollback + user notification when create/update/delete backend calls fail.
6. **Extract `app/(dashboard)/layout.tsx`** — Move `<Sidebar>` + `<TopBar>` into the layout so they render once.
7. **Split `useApplications`** into `useApplicationsStore`, `useApplicationsApi`, `useApplicationsActions`.
8. **Split `resume/page.tsx` and `cover-letter/page.tsx`** into section subcomponents.
9. **Replace localStorage primary storage with TanStack Query** + backend as source of truth.
10. **Write integration tests** for every auth endpoint.
11. **Add Sentry + structured backend logging** — you are flying blind in production.
12. **Add error boundaries** (`error.tsx`) to every dashboard route segment.
13. **Remove hardcoded company names and `"+14%"` metric** from production code.
14. **Configure Prettier + Husky** — stop letting inconsistent code into commits.
15. **Add security headers** to `next.config.ts`.

---

*This audit was generated with strict mode enabled. Scores are not inflated.*
