CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE TABLE "ai_usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" varchar(50) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cover_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"company_name" varchar(255) NOT NULL,
	"position_title" varchar(255) NOT NULL,
	"recipient_name" varchar(255),
	"recipient_title" varchar(255),
	"tone" varchar(50) DEFAULT 'formal' NOT NULL,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"content" text NOT NULL,
	"key_highlights" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"company_website" varchar(500),
	"position_title" varchar(255) NOT NULL,
	"job_description_raw" text,
	"position_open_date" varchar(50),
	"applied_date" varchar(50),
	"deadline" varchar(50),
	"applied" boolean DEFAULT false NOT NULL,
	"status" varchar(50) DEFAULT 'APPLIED' NOT NULL,
	"hr_name" varchar(255),
	"hr_linkedin_url" varchar(500),
	"hr_avatar_url" varchar(500),
	"resume_version_id" varchar(255),
	"resume_version" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar(255) DEFAULT 'Master Resume' NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"location" varchar(255),
	"linkedin_url" varchar(500),
	"github_url" varchar(500),
	"portfolio_url" varchar(500),
	"career_summary" text,
	"technical_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"work_experience" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"projects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw_content" text,
	"is_master" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailored_resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"resume_id" uuid,
	"company_name" varchar(255) NOT NULL,
	"position_title" varchar(255) NOT NULL,
	"job_description" text,
	"ats_score" integer DEFAULT 0 NOT NULL,
	"ats_feedback" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tailored_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"latex_source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ai_model" varchar(50) DEFAULT 'gemini-2.5-flash' NOT NULL,
	"tailoring_aggressiveness" varchar(50) DEFAULT 'balanced' NOT NULL,
	"default_cover_letter_tone" varchar(50) DEFAULT 'formal' NOT NULL,
	"strict_truth_constraint" boolean DEFAULT true NOT NULL,
	"default_resume_template" varchar(50) DEFAULT 'modern_minimalist' NOT NULL,
	"include_contact_header" boolean DEFAULT true NOT NULL,
	"include_linkedin" boolean DEFAULT true NOT NULL,
	"default_page_margin" varchar(50) DEFAULT 'normal' NOT NULL,
	"paper_size" varchar(50) DEFAULT 'letter' NOT NULL,
	"default_application_status" varchar(50) DEFAULT 'WISHLIST' NOT NULL,
	"default_application_sort_order" varchar(50) DEFAULT 'applied_date_desc' NOT NULL,
	"ghosted_threshold_days" integer DEFAULT 45,
	"theme" varchar(50) DEFAULT 'system' NOT NULL,
	"density" varchar(50) DEFAULT 'comfortable' NOT NULL,
	"high_contrast" boolean DEFAULT false NOT NULL,
	"analytics_opt_in" boolean DEFAULT false NOT NULL,
	"ai_improvement_opt_in" boolean DEFAULT true NOT NULL,
	"profile_visibility" varchar(50) DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "companies" DROP CONSTRAINT "companies_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_usage_logs" ADD CONSTRAINT "ai_usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailored_resumes" ADD CONSTRAINT "tailored_resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailored_resumes" ADD CONSTRAINT "tailored_resumes_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_logs_user_action_idx" ON "ai_usage_logs" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX "ai_usage_logs_user_action_created_at_idx" ON "ai_usage_logs" USING btree ("user_id","action","created_at");--> statement-breakpoint
CREATE INDEX "ai_usage_logs_created_at_idx" ON "ai_usage_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cover_letters_user_id_idx" ON "cover_letters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cover_letters_user_created_idx" ON "cover_letters" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "cover_letters_application_id_idx" ON "cover_letters" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "cover_letters_company_name_idx" ON "cover_letters" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "cover_letters_status_idx" ON "cover_letters" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cover_letters_created_at_idx" ON "cover_letters" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "job_applications_user_id_idx" ON "job_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "job_applications_user_created_idx" ON "job_applications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "job_applications_user_status_idx" ON "job_applications" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "job_applications_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_applications_applied_date_idx" ON "job_applications" USING btree ("applied_date");--> statement-breakpoint
CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "job_applications_resume_version_id_idx" ON "job_applications" USING btree ("resume_version_id");--> statement-breakpoint
CREATE INDEX "job_applications_company_trgm_idx" ON "job_applications" USING gin ("company_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "job_applications_position_trgm_idx" ON "job_applications" USING gin ("position_title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "resumes_user_id_idx" ON "resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "resumes_user_master_idx" ON "resumes" USING btree ("user_id","is_master");--> statement-breakpoint
CREATE INDEX "resumes_user_created_idx" ON "resumes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "resumes_is_master_idx" ON "resumes" USING btree ("is_master");--> statement-breakpoint
CREATE INDEX "resumes_created_at_idx" ON "resumes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tailored_resumes_user_id_idx" ON "tailored_resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tailored_resumes_user_created_idx" ON "tailored_resumes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "tailored_resumes_resume_id_idx" ON "tailored_resumes" USING btree ("resume_id");--> statement-breakpoint
CREATE INDEX "tailored_resumes_company_idx" ON "tailored_resumes" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "tailored_resumes_ats_score_idx" ON "tailored_resumes" USING btree ("ats_score");--> statement-breakpoint
CREATE UNIQUE INDEX "user_settings_user_id_idx" ON "user_settings" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;