# Tailr Codebase Folder Structure & Architecture Audit

**Date:** October 28, 2026  
**Auditor:** Senior Software Architect & Codebase Maintainer  
**Repository:** `shubhamrajpandey/tailr`  
**Current Commit:** `c66a3c9` on `main`

---

## 1. Executive Summary

This audit evaluates the physical file organization, modular boundaries, cross-cutting dependencies, duplication, and maintainability of the **Tailr** repository. 

Tailr is structured as a two-application repository:
- `tailr-frontend/`: Next.js 16 (App Router + React 19 + Turbopack + Tailwind CSS + Redux + TanStack React Query + Vitest)
- `tailr-backend/`: ElysiaJS 1.2 / Bun 1.4 + PostgreSQL (Drizzle ORM) + Redis + Bun Test

### Key Findings
1. **Repository Root Clutter**: The repository root is congested with historical markdown audits, specification documents, and raw company data spreadsheets (`ttcom.md`, `nepal_it_companies.xlsx`, `tailr_backend_audit.md`, `tailr_code_audit.md`, `tailr_frontend_audit.md`, `tailr-v1-spec.md`, `TAILR_PRODUCTION_DEPLOYMENT.md`).
2. **Backend Scripts vs. Database Core**: Database seed scripts (`seed-companies.ts`, `seed-blog-companies.ts`) are placed directly in `src/db/` alongside production runtime database client and schema definitions. Conversely, maintenance and testing scripts (`seed-cedar-gate.ts`, `ensure-ai-usage-logs.ts`, `init-job-applications.ts`, `test-analytics-api.ts`) reside in `scripts/` with unclear boundaries regarding whether they are obsolete hotfixes or active utilities.
3. **Redundant Proxy Fixture**: `tailr-frontend/shared/lib/sample-applications.ts` is an 8-line proxy re-exporting from `tailr-frontend/shared/fixtures/sample-applications.ts`, creating artificial indirection.
4. **Dual Lockfiles in Frontend**: `tailr-frontend` contains both `package-lock.json` (used by CI and npm) and `bun.lock`, which risks package version drift if developers use Bun in the frontend directory.
5. **Well-Architected Core**: The backend domain modules (`tailr-backend/src/modules/*`) and Next.js route groups (`app/(auth)` and `app/(dashboard)`) follow clean separation of concerns and must be preserved without disruptive churn.

---

## 2. Current Architecture Overview

```
tailr/
├── .agents/                          # Custom agent skills (frontend-design)
├── .github/workflows/ci.yml          # GitHub Actions CI pipeline
├── .husky/                           # Git pre-commit hooks
├── package.json                      # Root workspace orchestrator (husky, lint-staged)
├── package-lock.json                 # Root lockfile for dev tooling
├── vercel.json                       # Root Vercel monorepo deployment config
├── nepal_it_companies.xlsx           # Seed data spreadsheet (raw)
├── ttcom.md                          # Seed data markdown (raw)
├── tailr-v1-spec.md                  # Legacy product specification
├── tailr_backend_audit.md            # Historical security audit report
├── tailr_code_audit.md               # Historical code quality audit report
├── tailr_frontend_audit.md           # Historical frontend audit report
├── TAILR_PRODUCTION_DEPLOYMENT.md    # Production deployment guide
├── tailr-backend/                    # ElysiaJS + Bun API server
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── bun.lock
│   ├── scripts/                      # Mixed migrations, seeds, test scripts
│   ├── src/
│   │   ├── config/                   # env.ts, redis.ts
│   │   ├── db/                       # client.ts, schema.ts, migrations/, seeders
│   │   ├── middleware/               # auth-guard, error, rate-limiter, security
│   │   ├── modules/                  # Feature modules (analytics, auth, resume, etc.)
│   │   └── utils/                    # mailer, crypto, logger, groq, etc.
│   └── tests/                        # 9 test suites (unit + integration)
└── tailr-frontend/                   # Next.js 16 App Router application
    ├── app/                          # (auth), (dashboard), api/, page.tsx
    ├── public/                       # Static brand assets
    ├── shared/                       # Shared components, hooks, lib, store, types, utils
    ├── next.config.ts
    ├── proxy.ts                      # Edge proxy middleware
    ├── package.json
    ├── package-lock.json
    ├── bun.lock                      # Dual lockfile
    └── vitest.config.mjs
```

