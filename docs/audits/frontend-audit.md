# CODE QUALITY AUDIT REPORT

**Project/File:** tailr-frontend
**Language/Framework:** TypeScript · Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Redux Toolkit · TanStack Query · Axios
**Audit Date:** October 4, 2026
**Auditor:** Antigravity (Strict Mode)

---

## SCORECARD SUMMARY

| # | Category | Score | Grade |
|---|----------|-------|-------|
| 1 | Code Structure & Organization | 6/10 | C |
| 2 | Naming Conventions | 7/10 | B- |
| 3 | Code Readability & Clarity | 5/10 | D |
| 4 | Comments & Documentation | 6/10 | C |
| 5 | Error Handling & Resilience | 4/10 | F |
| 6 | Security | 4/10 | F |
| 7 | Performance & Efficiency | 4/10 | F |
| 8 | Testing & Testability | 0/10 | F |
| 9 | SOLID & Design Principles | 5/10 | D |
| 10 | Dependency Management | 6/10 | C |
| 11 | Scalability & Maintainability | 4/10 | F |
| 12 | Consistency & Code Style | 6/10 | C |
| 13 | Logging & Observability | 3/10 | F |
| 14 | Configuration & Environment | 6/10 | C |
| 15 | Overall Architecture & Patterns | 6/10 | C |
| | **TOTAL** | **72/150** | **D** |

---

## OVERALL VERDICT

**Score:** 72/150 (48%)
**Grade:** D
**Production Ready:** NO

The frontend shows a developer who has made architecturally correct decisions on paper (App Router, Redux for auth memory state, TanStack Query, layered layout) but has failed to maintain discipline during implementation. The codebase has PII hardcoded into a production constant exported as the default resume, an access token stored in a JavaScript-readable cookie that contradicts the stated security model, a primary data store backed by localStorage instead of the installed server-state library, two massive god-component files (600+ and 800+ lines) that violate its own stated standards, and zero tests of any kind. This frontend is a prototype dressed up as a product.

---

## DETAILED FINDINGS

### 1. Code Structure & Organization — 6/10

**What's wrong:**
- `sidebar.tsx` is **779 lines / 31KB**. The `Sidebar` component handles: collapse state management, `useSyncExternalStore` subscription for localStorage, navigation item configuration (with hardcoded routes), quota display, user profile dropdown, mobile bottom bar delegation, and search rendering. That is six distinct concerns in a single component file.
- `top-bar.tsx` is **553 lines / 22KB** for a navigation bar. It contains breadcrumb generation logic (`getDefaultBreadcrumbs` with 15+ if-branches), mobile menu state, theme switching, user dropdown, and search — all inline.
- `resume/page.tsx` is **600+ lines**. `cover-letter/page.tsx` is **800+ lines**. Both violate the project's own 500-line rule from `AGENTS.md` §3.
- `app/(dashboard)/layout.tsx` wraps only `<ProtectedRoute>` — it does not contain `<Sidebar>` or `<TopBar>`. As a result, every dashboard page (`dashboard/page.tsx`, `applications/page.tsx`, `analytics/page.tsx`, etc.) independently instantiates `<Sidebar />` and `<TopBar />`. This means these components are re-mounted on every route transition, defeating the purpose of Next.js layouts.
- `use-applications.ts` is 404 lines for a single hook, containing localStorage subscription, backend sync, optimistic CRUD, status helpers, and a 120-line sample data factory.

**What's right:**
- Top-level folder structure (`app/`, `shared/`, `app/(auth)/`, `app/(dashboard)/`) is correct and follows the project's own conventions.
- `shared/components/ui/` correctly houses shadcn primitives.
- Provider nesting in `app/layout.tsx` is clean and in the correct order.

**Required fixes:**
- Move `<Sidebar>` and `<TopBar>` into `app/(dashboard)/layout.tsx` so they render once per layout, not once per page.
- Split `sidebar.tsx` into: `sidebar-nav.tsx`, `sidebar-user-menu.tsx`, `sidebar-quota-display.tsx`.
- Split `top-bar.tsx` into: `top-bar-breadcrumbs.tsx`, `top-bar-actions.tsx`, `top-bar-mobile-menu.tsx`.
- Split `resume/page.tsx` and `cover-letter/page.tsx` into section-level subcomponents.

---

### 2. Naming Conventions — 7/10

**What's wrong:**
- `d` in `loadSampleApplications` (`use-applications.ts:267`) is a single-letter function alias for date offset calculation — a clear naming violation.
- `s` in multiple Redux selectors: `useAppSelector((s) => s.auth.user)` — `s` means nothing. Should be `(state) => state.auth.user`.
- `getSnapshot` / `getServerSnapshot` in `use-applications.ts` (lines 14, 38) are the `useSyncExternalStore` callbacks but are named as generic getters. Without knowledge of the React API, an engineer cannot infer from their names that they implement an external store subscription pattern.
- `STORAGE_KEY` appears in THREE separate files (`use-applications.ts`, `use-master-resume.ts`, `sidebar.tsx`) with different string values — same name, different purposes, no disambiguation.
- `cachedSnapshot` / `cachedRaw` are module-level mutable globals in `use-applications.ts` (lines 11–12). These are effectively a hand-rolled cache, but the naming gives no indication of their scope, lifetime, or invalidation strategy.

