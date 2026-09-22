import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../config/env";

/**
 * Production PostgreSQL client configuration using postgres.js.
 * Configured with pooled connections and prepared statements.
 */
const queryClient = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === "production" ? 20 : 10,
  idle_timeout: 30,
  connect_timeout: 10,
  onnotice: () => {}, // Suppress noisy notices in production
});

export const db = drizzle(queryClient, { schema });

/**
 * Helper to test database connectivity.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Gracefully close database connection pool on shutdown.
 */
export async function closeDatabase(): Promise<void> {
  await queryClient.end();
}