---

## 3. Confirmed Structural Problems

### Problem 1: Root Directory Pollution
- **Evidence**:
  - `tailr_backend_audit.md` (68 KB)
  - `tailr_code_audit.md` (40 KB)
  - `tailr_frontend_audit.md` (43 KB)
  - `tailr-v1-spec.md` (8.6 KB)
  - `TAILR_PRODUCTION_DEPLOYMENT.md` (31 KB)
  - `ttcom.md` (44 KB)
  - `nepal_it_companies.xlsx` (25 KB)
- **Impact**: Clutters root repository view, confuses new contributors regarding where official documentation lives, and mixes data ingestion files with project configuration.
- **Classification**: Confirmed maintainability defect.

### Problem 2: Seed Data Coupled to Repository Root
- **Evidence**:
  In `tailr-backend/src/db/seed-companies.ts`:
  ```ts
  const mdPath = path.resolve(__dirname, "../../../ttcom.md");
  const xlsxPath = path.resolve(__dirname, "../../../nepal_it_companies.xlsx");
  ```
- **Impact**: Backend seeding relies on raw unstructured files residing at the root of the repository via fragile relative path traversal (`../../../`).
- **Classification**: Confirmed structural defect.

### Problem 3: Split and Undocumented Backend Database Scripts
- **Evidence**:
  - Seeders are split: `src/db/seed-companies.ts` and `src/db/seed-blog-companies.ts` reside in runtime `src/db/`, while `scripts/seed-cedar-gate.ts` resides in `scripts/`.
  - `scripts/ensure-ai-usage-logs.ts` and `scripts/init-job-applications.ts` contain raw SQL `CREATE TABLE IF NOT EXISTS` queries that duplicate Drizzle migration `0003_fantastic_kree.sql`.
  - `scripts/test-analytics-api.ts` is an ad-hoc local development test script rather than an automated test.
- **Impact**: Creates confusion about database migration source-of-truth.
- **Classification**: Confirmed maintainability defect.

### Problem 4: Redundant Proxy Indirection in `sample-applications.ts`
- **Evidence**:
  - `tailr-frontend/shared/lib/sample-applications.ts` contains only 8 lines re-exporting from `@/shared/fixtures/sample-applications`.
  - Only `use-applications-crud.ts:8` imports from `shared/lib/sample-applications.ts`.
- **Impact**: Duplicate file naming across `shared/lib` and `shared/fixtures`.
- **Classification**: Confirmed minor duplication.

### Problem 5: Dual Lockfiles in `tailr-frontend`
- **Evidence**:
  - `tailr-frontend/package-lock.json` and `tailr-frontend/bun.lock` coexist.
  - CI (`.github/workflows/ci.yml`) explicitly invokes `npm ci` referencing `package-lock.json`.
- **Impact**: Developers using `bun install` in `tailr-frontend` update `bun.lock` without updating `package-lock.json`, leading to CI failures or version discrepancies.
- **Classification**: Confirmed tooling inconsistency.

---

## 4. Components That Are Well-Organized (DO NOT MODIFY)

1. **`tailr-backend/src/modules/*`**:
   - Each module strictly encapsulates `<module>.routes.ts`, `<module>.controller.ts`, `<module>.service.ts`, and `<module>.model.ts`.
   - The `resume` module decomposes responsibilities cleanly into `resume.service.ts` (facade), `resume-crud.service.ts` (database), `ai-tailor.service.ts` (LLM), and `latex-generator.ts` (LaTeX compilation).
   - *Recommendation*: **Leave completely untouched.**
2. **`tailr-frontend/app/(auth)` & `app/(dashboard)`**:
   - Next.js route groups correctly separate unauthenticated onboarding flows from authenticated dashboards with distinct layout boundaries.
   - Colocated subcomponents (`app/(dashboard)/applications/components/*`, `app/(dashboard)/resume/components/*`) prevent pollution of global UI components.
   - *Recommendation*: **Leave completely untouched.**
3. **`tailr-backend/src/middleware/*`**:
   - Authentication guard, error handler, rate limiter, request logger, and security headers have discrete, single-responsibility boundaries.
   - *Recommendation*: **Leave completely untouched.**