**What's right:**
- File naming is consistently `kebab-case.tsx` throughout.
- Hook exports follow `use-kebab-case.ts` / `useCamelCase` correctly.
- Component names match file names (`ApplicationCard` from `application-card.tsx`).
- Redux action names (`setCredentials`, `clearCredentials`, `setAuthStep`) are precise and reveal intent.
- `isBootstrapping`, `isAuthenticated` — boolean state names are unambiguous.

**Required fixes:**
- Rename `d` to `offsetDate` or `dateFromDaysAgo`.
- Rename all selector lambdas: `(s) =>` → `(state) =>`.
- Rename `STORAGE_KEY` in each file to `APPLICATIONS_STORAGE_KEY`, `MASTER_RESUME_STORAGE_KEY`, `SIDEBAR_COLLAPSE_KEY` (last one is already correct).

---

### 3. Code Readability & Clarity — 5/10

**What's wrong:**
- `getDefaultBreadcrumbs` in `top-bar.tsx` starting at line 47 is a long chain of `if (pathname === ...)` statements — at least 15 branches. This is pattern-matched string logic masquerading as a function. It will grow without bound as routes are added and cannot be understood at a glance.
- `dashboard/page.tsx:35`: `const weeklyDelta = applications.length > 0 ? "+14% vs last week" : "0% vs last week"` — a hardcoded string is presented as computed data. Any engineer reading this assumes it is derived from `applications`. It is not.
- `use-applications.ts:220`: `const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-...$/i.test(id)` — this UUID regex appears TWICE (lines 220 and 253) inline, with no extraction to a named utility. The reader must decode the regex to understand what `isUuid` is checking.
- `auth-api-client.ts`: The `subscribeToRefresh` / `notifySubscribers` / `isRefreshing` pattern for queued concurrent 401s is correct but has no comment explaining WHY a queue is necessary. An engineer unfamiliar with the concurrent-refresh problem will not understand the design.
- `cookie.ts:28–31`: Writes two cookies (`tailr_access_token` AND `accessToken`) with a comment saying "for compatibility." Compatibility with what? This is incomprehensible without history.
- `protected-route.tsx` renders two different JSX blocks that both show `<Loader2>` with different text — for bootstrapping vs. unauthenticated. These are visually identical to the user but semantically different. No visual distinction means the user cannot tell the app is redirecting vs. loading.

**What's right:**
- `protected-route.tsx` has an excellent module-level JSDoc explaining the timing contract with `AuthProvider`. This is genuinely readable.
- `auth-provider.tsx` is 57 lines and completely clear.
- `auth-slice.ts` is clean, readable, and well-separated.
- `middleware.ts` auth flow (isProtectedRoute → isAuthRoute → redirect) reads linearly and is easy to follow.

**Required fixes:**
- Replace `getDefaultBreadcrumbs` if-chain with a route-to-breadcrumb map: `const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = { "/dashboard": [...], "/applications": [...] }`.
- Extract UUID regex to `shared/lib/utils.ts` as `isUuidV4(str: string): boolean`.
- Delete the hardcoded `"+14%"` string immediately.
- Add a comment above the `subscribeToRefresh` block explaining the concurrent-refresh queuing design.

---

### 4. Comments & Documentation — 6/10

**What's wrong:**
- `use-applications.ts:32–34`: `catch { // fallback }` — this is not a comment, it is an excuse. No context on what failed, no logging, no user impact description.
- `use-applications.ts:78`: `catch { // ignore }` — same. Silent swallow with a non-comment.
- `sidebar.tsx` has no module-level JSDoc despite being 779 lines and one of the most complex components in the app. There is no explanation of what it renders, what state it manages, or what its collapse mechanism does.
- `top-bar.tsx` similarly has no module-level documentation for a 553-line file.
- `cookie.ts:28`: Comment says "Also set accessToken alias for compatibility" — compatibility with WHAT is never documented. This is a liability comment that creates more confusion than it resolves.
- No JSDoc on any exported hook (`useApplications`, `useDashboardData`, `useMasterResume`, etc.) — these are the primary public API of the shared layer.
- `INITIAL_MASTER_RESUME` in `use-master-resume.ts` (line 8) has no comment explaining that it is a development default, a seed, or a template. A new developer will assume it is a real user's data and won't know to change it.

**What's right:**
- `auth-api-client.ts` module-level JSDoc (lines 1–16) is excellent — explains security invariants, interceptor behavior, and the token storage strategy clearly.
- `protected-route.tsx` JSDoc block is detailed and explains the timing contract.
- `auth-provider.tsx` JSDoc is accurate and helpful.
- `auth-slice.ts` action comments are precise and explain the "why" not just the "what."

**Required fixes:**
- Add JSDoc to `useApplications`, `useMasterResume`, `useDashboardData`, and every other exported hook.
- Add a `// DEV DEFAULT — replace before production or empty this before shipping` comment on `INITIAL_MASTER_RESUME`.
- Add a module-level comment to `sidebar.tsx` and `top-bar.tsx`.
- Replace all `catch { // ignore }` / `catch { // fallback }` with at minimum `console.warn('[ComponentName] ...', err)`.

