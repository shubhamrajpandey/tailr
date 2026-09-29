import { db } from "../src/db/client";
import { sql } from "drizzle-orm";

const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
console.log("TABLES IN DB:", result.map((r: any) => r.table_name));
process.exit(0);
