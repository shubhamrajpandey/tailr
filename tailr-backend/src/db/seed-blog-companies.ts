/**
 * Seed companies from the Zunkiree Labs blog:
 * https://zunkireelabs.com/blog/top-tech-companies-nepal-2026/
 * 
 * Only inserts companies NOT already in the DB.
 */
import { db } from "./client";
import { companies } from "./schema";

const ADMIN_ID = process.env.SEED_USER_ID!;
if (!ADMIN_ID) throw new Error("Set SEED_USER_ID env var");

// All 50 companies from the blog post, parsed manually
const blogCompanies = [
  // AI Companies
  { name: "Zunkiree Labs", websiteUrl: "https://zunkireelabs.com", location: "Kathmandu, Nepal", sector: "AI", description: "AI infrastructure company building AI-native search (RAG pipelines), enterprise AI agents, and custom AI systems." },
  { name: "Fusemachines", websiteUrl: "https://fusemachines.com", location: "Kathmandu, Nepal", sector: "AI", description: "AI education and enterprise machine learning company. Pioneer of AI in Nepal, founded by former Columbia University professor Sameer Maskey." },
  { name: "CloudFactory", websiteUrl: "https://cloudfactory.com", location: "Kathmandu, Nepal", sector: "AI", description: "AI training data and data labeling company with 1,000+ workforce for human-in-the-loop AI systems." },
  { name: "Cotiviti Nepal", websiteUrl: "https://cotiviti.com", location: "Kathmandu, Nepal", sector: "Healthcare AI", description: "Healthcare analytics and AI for the US market, specializing in claims processing, fraud detection, and clinical data analytics." },
  { name: "Docsumo", websiteUrl: "https://docsumo.com", location: "Kathmandu, Nepal", sector: "Document AI", description: "Document processing AI that extracts structured data from invoices, receipts, and financial documents using OCR and ML." },
  { name: "Genese Solution", websiteUrl: "https://genesesolution.com", location: "Kathmandu, Nepal", sector: "Cloud & AI", description: "Google Cloud partner delivering cloud consulting, AI consulting, and digital transformation services with GCP ML solutions." },
  { name: "Paaila Technology", websiteUrl: "https://paailatechnology.com", location: "Lalitpur, Nepal", sector: "AI & Robotics", description: "Robotics and computer vision company, creator of Nepal's first humanoid robot. Focuses on robotics for service and education sectors." },
  { name: "Braindigit IT Solutions", websiteUrl: "https://braindigit.com", location: "Kathmandu, Nepal", sector: "AI & ML", description: "ML services for banking, telecom, and enterprise clients. Specializes in predictive analytics, recommendation systems, and credit scoring." },
  { name: "Numeric Mind", websiteUrl: "https://numericmind.com", location: "Kathmandu, Nepal", sector: "Data Science", description: "Statistical consulting and ML services for healthcare and pharmaceutical research. Specializes in biostatistics and clinical trial analysis." },
  { name: "Programiz", websiteUrl: "https://programiz.com", location: "Kathmandu, Nepal", sector: "EdTech & AI", description: "AI-powered programming education platform reaching millions monthly. One of the most visited programming tutorial sites globally." },
  { name: "Insight Workshop", websiteUrl: "https://insightworkshop.io", location: "Lalitpur, Nepal", sector: "NLP & AI", description: "Natural language processing company focused on Nepali and South Asian languages — NLP models, sentiment analysis, and multilingual chatbots." },
  { name: "Ekbana Solutions", websiteUrl: "https://ekbana.com", location: "Kathmandu, Nepal", sector: "AI Development", description: "End-to-end AI development services from data preparation to model deployment. Specializes in ML model development and AI consulting." },
  { name: "Bajra Technologies", websiteUrl: "https://bajratechnologies.com", location: "Kathmandu, Nepal", sector: "Software & ML", description: "ML engineering and data science company serving clients in North America and Europe. Integrates ML into practical business applications." },
  { name: "Treeleaf Technologies", websiteUrl: "https://treeleaf.ai", location: "Kathmandu, Nepal", sector: "Computer Vision", description: "Computer vision solutions for construction and infrastructure monitoring. Specializes in quality inspection automation and document digitization." },
  { name: "Deerhold (AI Division)", websiteUrl: "https://deerhold.com", location: "Kathmandu, Nepal", sector: "Conversational AI", description: "Conversational AI and intelligent automation for enterprise workflows including customer service chatbots and knowledge assistants." },
  // Software Development Companies
  { name: "Leapfrog Technology", websiteUrl: "https://lftechnology.com", location: "Kathmandu, Nepal", sector: "Software Development", description: "One of Nepal's largest software companies with 400+ team. Known for engineering excellence, full-stack development, mobile apps, and cloud solutions." },
  { name: "Deerwalk Services", websiteUrl: "https://deerwalk.com", location: "Lalitpur, Nepal", sector: "Healthcare Software", description: "Healthcare software company with 600+ team building population health management and analytics platforms for the US market." },
  { name: "Verisk Nepal", websiteUrl: "https://verisk.com", location: "Lalitpur, Nepal", sector: "Insurance Software", description: "Nepal office of Verisk, building insurance underwriting platforms, risk assessment tools, and claims processing systems for the US market." },
  { name: "F1Soft International", websiteUrl: "https://f1soft.com", location: "Kathmandu, Nepal", sector: "Fintech", description: "Pioneer of digital payments in Nepal. Builds fintech solutions including eSewa (Nepal's largest digital wallet), core banking, and payment gateways." },
  { name: "Javra Software", websiteUrl: "https://javra.com", location: "Kathmandu, Nepal", sector: "Software Development", description: "Software development company with 150+ team serving European clients. Strong expertise in e-commerce platforms, CMS, and enterprise web applications." },
  { name: "Yomari Information Services", websiteUrl: "https://yomari.com", location: "Lalitpur, Nepal", sector: "GIS & Government", description: "Nepal's oldest IT company (est. 1998), specializing in geographic information systems, national land registry systems, and government software." },
  { name: "LogPoint", websiteUrl: "https://logpoint.com", location: "Kathmandu, Nepal", sector: "Cybersecurity", description: "Cybersecurity SIEM platform development. Nepal engineering center develops threat detection, security information management, and compliance tools." },
  { name: "Yantra (formerly WebSurfer Nepal)", websiteUrl: "https://yantra.com.np", location: "Kathmandu, Nepal", sector: "Digital Agency & Software", description: "Digital agency and software development company with 150+ team. Serves local enterprises and international clients with mobile apps and portals." },
  { name: "Proshore", websiteUrl: "https://proshore.eu", location: "Kathmandu, Nepal", sector: "Software Development", description: "PHP-based software development company with 200+ team specializing in e-commerce and enterprise systems for European clients." },
  { name: "Dailo Technology", websiteUrl: "https://dailotech.com", location: "Kathmandu, Nepal", sector: "Mobile Development", description: "Mobile application development company specializing in iOS/Android and cross-platform apps using Flutter and React Native." },
  { name: "Incessant Rain Studios", websiteUrl: "https://irsgames.com", location: "Kathmandu, Nepal", sector: "Game Development", description: "One of Nepal's few game development studios. Creates games for Steam and mobile platforms and interactive training simulations." },
  { name: "Kazi Studios", websiteUrl: "https://kazistudios.com", location: "Kathmandu, Nepal", sector: "Game Development", description: "Mobile game development and immersive AR/VR experiences. Commercial success in competitive global mobile gaming market." },
  // Startups
  { name: "Khalti", websiteUrl: "https://khalti.com", location: "Lalitpur, Nepal", sector: "Fintech", description: "Nepal's second-largest digital wallet with millions of users. Known for developer-friendly APIs, merchant services, and payment gateway." },
  { name: "Hamro Patro", websiteUrl: "https://hamropatro.com", location: "Kathmandu, Nepal", sector: "Consumer Tech", description: "Nepal's most-used local content and calendar platform. Evolved from a Nepali calendar app into a content aggregation and NLP platform." },
  { name: "Foodmandu", websiteUrl: "https://foodmandu.com", location: "Kathmandu, Nepal", sector: "Food Delivery", description: "Pioneer and market leader of food delivery in Nepal. Operates food delivery platform, restaurant management tools, and logistics optimization." },
  { name: "Tootle", websiteUrl: "https://tootle.today", location: "Kathmandu, Nepal", sector: "Ride-hailing", description: "Created Nepal's motorcycle ride-hailing market. Operates ride-hailing and delivery platform with 100+ team." },
  { name: "Sastodeal", websiteUrl: "https://sastodeal.com", location: "Lalitpur, Nepal", sector: "E-commerce", description: "One of Nepal's early e-commerce players with significant retail technology infrastructure including marketplace and fulfillment systems." },
  { name: "Pathao Nepal", websiteUrl: "https://pathao.com", location: "Kathmandu, Nepal", sector: "Super App", description: "Super app combining rides, delivery, and payments in one platform. Operates multi-service platform with 150+ team in Nepal." },
  { name: "Daraz Nepal", websiteUrl: "https://daraz.com.np", location: "Kathmandu, Nepal", sector: "E-commerce", description: "Backed by Alibaba, Nepal's largest e-commerce marketplace by volume with 300+ team, fulfillment network, and seller tools." },
  { name: "CellPay", websiteUrl: "https://cellpay.com.np", location: "Kathmandu, Nepal", sector: "Fintech", description: "QR-based digital payments and merchant solutions company with growing banking integrations." },
  { name: "PickMyParcel (PMP Nepal)", websiteUrl: "https://pickmyparcel.com.np", location: "Kathmandu, Nepal", sector: "Logistics Tech", description: "E-commerce logistics company providing last-mile delivery, warehouse management, and tracking systems for e-commerce fulfillment." },
  { name: "Locus Nepal", websiteUrl: "https://locus.com.np", location: "Lalitpur, Nepal", sector: "Coworking Tech", description: "Combines physical coworking spaces with technology for workspace management, community engagement, and event booking." },
  { name: "SmartDoko", websiteUrl: "https://smartdoko.com", location: "Kathmandu, Nepal", sector: "Quick Commerce", description: "Quick commerce platform for groceries and essentials with dark store operations and demand prediction systems." },
  { name: "Upaya", websiteUrl: "https://upaya.org", location: "Kathmandu, Nepal", sector: "HRTech", description: "Blue-collar job matching platform connecting workers with employers using job matching, worker verification, and recruitment technology." },
  { name: "Beed Nepal", websiteUrl: "https://beed.com.np", location: "Kathmandu, Nepal", sector: "Home Services", description: "Home services marketplace connecting users with plumbers, electricians, and cleaners via booking, scheduling, and quality assurance systems." },
  { name: "MeroShare / CDS Nepal", websiteUrl: "https://cdsc.com.np", location: "Kathmandu, Nepal", sector: "Capital Markets Tech", description: "Digital infrastructure for Nepal's stock market including IPO application system, shareholder management, and capital markets infrastructure." },
];