---

### 5. Error Handling & Resilience — 4/10

**What's wrong:**
- **Silent data loss** (`use-applications.ts:162–193`): `createApplication` performs an optimistic write to localStorage, then fires the backend POST. If the POST fails, the function catches the error with `console.warn` and **returns the optimistically-created item with its temp ID**. The caller receives a seemingly successful result. The item persists in localStorage with a `app-${Date.now()}` ID. On next sync from the server, this item disappears. The user gets zero feedback. This is a silent data loss bug in the primary CRUD operation.
- **Silent update failures** (`use-applications.ts:222–227`): `updateApplication` fires a PATCH and swallows failures with `console.warn`. If the PATCH fails, local state and server state permanently diverge. No rollback, no notification.
- **Silent delete failures** (`use-applications.ts:255–259`): Same pattern. Fire-and-forget DELETE with no failure handling.
- **No error boundaries anywhere in the app.** Zero `error.tsx` files exist in any route segment. Any uncaught error in a dashboard component produces Next.js's default white screen with no user-facing recovery path.
- `cookie.ts:getSnapshot` (line 26–33): catches JSON.parse errors silently, returns `[]` with no indication of data corruption. Corrupted localStorage produces no user feedback and no error logging.
- `auth-provider.tsx` correctly handles the error case via Redux `clearCredentials`, but if the `setAuthCookie` call in line 36 throws (SSR context, document not available), it is not caught.
- `middleware.ts:isTokenValid` (lines 24–37): the try/catch around `atob()` and `JSON.parse` returns `false` on any exception — this silently treats a malformed token the same as an absent token. No logging, no signal.

**What's right:**
- `auth-api-client.ts` response interceptor correctly handles the 401 → refresh → retry cycle, including the queued-subscriber pattern for concurrent requests.
- `protected-route.tsx` gracefully handles the bootstrapping state with a loading spinner before making auth decisions.
- `middleware.ts` correctly redirects rather than serving an error on unauthenticated access to protected routes.

**Required fixes:**
- Add rollback logic to `createApplication`: if the backend call fails, remove the optimistically-added item from localStorage and call a toast/notification with an actionable message.
- Add `error.tsx` files to every dashboard route segment.
- Add a global error boundary in `app/layout.tsx`.
- Replace all `catch { // ignore }` with real error handling.

---

### 6. Security — 4/10

**What's wrong:**
- **The access token is stored in a JavaScript-readable cookie.** `cookie.ts:setAuthCookie` (line 24–26) writes `tailr_access_token` without `httpOnly`. `auth-provider.tsx:36` then calls `setAuthCookie` on every session bootstrap. Any XSS payload on any page can read `document.cookie` and exfiltrate the JWT. The `auth-slice.ts` comment explicitly states "NEVER persisted to localStorage" — but a non-HttpOnly cookie is an identical XSS attack surface to localStorage.
- **The access token cookie has a 7-day lifetime** (`cookie.ts:17`, `maxAgeDays = 7`). An access token is supposed to be short-lived (15 minutes). Giving it a 7-day cookie lifetime means a stolen token remains valid for 7 days with no revocation mechanism on the frontend.
- **`INITIAL_MASTER_RESUME` in `use-master-resume.ts` (lines 8–18) contains hardcoded real personal data**: full name (`"Shubham Raj Pandey"`), LinkedIn URL, GitHub URL, portfolio URL, phone number (`"+1 (555) 234-8901"`), email (`"shubham.pandey@example.com"`), real university name with specific GPA, specific company names, and manager names. This is PII embedded in a production code constant that is shipped to every user's browser.
- **`dashboard/page.tsx:55`** has `user?.fullName || "Shubham Raj Pandey"` — the developer's actual full name as a fallback. Any user whose `fullName` is null (e.g., a social auth user) sees someone else's name on their dashboard.
- **Middleware JWT validation has no signature verification** (`middleware.ts:isTokenValid`). The function decodes with `atob()` and checks `payload.exp`. A forged JWT with any payload and a future `exp` passes all protected route checks. Actual verification only happens when the backend `authGuard` runs on an API call.
- **Duplicate cookie with alias name** `accessToken` (written alongside `tailr_access_token` in `cookie.ts:29–31`) doubles the attack surface for no documented benefit.

**What's right:**
- The refresh token is HttpOnly — managed by the backend Set-Cookie header. The frontend never reads or writes it directly.
- `middleware.ts` correctly redirects unauthenticated users rather than serving protected content.
- Zod schema validation on forms prevents unvalidated input from reaching API calls.
- Access token is stored in Redux memory as the intended primary location — the cookie is the extra, unintended insecure copy.

**Required fixes:**
- **Remove `setAuthCookie` calls from the frontend.** The access token should live only in Redux (memory). If middleware needs to read it, use the HttpOnly refresh cookie and a `/auth/validate` server check instead.
- Replace `INITIAL_MASTER_RESUME` with an empty/blank resume template with no real PII.
- Remove the `|| "Shubham Raj Pandey"` fallback in `dashboard/page.tsx`.
- Remove the `accessToken` alias cookie from `cookie.ts`.
- Add signature verification to `middleware.ts:isTokenValid` or remove the function and use middleware-level `/auth/validate` API calls.