4. **`tailr-backend/src/db/migrations/*`**:
   - Drizzle-kit migration snapshots (`0000_cool_umar.sql` through `0003_fantastic_kree.sql`) are immutable production database artifacts.
   - *Recommendation*: **Never move, rename, or alter.**

---

## 5. Target Architecture

### Proposed Root Structure
```
tailr/
├── docs/                             # Dedicated documentation hub
│   ├── architecture/                 # System architecture & audit reports
│   │   ├── folder-structure-audit.md
│   │   ├── backend-audit.md
│   │   ├── frontend-audit.md
│   │   └── code-audit.md
│   ├── deployment/                   # Operations & deployment runbooks
│   │   └── production-deployment.md
│   └── specs/                        # Product requirements & specifications
│       └── tailr-v1-spec.md
├── tailr-backend/
│   ├── data/                         # Offline reference & seed datasets
│   │   ├── nepal_it_companies.xlsx
│   │   └── ttcom.md
│   ├── scripts/
│   │   ├── migrate.ts                # Production migration runner (db:migrate)
│   │   └── seeds/                    # Seed scripts
│   │       ├── seed-companies.ts
│   │       ├── seed-blog-companies.ts
│   │       └── seed-cedar-gate.ts
│   └── src/
│       └── db/                       # Core database only: client.ts, schema.ts, migrations/
├── tailr-frontend/
│   └── shared/
│       └── fixtures/                 # Canonical home for test/demo fixtures
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
└── vercel.json
```

---

## 6. Detailed Issue & Priority Matrix

| Issue | Affected Files | Impact | Recommended Action | Risk | Priority |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Root Clutter** | `tailr_*_audit.md`, `TAILR_PRODUCTION_DEPLOYMENT.md`, `tailr-v1-spec.md` | Low maintainability, messy root | Move to organized `docs/` hierarchy | Low | **P1** |
| **Root Data Files** | `ttcom.md`, `nepal_it_companies.xlsx` | Fragile paths, root clutter | Relocate to `tailr-backend/data/` and support multi-path resolution in `seed-companies.ts` | Low | **P1** |
| **Redundant Proxy** | `tailr-frontend/shared/lib/sample-applications.ts` | Indirection, duplicate naming | Update import in `use-applications-crud.ts` to `shared/fixtures/sample-applications` | Low | **P2** |
| **Backend Seed Separation** | `src/db/seed-*.ts` vs `scripts/seed-*.ts` | Inconsistent script placement | Consolidate seed scripts into `scripts/seeds/` with clear README | Low | **P2** |
| **Dual Lockfile** | `tailr-frontend/bun.lock` | Potential dependency drift | Remove `bun.lock` from frontend, document `npm` standard | Low | **P3** |

---

## 7. Phased Safe Migration Plan

### Phase 1: Documentation & Root Consolidation (Zero Code Risk)
1. Create `docs/architecture/`, `docs/deployment/`, `docs/specs/`.
2. Move historical audit markdown files into `docs/architecture/`.
3. Move `TAILR_PRODUCTION_DEPLOYMENT.md` to `docs/deployment/production-deployment.md`.
4. Move `tailr-v1-spec.md` to `docs/specs/v1-specification.md`.
5. Update `README.md` and documentation links.

### Phase 2: Seed Data Relocation & Safe Path Resolution
1. Create `tailr-backend/data/`.
2. Move `ttcom.md` and `nepal_it_companies.xlsx` into `tailr-backend/data/`.
3. Update `tailr-backend/src/db/seed-companies.ts` path resolution to check `tailr-backend/data/` first, with graceful fallback to root for backward compatibility.

### Phase 3: Frontend Fixture Indirection Removal
1. In `tailr-frontend/shared/hooks/use-applications-crud.ts`, update import from `@/shared/lib/sample-applications` to `@/shared/fixtures/sample-applications`.
2. Remove redundant proxy file `tailr-frontend/shared/lib/sample-applications.ts`.

### Phase 4: Full Verification
1. Run `npm run test` and `npm run build` on frontend.
2. Run `bun test` and `bun run typecheck` on backend.
3. Verify git status and check for broken links.
