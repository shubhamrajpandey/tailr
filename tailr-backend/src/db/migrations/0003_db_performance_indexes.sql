-- Migration 0003: High-Performance Composite Indexes for Query Acceleration
-- Eliminates sequential table scans and in-memory quicksorts identified during EXPLAIN ANALYZE

-- 1. Accelerates user application listings & Kanban views
CREATE INDEX CONCURRENTLY IF NOT EXISTS "job_applications_user_created_idx"
ON "job_applications" ("user_id", "created_at" DESC);

-- 2. Accelerates status filtering within user applications
CREATE INDEX CONCURRENTLY IF NOT EXISTS "job_applications_user_status_idx"
ON "job_applications" ("user_id", "status");

-- 3. Accelerates rolling 24-hour quota checks and rate limiting
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ai_usage_logs_user_action_created_idx"
ON "ai_usage_logs" ("user_id", "action", "created_at" ASC);

-- 4. Accelerates master resume retrieval for specific users
CREATE INDEX CONCURRENTLY IF NOT EXISTS "resumes_user_master_idx"
ON "resumes" ("user_id", "is_master");

-- 5. Accelerates user resume listings
CREATE INDEX CONCURRENTLY IF NOT EXISTS "resumes_user_created_idx"
ON "resumes" ("user_id", "created_at" DESC);

-- 6. Accelerates cover letters listings
CREATE INDEX CONCURRENTLY IF NOT EXISTS "cover_letters_user_created_idx"
ON "cover_letters" ("user_id", "created_at" DESC);

-- 7. Accelerates tailored resume listings
CREATE INDEX CONCURRENTLY IF NOT EXISTS "tailored_resumes_user_created_idx"
ON "tailored_resumes" ("user_id", "created_at" DESC);

-- 8. Accelerates resume version join and referential lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS "job_applications_resume_version_id_idx"
ON "job_applications" ("resume_version_id");

-- 9. (Optional) Native DATE migration for range queries (BETWEEN) and calendar math:
-- When migrating historical records safely:
-- ALTER TABLE "job_applications"
--   ALTER COLUMN "applied_date" TYPE date USING NULLIF(applied_date, '')::date,
--   ALTER COLUMN "position_open_date" TYPE date USING NULLIF(position_open_date, '')::date,
--   ALTER COLUMN "deadline" TYPE date USING NULLIF(deadline, '')::date;

