import app from "../src/index";
import postgres from "postgres";
import { env } from "../src/config/env";
import { jwt } from "@elysiajs/jwt";

const sql = postgres(env.DATABASE_URL, { max: 1 });

async function main() {
  const users = await sql`SELECT id, email, role FROM users LIMIT 1;`;
  if (users.length === 0) {
    console.log("No user found");
    return;
  }
  const user = users[0];

  // We can create a test app or call the login endpoint, or directly invoke analyticsService
  const { analyticsService } = await import("../src/modules/analytics/analytics.service");
  const overview = await analyticsService.getOverview(user.id);
  console.log("Analytics Service Overview Result:", JSON.stringify(overview, null, 2));

  const { applicationsService } = await import("../src/modules/applications/applications.service");
  const apps = await applicationsService.list(user.id);
  console.log(`Applications Service List Result: ${apps.length} applications loaded.`);

  await sql.end();
}

main().catch(console.error);