---

### 7. Performance & Efficiency — 4/10

**What's wrong:**
- **localStorage is the primary application data store.** `use-applications.ts` and `use-master-resume.ts` use `useSyncExternalStore` backed by `localStorage`. localStorage is synchronous and blocks the main thread on every read/write. `JSON.stringify(applications)` on every mutation means serializing potentially hundreds of records on every status update. This is measurably janky at scale.
- **`subscribe` in `use-applications.ts` (line 42–55)** listens to the global `"storage"` event with no key filtering. Every `localStorage.setItem` call from ANY part of the app (including the sidebar collapse key, theme preferences, i18n settings) triggers `cachedRaw = null; cachedSnapshot = null; callback()` — invalidating the applications cache unnecessarily. This causes the full applications list to re-render on every unrelated localStorage write.
- **`syncApplications` re-triggers on `accessToken` change** (effect dependency, line 125). Every silent token refresh (which happens every 15 minutes) triggers a full re-fetch and re-serialization of all applications from the backend. This is unnecessary — token changes do not mean applications changed.
- **`Sidebar` uses `useApplications()`** (line 37 of `sidebar.tsx`). The sidebar imports `useApplications` to display a badge count. Since `Sidebar` is instantiated in every dashboard page independently (not in layout), this means each route transition creates a new `useApplications` instance, triggering a new sync cycle. Fix: move `Sidebar` to the layout so it mounts once.
- **`getDefaultBreadcrumbs` in `top-bar.tsx`** is called on every render with a string comparison chain of 15+ if-statements. Should be a lookup table (O(1) vs O(n)).
- **TanStack Query is installed but not used** for any of the primary data features (applications, resume, cover letters). The library adds ~47KB to the bundle. The only use appears to be for auth mutations/queries. You are paying the bundle cost of a full server-state library but reverting to manual localStorage management.

**What's right:**
- `cachedSnapshot` / `cachedRaw` module-level memoization in `use-applications.ts` avoids redundant `JSON.parse` on repeated reads with identical data — this is a real, effective optimization.
- `useRefreshQuery` correctly deduplicates the session bootstrap refresh via TanStack Query's built-in deduplication.

**Required fixes:**
- Filter the `"storage"` event in `use-applications.ts` to only react when `event.key === STORAGE_KEY`.
- Remove `accessToken` from the `syncApplications` effect dependency array — sync on mount only.
- Either migrate applications to TanStack Query (the correct fix) or commit to localStorage without TanStack Query (cheaper fix) — stop paying for both.
- Move `<Sidebar>` into `app/(dashboard)/layout.tsx` to eliminate per-page re-mounting.
- Replace `getDefaultBreadcrumbs` if-chain with a route map.

---

### 8. Testing & Testability — 0/10

**What's wrong:**
- **Zero frontend tests exist.** There is no test runner configured. `package.json` has no `test` script, no Vitest, no Jest, no Playwright, no React Testing Library. Nothing.
- The entire authentication flow (login → OTP → dashboard) is untested. The most critical user path has zero automated coverage.
- `useApplications` is the central data hook for the app's core feature. It is a 404-line hook that directly couples localStorage, Redux, window events, and Axios — completely untestable without major restructuring.
- `use-master-resume.ts` also uses `useSyncExternalStore` backed by localStorage with no dependency injection. Cannot be tested in isolation.
- The `middleware.ts` auth logic (specifically `isTokenValid`) is a pure function but has no tests. It contains a security-critical JWT decode path that has never been verified to behave correctly on edge cases.
- There is no integration test verifying that the `AuthProvider` → `ProtectedRoute` → redirect flow works correctly.
- `loadSampleApplications` function exists in the production hook specifically because manual browser testing was used instead of writing tests.

**What's right:**
- Some components (`auth-provider.tsx`, `protected-route.tsx`) are small enough to be unit-tested straightforwardly.
- Pure utility functions in `shared/lib/utils.ts` are testable without mocks.
- The `isTokenValid` function in `middleware.ts` is a pure function — testable if a test runner existed.

**Required fixes:**
- Install Vitest + React Testing Library + jsdom immediately.
- Add `"test": "vitest"` to `package.json` scripts.
- Write unit tests for: `isTokenValid`, `getDefaultBreadcrumbs`, `setAuthCookie`/`removeAuthCookie`/`getAuthTokenFromCookie`, all Zod schemas in `shared/lib/validations/`.
- Write integration tests (using MSW or similar) for: login flow, OTP verification flow, session bootstrap flow, application CRUD.
- Restructure `useApplications` to accept injectable API client and storage adapter so it can be tested.

---

### 9. SOLID & Design Principles — 5/10

