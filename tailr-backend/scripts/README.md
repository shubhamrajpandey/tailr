# Tailr Backend Maintenance & Operational Scripts

This directory contains utility, migration, and seeding scripts for the Tailr backend.

## Production Scripts

- **`migrate.ts`**: The official automated database schema migration runner. Invoked during CI/CD workflows and deployment via:
  ```bash
  bun run db:migrate
  ```
  Connects to PostgreSQL with SSL in production and executes versioned migrations from `src/db/migrations/`.

## Seeding Scripts

- **`seed-cedar-gate.ts`**: Populates the curated IT companies directory with Cedar Gate Services and affiliated tech stack details:
  ```bash
  bun run seed:cedar-gate
  ```

## Historical / Diagnostic Scripts

- **`ensure-ai-usage-logs.ts`**: Historical table bootstrap script. *(Note: Superseded by Drizzle migration `0003_fantastic_kree.sql`).*
- **`init-job-applications.ts`**: Historical table bootstrap script. *(Note: Superseded by Drizzle migration `0003_fantastic_kree.sql`).*
- **`test-analytics-api.ts`**: Local developer diagnostic script for validating analytics pipeline calculations against a running PostgreSQL instance.
