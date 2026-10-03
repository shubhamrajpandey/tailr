import postgres from "postgres";
import { env } from "../src/config/env";

async function main() {
  const sql = postgres(env.DATABASE_URL, { max: 1 });
  try {
    console.log("Ensuring ai_usage_logs table exists...");
    await sql`
      CREATE TABLE IF NOT EXISTS ai_usage_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS ai_usage_logs_user_action_idx 
      ON ai_usage_logs (user_id, action);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS ai_usage_logs_created_at_idx 
      ON ai_usage_logs (created_at);
    `;

    console.log("ai_usage_logs table and indexes verified successfully.");
  } catch (err) {
    console.error("Failed to ensure ai_usage_logs table:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
