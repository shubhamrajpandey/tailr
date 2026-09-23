ALTER TABLE "companies" ADD COLUMN "sector" varchar(100) DEFAULT 'Technology' NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "linkedin_url" varchar(500);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "location" varchar(255) DEFAULT 'Kathmandu, Nepal';--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hr_name" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hr_email" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hr_linkedin" varchar(500);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "tech_stack" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
CREATE INDEX "companies_sector_idx" ON "companies" USING btree ("sector");