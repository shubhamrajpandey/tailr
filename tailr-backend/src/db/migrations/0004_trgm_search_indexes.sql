-- Migration 0004: Fast Case-Insensitive Trigram Search Indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY IF NOT EXISTS "job_applications_company_trgm_idx"
ON "job_applications" USING gin ("company_name" gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "job_applications_position_trgm_idx"
ON "job_applications" USING gin ("position_title" gin_trgm_ops);