**What's wrong:**
- **SRP violated: `useApplications` has 7 responsibilities** — localStorage subscription management, backend sync scheduling, optimistic create, optimistic update, optimistic delete, status-specific update logic, and sample data generation. This is a god-hook.
- **SRP violated: `Sidebar` renders navigation, manages collapse state, reads quota data, renders user profile, renders mobile nav, and reads application count.** Six responsibilities.
- **DRY violated: page layout shell repeated across every dashboard page.** The pattern `<div className="flex min-h-screen..."><Sidebar /><div className="flex-1..."><TopBar />...` is copy-pasted verbatim in at least 4 dashboard pages (`dashboard/page.tsx`, `applications/page.tsx`, `analytics/page.tsx`, and others). The `(dashboard)/layout.tsx` exists precisely to prevent this but contains only `<ProtectedRoute>`.
- **DRY violated: UUID regex** appears twice inline (`use-applications.ts:220` and `:253`) with no extraction.
- **DRY violated: two parallel API clients** (`api-client.ts` with raw `fetch`, `auth-api-client.ts` with Axios interceptors) with no unified interface.
- **DRY violated: `dark:bg-[#090a0c]` hardcoded** across at least 4 separate files when `bg-background` semantic token already exists in `globals.css`.
- **Dependency Inversion violated: `useApplications`** directly imports `authApiClient`. It should receive its API dependency through props or context to enable testing.
- **OCP violated: `getDefaultBreadcrumbs`** is a long if-chain — adding a new route requires modifying the function. A map-based approach would be open for extension without modification.

**What's right:**
- Redux slice correctly has single responsibility (auth state management only).
- `AuthProvider` and `ProtectedRoute` are correctly separated — one handles session bootstrap, one handles access gating.
- `shared/components/ui/` correctly contains reusable shadcn primitives used across the app.
- `ProtectedRoute` correctly delegates to Redux rather than making its own API calls.

**Required fixes:**
- Move `<Sidebar>` and `<TopBar>` to `(dashboard)/layout.tsx` — this fixes the DRY violation automatically.
- Split `useApplications` into `useApplicationsStore`, `useApplicationsSync`, and `useApplicationsCrud`.
- Extract UUID validation to `shared/lib/utils.ts`.
- Delete `api-client.ts` — consolidate all API calls on `authApiClient`.

---

### 10. Dependency Management — 6/10

**What's wrong:**
- `@tanstack/react-query-devtools` is listed in `dependencies` (production bundle), not `devDependencies`. It should never ship to production users.
- `@tanstack/react-query` is installed and adds ~47KB to the bundle but is only used for auth mutations/queries — the majority of server state (applications, resume, cover letters) bypasses it entirely in favor of manual localStorage management. You are paying the full cost of a server-state library for partial use.
- `i18next` and `react-i18next` are installed. The only visible internationalization is a `body.lang-nepali` CSS class in `globals.css` and a `Noto_Sans_Devanagari` font. If Nepali/i18n is a real, tested feature with translation files, keep it. If it's aspirational, remove it — these two packages add meaningfully to bundle size.
- `lucide-react: ^1.47.0` — verify this is the correct version. The official `lucide-react` package is typically at 0.x versions. v1.47 may be a fork or a re-tagged version.
- No `engines` field in `package.json` specifying minimum Node or Bun version.
- `next: 16.3.5` — exact version pinned in `eslint-config-next` but using `^` semantics in the main dep. Mixed pinning strategy.

**What's right:**
- Core dependencies (Next.js, React 19, Redux Toolkit, Axios, Zod, Tailwind v4) are all appropriate for the stack.
- No obviously abandoned or vulnerable packages.
- `class-variance-authority` and `tailwind-merge` are correct shadcn/ui companion packages.
- Using `bun.lock` rather than `package-lock.json` is consistent with the Bun runtime choice.

**Required fixes:**
- Move `@tanstack/react-query-devtools` to `devDependencies`.
- Decide: either use TanStack Query fully (applications, resume, cover-letters via `useQuery`) or remove it and keep the custom store pattern. Don't do both.
- Add `"engines": { "node": ">=20" }` or equivalent Bun version to `package.json`.
- Audit and confirm `lucide-react` version is the official package.

---

### 11. Scalability & Maintainability — 4/10

**What's wrong:**
- **localStorage as primary data storage does not scale.** 5–10MB storage limit per origin. Synchronous API that blocks the main thread. No multi-device sync. No server-side visibility for analytics or debugging. No real-time updates. Any future requirement for pagination, filtering, or sorting hits a wall — you cannot query localStorage, only iterate the full array.
- **`loadSampleApplications` with real company names and real LinkedIn URLs** is baked into the production hook (`use-applications.ts:265–389`). Removing this when you go production requires a risky surgical delete from a 404-line file. It should be in `shared/fixtures/sample-applications.ts`.
- **`INITIAL_MASTER_RESUME`** in `use-master-resume.ts` has a real person's full identity hardcoded as the default resume. Every new user who hasn't set their resume sees this person's name, university, GPA, LinkedIn, and GitHub. This is not maintainable or scalable — it requires a database-backed empty state or a guided onboarding flow.
- **Hardcoded route strings** appear everywhere: `"/dashboard"`, `"/applications"`, `"/login"`, etc. are scattered across `middleware.ts`, `top-bar.tsx`, `sidebar.tsx`, and pages. A route rename requires a codebase-wide search-and-replace.
- **The `sidebar.tsx` subscribe to `tailr_applications_updated` custom events** couples the sidebar to the applications hook implementation detail. If the applications hook changes its event name, the sidebar silently breaks with no TypeScript error.
- **No CI/CD pipeline configuration** visible. No GitHub Actions, no automated test runs on PR, no build verification before Vercel deployment.

