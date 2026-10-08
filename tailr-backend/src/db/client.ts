import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../config/env";

/**
 * Production PostgreSQL client configuration using postgres.js.
 * Configured with SSL enforcement in production, connection pooling,
 * and disabled prepared statements for transaction poolers (PgBouncer/Neon).
 */
const isSslRequired =
  env.NODE_ENV === "production" ||
  env.DATABASE_URL.includes("sslmode=require") ||
  env.DATABASE_URL.includes("ssl=true");

const queryClient = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === "production" ? 20 : 10,
  idle_timeout: 20,
  connect_timeout: 15,
  prepare: false, // Prevents prepared statement collisions on PgBouncer / Neon poolers
  ssl: isSslRequired ? "require" : undefined,
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
