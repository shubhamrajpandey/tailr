import { db, closeDatabase } from "../src/db/client";
import { users, companies } from "../src/db/schema";
import { eq, ilike } from "drizzle-orm";

async function seedCedarGate() {
  console.log("🌱 Seeding Cedar Gate Services into database...");

  // 1. Find or create an admin / system user to associate as createdBy
  let adminUser = await db.query.users.findFirst({
    where: eq(users.role, "admin"),
  });

  if (!adminUser) {
    adminUser = await db.query.users.findFirst();
  }

  if (!adminUser) {
    console.log("Creating default system admin user...");
    const [newAdmin] = await db
      .insert(users)
      .values({
        fullName: "System Admin",
        email: "admin@tailr.app",
        passwordHash: "system_generated_hash_placeholder",
        isVerified: true,
        role: "admin",
      })
      .returning();
    adminUser = newAdmin;
  }

  console.log(`Using admin user: ${adminUser.fullName} (${adminUser.id})`);

  // 2. Check if company already exists
  const existingCompany = await db.query.companies.findFirst({
    where: ilike(companies.name, "%Cedar Gate%"),
  });

  const companyData = {
    name: "Cedar Gate Services Pvt. Ltd.",
    industry: "Healthcare Technology",
    websiteUrl: "https://www.cedargate.com",
    logoUrl: "https://www.cedargate.com/wp-content/themes/cedargate/dist/images/logo.svg",
    description: `Cedar Gate Services Pvt. Ltd. (Cedar Gate Nepal) is a leading U.S.-based healthcare technology company and an IQVIA business, with its prominent Nepal engineering office located in Sanepa, Lalitpur (formerly associated with Deerwalk Services, acquired in 2020).

The Nepal team comprises 750+ software developers and engineers working directly on Cedar Gate's mission-critical U.S. healthcare technology platform—specializing in value-based care, healthcare analytics, data management, care management, and payment technology.

Key engineering domains & roles in Nepal:
• Backend & Software Engineering (.NET, Enterprise Applications)
• Data Engineering, Healthcare Analytics & SQL Database Architecture
• Quality Assurance & Automated Testing
• DevOps, Cloud & IT Infrastructure
• Applied AI & Healthcare Data Science

Office Location: Sanepa, Lalitpur, Nepal | Contact: 01-5010060`,
    createdBy: adminUser.id,
    updatedAt: new Date(),
  };

  if (existingCompany) {
    console.log(`Cedar Gate already exists (id: ${existingCompany.id}). Updating...`);
    const [updated] = await db
      .update(companies)
      .set(companyData)
      .where(eq(companies.id, existingCompany.id))
      .returning();
    console.log("✅ Successfully updated Cedar Gate:", updated);
  } else {
    const [inserted] = await db
      .insert(companies)
      .values(companyData)
      .returning();
    console.log("✅ Successfully inserted Cedar Gate:", inserted);
  }

  await closeDatabase();
  console.log("✨ Done!");
}

seedCedarGate().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