**What's right:**
- The `STORAGE_KEY` constants use version suffixes (`tailr_applications_v2`, `tailr_master_resume_v1`), which allows for data migration when the schema changes.
- Domain-based folder organization makes it easy to add new features without touching existing domains.

**Required fixes:**
- Replace `INITIAL_MASTER_RESUME` with a blank/empty resume template. Add onboarding to collect the user's real data.
- Extract all route strings to a central `shared/lib/routes.ts` constants file.
- Move `loadSampleApplications` out of the production hook.
- Create a `.github/workflows/ci.yml` for automated lint + typecheck on every PR.

---

### 12. Consistency & Code Style — 6/10

**What's wrong:**
- **No Prettier configured.** `package.json` has `eslint` and `eslint-config-next` but no `prettier` or `.prettierrc`. Code formatting consistency relies entirely on the developer's editor settings.
- **No pre-commit hooks.** Husky and lint-staged are documented in `AGENTS.md` as recommended but never set up. Any code — including AI-generated code — reaches commits without automated style enforcement.
- **Mixed button patterns.** `applications/page.tsx` uses `<Button variant="primary">` from the shared component. `dashboard/page.tsx` (lines 65–81) uses raw `<button type="button" className="h-9 px-3.5 inline-flex...">` with full Tailwind class strings. Both are in the same application. The shared Button component exists specifically to prevent this.
- **Mixed async patterns.** `updateApplication` and `deleteApplication` use `.catch((err) => ...)` promise chaining. The rest of the codebase uses `async/await` with `try/catch`. Pick one and apply it consistently.
- **Tailwind arbitrary values are pervasive** in direct contradiction of `AGENTS.md` §7. `dark:bg-[#090a0c]`, `bg-[#111216]/90`, `bg-[#15161c]`, `dark:border-white/[0.08]`, `text-[30px]` appear across page files when semantic tokens in `globals.css` already define these values. This is the project's own rule #1 being violated everywhere.
- **CRLF line endings** in `sidebar.tsx` and `top-bar.tsx` (visible as `\r\n` in the raw file), while other files use LF. Mixed line endings across a codebase cause noisy diffs.

**What's right:**
- TypeScript is used throughout without significant use of `any` in component/page files.
- Import organization is reasonably consistent (framework → shared → local).
- File naming is consistently `kebab-case.tsx`.
- `cn()` utility is used for conditional class merging where implemented.

**Required fixes:**
- Install and configure Prettier with `.prettierrc`. Add `"format": "prettier --write ."` to scripts.
- Set up Husky + lint-staged as documented in `AGENTS.md`.
- Add `.editorconfig` or `.gitattributes` with `* text=auto eol=lf` to normalize line endings.
- Replace all `dark:bg-[#090a0c]` instances with `dark:bg-background`.
- Standardize on `async/await` + `try/catch` everywhere — remove `.then()/.catch()` chains.

---

### 13. Logging & Observability — 3/10

**What's wrong:**
- **Two entire catch blocks have no logging at all:** `catch { // fallback }` in `use-applications.ts:32` and `catch { // ignore }` in `use-applications.ts:78`. These are silent failure paths with zero observability.
- `use-applications.ts` uses `console.warn` with bracket-prefixed context (`[useApplications]`). This is better than nothing but provides no structured data — no user ID, no application ID, no request ID, no timestamp. In production, these logs are unactionable.
- **No error tracking integration of any kind.** No Sentry, no Datadog, no LogRocket, no Axiom. Errors are invisible in production.
- **No performance monitoring.** Core Web Vitals are not measured or tracked. The app has no Vercel Analytics, no Web Vitals reporting, nothing.
- The `auth-api-client.ts` interceptor catches failed refreshes and redirects to login with zero logging. An engineer investigating a session dropout has no signal of why the refresh failed.
- There is no logging in `middleware.ts` — if a redirect happens (protected route, auth route), it is silent.

**What's right:**
- `console.warn` is used (rather than `console.log`) in catch blocks, which is marginally better semantically.
- Context prefixes (`[useApplications]`) on warn messages at least identify the source component.

**Required fixes:**
- Install Sentry (`@sentry/nextjs`) and configure it with `sentry.client.config.ts` and `sentry.server.config.ts`.
- Add `console.error` logging to the refresh interceptor failure path in `auth-api-client.ts`.
- Replace all `catch { // ignore }` with at minimum `console.error('[module] Silent failure:', err)`.
- Add Vercel Analytics or Web Vitals reporting via `next/vitals`.

---

### 14. Configuration & Environment Handling — 6/10

**What's wrong:**
- **No build-time env validation.** If `NEXT_PUBLIC_API_URL` is absent on Vercel, Next.js silently uses `undefined`, which falls through to the hardcoded `"http://localhost:3001"` fallback in `auth-api-client.ts:49`. There is no `next.config.ts` assertion, no build script check, nothing that fails the build if this required variable is missing.
- `next.config.ts` is **10 lines** containing only a `turbopack.root` directive. There are no security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), no image domain configuration, no `headers()` function at all. The app is clickjackable.
- No `robots.ts` or `sitemap.ts` in the `app/` directory despite the app having a public landing page with SEO metadata.
- `app/layout.tsx` metadata (line 29–46) has `title: "Tailr"` with no template. Individual pages override the full title. Should use `title: { template: "%s — Tailr", default: "Tailr" }` for consistent, DRY titling.
- No `not-found.tsx` at the app root — navigating to a nonexistent URL produces Next.js's default 404 page with no branding.
- No `loading.tsx` in dashboard routes — route transitions show nothing while the server component suspends.