function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*(pvt\.?\s*ltd\.?|private\s+limited|incorporated|inc\.?|llc\.?|group|international|nepal|pvt|ltd)\s*$/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function faviconUrl(url: string | null): string | null {
  if (!url) return null;
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// Get existing names
const existingRows = await db.select({ name: companies.name }).from(companies);
const existingNorms = new Set(existingRows.map(r => normalise(r.name)));

const toInsert = blogCompanies.filter(c => !existingNorms.has(normalise(c.name)));

console.log(`Blog companies: ${blogCompanies.length}`);
console.log(`Already in DB: ${blogCompanies.length - toInsert.length}`);
console.log(`New to insert: ${toInsert.length}`);

if (toInsert.length === 0) {
  console.log("✅ All blog companies already in DB.");
  process.exit(0);
}

const values = toInsert.map(c => ({
  name: c.name,
  description: c.description,
  sector: c.sector,
  industry: c.sector,
  websiteUrl: c.websiteUrl,
  linkedinUrl: null as null,
  location: c.location,
  hrName: null as null,
  hrEmail: null as null,
  hrLinkedin: null as null,
  logoUrl: faviconUrl(c.websiteUrl),
  techStack: [] as string[],
  createdBy: ADMIN_ID,
}));

await db.insert(companies).values(values);
console.log(`\n✅ Inserted ${toInsert.length} new companies from Zunkiree Labs blog!`);
console.log("New companies added:");
toInsert.forEach(c => console.log(`  + ${c.name}`));
process.exit(0);
