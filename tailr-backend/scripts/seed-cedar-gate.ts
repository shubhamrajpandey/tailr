import { db, closeDatabase } from "../src/db/client";
import { users, companies } from "../src/db/schema";
import { eq, ilike } from "drizzle-orm";

interface SeedCompany {
  name: string;
  sector: string;
  industry: string;
  websiteUrl: string;
  linkedinUrl: string;
  location: string;
  hrName: string;
  hrEmail: string;
  hrLinkedin: string;
  logoUrl: string;
  techStack: string[];
  description: string;
}

const SEED_COMPANIES: SeedCompany[] = [
  {
    name: "Cedar Gate Services Pvt. Ltd.",
    sector: "Healthcare Technology",
    industry: "Healthcare Technology",
    websiteUrl: "https://www.cedargate.com",
    linkedinUrl: "https://www.linkedin.com/company/cedar-gate-technologies",
    location: "Sanepa, Lalitpur",
    hrName: "Talent Acquisition Team",
    hrEmail: "careers-nepal@cedargate.com",
    hrLinkedin: "https://www.linkedin.com/company/cedar-gate-technologies/jobs/",
    logoUrl: "https://www.cedargate.com/wp-content/themes/cedargate/dist/images/logo.svg",
    techStack: [".NET", "C#", "SQL Server", "React", "Python", "AWS", "Docker", "DevOps"],
    description: `Cedar Gate Services Pvt. Ltd. (Cedar Gate Nepal) is a leading U.S.-based healthcare technology company and an IQVIA business, with its prominent Nepal engineering office located in Sanepa, Lalitpur (formerly associated with Deerwalk Services).

The Nepal team comprises 750+ software developers and engineers working directly on Cedar Gate's mission-critical U.S. healthcare technology platform—specializing in value-based care, healthcare analytics, data management, care management, and payment technology.

Key engineering domains in Nepal:
• Backend & Enterprise Systems (.NET, C#, SQL Server, Microservices)
• Healthcare Data Analytics & Pipeline Engineering
• Quality Assurance & Automated Testing (Selenium, Playwright)
• Cloud Platforms & Infrastructure (AWS, Kubernetes, Terraform)
• Applied AI & Healthcare Data Science`,
  },
  {
    name: "Leapfrog Technology Inc.",
    sector: "Software Services & AI",
    industry: "Software & Cloud Engineering",
    websiteUrl: "https://www.lftechnology.com",
    linkedinUrl: "https://www.linkedin.com/company/leapfrog-technology-inc",
    location: "Dillibazar, Kathmandu",
    hrName: "People & Culture Operations",
    hrEmail: "careers@lftechnology.com",
    hrLinkedin: "https://www.linkedin.com/company/leapfrog-technology-inc/jobs/",
    logoUrl: "https://www.lftechnology.com/wp-content/uploads/2021/04/leapfrog-logo-dark.svg",
    techStack: ["React", "Node.js", "Python", "TypeScript", "AWS", "PostgreSQL", "Docker", "Next.js"],
    description: `Leapfrog Technology is a premier software and AI consultancy partnering with fast-growing venture-backed startups and Fortune 500 enterprises. With a world-class delivery hub in Kathmandu, Leapfrog engineers high-impact products across healthcare, fintech, edtech, and SaaS.

Key focus areas:
• Full-stack web and cloud architectures
• Generative AI & Machine Learning pipelines
• Agile engineering and dedicated product teams`,
  },
  {
    name: "Cotiviti Nepal",
    sector: "Health Analytics & FinTech",
    industry: "Healthcare Analytics",
    websiteUrl: "https://www.cotiviti.com",
    linkedinUrl: "https://www.linkedin.com/company/cotiviti",
    location: "Hattisar, Kathmandu",
    hrName: "Nepal Talent Acquisition",
    hrEmail: "recruitment.nepal@cotiviti.com",
    hrLinkedin: "https://www.linkedin.com/company/cotiviti/jobs/",
    logoUrl: "https://www.cotiviti.com/hubfs/Cotiviti_Logo.svg",
    techStack: ["Java", "Spring Boot", "Oracle", "Angular", "Kafka", "Hadoop", "Kubernetes", "CI/CD"],
    description: `Cotiviti is a global leader in healthcare data analytics and payment accuracy solutions, serving top U.S. healthcare payers and providers. Cotiviti Nepal represents a key technological backbone with hundreds of software engineers, database architects, and QA specialists delivering enterprise-grade analytics platforms.`,
  },
  {
    name: "Deerhold Nepal",
    sector: "Enterprise Software & Cloud",
    industry: "IT & Software Development",
    websiteUrl: "https://www.deerhold.com",
    linkedinUrl: "https://www.linkedin.com/company/deerhold-ltd",
    location: "Sifal, Kathmandu",
    hrName: "HR & Recruitment",
    hrEmail: "jobs@deerhold.com",
    hrLinkedin: "https://www.linkedin.com/company/deerhold-ltd/jobs/",
    logoUrl: "https://deerhold.com/images/deerhold-logo.png",
    techStack: ["Python", "Django", "React", "PostgreSQL", "AWS", "Node.js", "Docker"],
    description: `Deerhold is a Boston-based digital product engineering company founded by veteran technologists. With state-of-the-art facilities in Sifal, Kathmandu, Deerhold builds custom software solutions, modern data stacks, and web applications for North American and Japanese clients.`,
  },
  {
    name: "CloudFactory Nepal",
    sector: "AI Data & Managed Operations",
    industry: "AI & Human-in-the-Loop Operations",
    websiteUrl: "https://www.cloudfactory.com",
    linkedinUrl: "https://www.linkedin.com/company/cloudfactory",
    location: "Bhaisepati, Lalitpur",
    hrName: "Talent Engagement Team",
    hrEmail: "careers-np@cloudfactory.com",
    hrLinkedin: "https://www.linkedin.com/company/cloudfactory/jobs/",
    logoUrl: "https://www.cloudfactory.com/hubfs/cf-logo.svg",
    techStack: ["Ruby on Rails", "React", "Python", "PostgreSQL", "GCP", "Kubernetes"],
    description: `CloudFactory is a global AI data intelligence and human-in-the-loop workforce platform powering autonomous vehicles, computer vision, and machine learning models for industry leaders across Silicon Valley and Europe.`,
  },
  {
    name: "Yomari (Inficare)",
    sector: "FinTech & Banking Solutions",
    industry: "Financial Software",
    websiteUrl: "https://www.yomari.com",
    linkedinUrl: "https://www.linkedin.com/company/yomari-group",
    location: "Jhamsikhel, Lalitpur",
    hrName: "HR Department",
    hrEmail: "hr@yomari.com",
    hrLinkedin: "https://www.linkedin.com/company/yomari-group/jobs/",
    logoUrl: "https://www.yomari.com/images/yomari-logo.png",
    techStack: ["Java", "Oracle SQL", "Spring", "Angular", "Linux", "Microservices"],
    description: `Yomari is a pioneer in Nepal's technology ecosystem, specializing in core banking integration, enterprise business intelligence, telecom solutions, and government digital infrastructure.`,
  },
];

async function seedCompanies() {
  console.log("🌱 Seeding top Nepal IT companies into database...");

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

  for (const item of SEED_COMPANIES) {
    const existing = await db.query.companies.findFirst({
      where: ilike(companies.name, `%${item.name.split(" ")[0]}%`),
    });

    const companyData = {
      name: item.name,
      sector: item.sector,
      industry: item.industry,
      websiteUrl: item.websiteUrl,
      linkedinUrl: item.linkedinUrl,
      location: item.location,
      hrName: item.hrName,
      hrEmail: item.hrEmail,
      hrLinkedin: item.hrLinkedin,
      logoUrl: item.logoUrl,
      techStack: item.techStack,
      description: item.description,
      createdBy: adminUser.id,
      updatedAt: new Date(),
    };

    if (existing) {
      console.log(`Updating existing entry for: ${item.name} (id: ${existing.id})`);
      await db
        .update(companies)
        .set(companyData)
        .where(eq(companies.id, existing.id));
    } else {
      console.log(`Inserting new entry for: ${item.name}`);
      await db.insert(companies).values(companyData);
    }
  }

  await closeDatabase();
  console.log("✨ All companies seeded successfully!");
}

seedCompanies().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