**What's right:**
- `.env.example` exists and is comprehensive.
- `.env.local` is correctly gitignored (confirmed from previous audit context).
- `NEXT_PUBLIC_API_URL` is the only exposed env var — no secrets in `NEXT_PUBLIC_` prefix.
- `turbopack` is configured in `next.config.ts` for faster dev builds.

**Required fixes:**
- Add a `next.config.ts` env assertion: throw at build time if `NEXT_PUBLIC_API_URL` is `undefined` in non-development mode.
- Add security headers to `next.config.ts` via the `headers()` function.
- Add `app/not-found.tsx` with branded 404 UI.
- Add `app/(dashboard)/loading.tsx` skeleton for route transitions.
- Update root metadata to use the title template pattern.

---

### 15. Overall Architecture & Patterns — 6/10

**What's wrong:**
- **The data layer architecture is incoherent.** TanStack Query is installed for server-state caching. A custom `useSyncExternalStore` + localStorage pattern is used for application data. The backend has a PostgreSQL database with all the data. These three systems coexist with no clear authority — when they disagree, there is no defined winner. This is the root cause of the silent data loss bug: localStorage says one thing, the server says another, and there is no conflict resolution.
- **The access token lives in three places simultaneously**: Redux state (correct), a non-HttpOnly browser cookie (wrong), and as an alias cookie (also wrong). `auth-api-client.ts:66` reads `store.getState().auth.accessToken || getAuthTokenFromCookie()` — so it reads Redux first, then falls back to the cookie. This means if Redux resets (e.g., hard refresh) the cookie is used as backup, but the cookie has a 7-day lifetime on what should be a 15-minute token. This is architecturally undefined behavior.
- **`(dashboard)/layout.tsx` is unused as a layout.** It wraps only `<ProtectedRoute>` and does not contain `<Sidebar>` or `<TopBar>`. Every dashboard page re-instantiates these components. This defeats the core architectural benefit of Next.js App Router layouts — shared UI that persists across route transitions without remounting.
- **`api-client.ts` is a dead-end module.** It uses raw `fetch` pointing at `/api/applications` (a Next.js route handler) while `auth-api-client.ts` uses Axios with auth interceptors pointing at the backend directly. Two clients, two approaches, no consistency. The `apiClient` object is likely unused by any dashboard feature.

**What's right:**
- Provider nesting order in `app/layout.tsx` is correct: `Redux → Query → Auth → i18n → Theme`. Auth depends on Query, so Query must be outer.
- `AuthProvider` + `ProtectedRoute` separation is architecturally clean — one bootstraps session, one gates rendering.
- The `useSyncExternalStore` pattern for localStorage is the correct React primitive (vs. `useEffect` + `useState`).
- The Axios interceptor pattern for token refresh with queued subscribers is the correct approach.
- Redux Toolkit for in-memory auth state (not server state) is the right boundary.

**Required fixes:**
- Migrate `use-applications.ts` to TanStack Query with the backend as source of truth. Drop localStorage as primary storage.
- Move `<Sidebar>` and `<TopBar>` to `(dashboard)/layout.tsx`.
- Remove the access token from cookies entirely. Keep it in Redux only. Let the HttpOnly refresh cookie handle session persistence.
- Delete `shared/lib/api-client.ts` and replace any usages with `authApiClient`.

---

## 🔴 CRITICAL ISSUES (Must fix before any deployment)

1. **PII hardcoded in production constant** — `use-master-resume.ts:8–18`: `INITIAL_MASTER_RESUME` contains the developer's real full name, phone, email, LinkedIn, GitHub, university, GPA. Every user of the app who has no saved resume sees this person's identity as their own.
2. **Hardcoded personal name as fallback** — `dashboard/page.tsx:55`: `user?.fullName || "Shubham Raj Pandey"` — any user with a null fullName sees a stranger's name on their dashboard.
3. **Access token in non-HttpOnly cookie** — `cookie.ts:24–26`: JavaScript-readable cookie with 7-day lifetime defeats the entire security model. XSS-readable, long-lived, contradicts the stated "memory only" access token strategy.
4. **Middleware JWT has no signature verification** — `middleware.ts:isTokenValid`: decodes and checks `exp` only. A forged JWT with valid-shaped payload and future expiry passes all protected route gates.
5. **Silent data loss on failed optimistic writes** — `use-applications.ts:191–195`: failed backend POSTs return the optimistic item with temp ID; item persists in localStorage; disappears on next server sync; zero user notification.
6. **`NEXT_PUBLIC_API_URL` missing on Vercel** — deployed app calls `http://localhost:3001`. Complete production breakage.

## 🟠 MAJOR ISSUES (Fix within current sprint)

