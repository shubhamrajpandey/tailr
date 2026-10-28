import path from "node:path";
import fs from "node:fs";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../src/config/env";
import { logger } from "../src/utils/logger";

/**
 * Programmatic database migration runner for automated CI/CD and deployment pipelines.
 */
async function runMigrations() {
  logger.info("Executing automated database schema migrations...");
  const migrationClient = postgres(env.DATABASE_URL, {
    max: 1,
    ssl: env.NODE_ENV === "production" ? "require" : undefined,
  });
  const db = drizzle(migrationClient);

  try {
    const candidateFolders = [
      path.resolve(__dirname, "../src/db/migrations"),
      path.resolve(process.cwd(), "src/db/migrations"),
      path.resolve(process.cwd(), "tailr-backend/src/db/migrations"),
    ];
    const migrationsFolder = candidateFolders.find((f) => fs.existsSync(f)) || candidateFolders[0];

    await migrate(db, { migrationsFolder });
    logger.info("Database schema migrations completed successfully.");
  } catch (error) {
    logger.error("Database migration failed:", {}, error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

if (import.meta.main) {
  runMigrations();
}

export { runMigrations };
