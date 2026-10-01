import postgres from "postgres";
import { env } from "../src/config/env";

const sql = postgres(env.DATABASE_URL, { max: 1 });

async function main() {
  console.log("Checking and creating job_applications table...");

  await sql`
    CREATE TABLE IF NOT EXISTS job_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      company_name VARCHAR(255) NOT NULL,
      company_website VARCHAR(500),
      position_title VARCHAR(255) NOT NULL,
      job_description_raw TEXT,
      position_open_date VARCHAR(50),
      applied_date VARCHAR(50),
      deadline VARCHAR(50),
      applied BOOLEAN NOT NULL DEFAULT false,
      status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
      hr_name VARCHAR(255),
      hr_linkedin_url VARCHAR(500),
      hr_avatar_url VARCHAR(500),
      resume_version_id VARCHAR(255),
      resume_version JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON job_applications (user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications (status);`;
  await sql`CREATE INDEX IF NOT EXISTS job_applications_applied_date_idx ON job_applications (applied_date);`;
  await sql`CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON job_applications (created_at);`;

  console.log("job_applications table and indexes verified!");
  console.log("Database table is clean and ready for real user applications.");
  await sql.end();
  console.log("Migration complete!");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