1. `(dashboard)/layout.tsx` does not contain `<Sidebar>` or `<TopBar>` — these re-mount on every route transition.
2. `useApplications` hook is 404 lines with 7 responsibilities — untestable and unmaintainable.
3. `sidebar.tsx` is 779 lines — god component, split it.
4. `top-bar.tsx` is 553 lines — god component, split it.
5. `resume/page.tsx` (~600 lines) and `cover-letter/page.tsx` (~800 lines) violate the project's own 500-line rule.
6. No error boundaries (`error.tsx`) in any dashboard route segment.
7. `"storage"` event listener in `use-applications.ts` has no key filter — triggers on every unrelated localStorage write.
8. `syncApplications` re-triggers on `accessToken` change — causes unnecessary full re-fetches every 15 minutes.
9. `loadSampleApplications` with real company/person names is embedded in a production hook.
10. Two API clients (`api-client.ts` and `auth-api-client.ts`) with inconsistent patterns.

## 🟡 MINOR ISSUES (Fix in next cleanup pass)

1. `dark:bg-[#090a0c]` copy-pasted across all pages — use `bg-background` (already defined in `globals.css`).
2. `d` single-letter function name in `loadSampleApplications`.
3. `(s) =>` in selector lambdas — rename to `(state) =>`.
4. UUID regex duplicated inline twice — extract to `shared/lib/utils.ts`.
5. `@tanstack/react-query-devtools` in `dependencies` — move to `devDependencies`.
6. No Prettier config, no Husky pre-commit hooks.
7. Mixed `async/await` and `.catch()` chains.
8. CRLF line endings in `sidebar.tsx` and `top-bar.tsx`.
9. No `not-found.tsx` root 404 page.
10. No `loading.tsx` in dashboard routes.
11. Security headers missing from `next.config.ts`.
12. `app/layout.tsx` metadata missing title template pattern.
13. `accessToken` alias cookie in `cookie.ts:29–31` — doubled attack surface.
14. `getDefaultBreadcrumbs` if-chain — replace with a route map.

## 🟢 GOOD PRACTICES OBSERVED

1. **`auth-api-client.ts` module-level JSDoc** — excellent documentation of security invariants, interceptor behavior, and token storage strategy. Every complex module should have this.
2. **`isBootstrapping` Redux flag** — elegant solution to the SSR auth hydration race condition, prevents premature redirects.
3. **`subscribeToRefresh` queuing pattern** — correctly handles concurrent 401s during a token refresh cycle without firing multiple refresh requests.
4. **`protected-route.tsx` + `auth-provider.tsx` separation** — session bootstrap and access gating are correctly separated into distinct components.
5. **`useSyncExternalStore` for localStorage** — correct React 19 primitive for external store subscription rather than the error-prone `useEffect` + `useState` pattern.
6. **Provider nesting order in `app/layout.tsx`** — Redux → Query → Auth → i18n → Theme is architecturally correct.
7. **`STORAGE_KEY` version suffixes** (`tailr_applications_v2`, `tailr_master_resume_v1`) — enables clean schema migration without corrupting existing user data.
8. **Domain-based folder structure** — `applications/`, `resume/`, `cover-letter/` domains with co-located components is the correct pattern.
9. **`ProtectedRoute` uses `router.replace` not `window.location.replace`** — preserves React Query cache and Redux store, prevents the infinite reload loop.
10. **Zod schema validation on all forms** — type-safe, validated input before any API call.

---

## REFACTORING PRIORITY LIST
Ordered by impact:

1. **Remove all PII from source code** — Replace `INITIAL_MASTER_RESUME` with empty template; remove `"Shubham Raj Pandey"` fallback from `dashboard/page.tsx`.
2. **Fix the access token security model** — Remove `setAuthCookie` calls from the frontend. Access token in Redux memory only. Strip the non-HttpOnly cookie.
3. **Set `NEXT_PUBLIC_API_URL` in Vercel** — Without this, nothing else matters.
4. **Move `<Sidebar>` + `<TopBar>` to `(dashboard)/layout.tsx`** — Fixes re-mounting, DRY violation, and enables layout-level data fetching.
5. **Add rollback + user notification to failed optimistic writes** — Prevents silent data loss in `createApplication`, `updateApplication`, `deleteApplication`.
6. **Split `useApplications`** into `useApplicationsStore`, `useApplicationsSync`, `useApplicationsCrud`.
7. **Add error boundaries** — `error.tsx` in every dashboard route segment; global error boundary in root layout.
8. **Fix the `storage` event filter** — Only react to `tailr_applications_v2` key changes.
9. **Split the god components** — `sidebar.tsx`, `top-bar.tsx`, `resume/page.tsx`, `cover-letter/page.tsx`.
10. **Install and configure Vitest + React Testing Library** — Write tests for auth flows, middleware, and CRUD operations.
11. **Install Sentry** — Configure error tracking for both client and server.
12. **Add security headers to `next.config.ts`** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
13. **Install Prettier + Husky** — Enforce code style on every commit.
14. **Replace arbitrary Tailwind values** — `dark:bg-[#090a0c]` → `dark:bg-background` everywhere.
15. **Delete `api-client.ts`** — Consolidate on `authApiClient` as the single API interface.

---

*This audit was generated with strict mode enabled. Scores are not inflated.*
