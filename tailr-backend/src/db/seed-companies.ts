/**
 * seed-companies.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Merges two data sources:
 *   1. ../../ttcom.md   — 255 companies from the Nepal tech GitHub list
 *   2. ../../nepal_it_companies.xlsx  — 111 companies (Fintech, Banks, ISPs, etc.)
 *
 * Deduplication strategy:
 *   • Normalise company name → lowercase, strip Pvt/Ltd/Inc/Nepal/International etc.
 *   • When both sources have the same company, the XLSX richer description wins;
 *     the .md website URL is kept.
 *   • 20 overlapping companies are deduplicated automatically.
 *   • Rows already in the DB (same normalised name) are SKIPPED — safe to re-run.
 *
 * Missing fields (HR details, tech stack, etc.) are stored as null.
 *
 * Usage:
 *   SEED_USER_ID=<any-valid-user-uuid> bun run src/db/seed-companies.ts
 *
 * The SEED_USER_ID is the UUID of an existing user (the admin) that satisfies
 * the companies.created_by FK constraint.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as fs from "fs";
import * as path from "path";
import { db } from "./client";
import { companies } from "./schema";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise a company name for deduplication comparison.
 * Strips common legal suffixes and punctuation so "F1Soft International" and
 * "F1Soft" can be compared as equal.
 */
function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(
      /\s*(pvt\.?\s*ltd\.?|private\s+limited|incorporated|inc\.?|llc\.?|group|international|nepal|pvt|ltd)\s*$/g,
      ""
    )
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build favicon URL from a domain string */
function faviconUrl(domain: string): string | null {
  if (!domain) return null;
  const clean = domain.replace(/^https?:\/\//, "").split("/")[0];
  if (!clean) return null;
  return `https://www.google.com/s2/favicons?domain=${clean}&sz=128`;
}

// ── Type ──────────────────────────────────────────────────────────────────────

interface CompanyEntry {
  name: string;
  description: string | null;
  sector: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  location: string;
  hrName: string | null;
  hrEmail: string | null;
  techStack: string[];
}

// ── Source 1: Parse ttcom.md ──────────────────────────────────────────────────

function parseMdCompanies(): Map<string, CompanyEntry> {
  const candidatePaths = [
    path.resolve(__dirname, "../../data/ttcom.md"),
    path.resolve(__dirname, "../../../ttcom.md"),
  ];
  const mdPath = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];
  if (!fs.existsSync(mdPath)) {
    console.warn(`[seed] WARNING: ttcom.md not found at ${mdPath}, skipping.`);
    return new Map();
  }

  const lines = fs.readFileSync(mdPath, "utf-8").split("\n");
  // Pattern: - [Name](url) | location | description
  const re = /^-\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*\|([^|]+)\|(.+)/;

  const map = new Map<string, CompanyEntry>();

  for (const line of lines) {
    const m = re.exec(line.trim());
    if (!m) continue;

    const name = m[1].trim();
    const websiteUrl = m[2].trim();
    const rawLocation = m[3].trim();
    const description = m[4].trim() || null;

    const location = rawLocation.includes("Nepal")
      ? rawLocation
      : `${rawLocation}, Nepal`;

    const domain = websiteUrl.replace(/^https?:\/\//, "").split("/")[0];

    const key = normalise(name);
    map.set(key, {
      name,
      description,
      sector: "Technology",
      websiteUrl,
      logoUrl: faviconUrl(domain),
      location,
      hrName: null,
      hrEmail: null,
      techStack: [],
    });
  }

  console.log(`[seed] Parsed ${map.size} companies from ttcom.md`);
  return map;
}

// ── Source 2: Parse nepal_it_companies.xlsx ───────────────────────────────────

async function parseXlsxCompanies(): Promise<Map<string, CompanyEntry>> {
  let XLSX: any;
  try {
    // bun supports dynamic import of xlsx
    XLSX = await import("xlsx");
    if (XLSX.default) XLSX = XLSX.default;
  } catch {
    console.warn(
      "[seed] WARNING: xlsx package not installed. Run: bun add xlsx"
    );
    return new Map();
  }

  const candidateXlsxPaths = [
    path.resolve(__dirname, "../../data/nepal_it_companies.xlsx"),
    path.resolve(__dirname, "../../../nepal_it_companies.xlsx"),
  ];
  const xlsxPath = candidateXlsxPaths.find((p) => fs.existsSync(p)) || candidateXlsxPaths[0];
  if (!fs.existsSync(xlsxPath)) {
    console.warn(
      `[seed] WARNING: nepal_it_companies.xlsx not found at ${xlsxPath}, skipping.`
    );
    return new Map();
  }

  const workbook = XLSX.readFile(xlsxPath);
  const ws = workbook.Sheets["Companies"];
  if (!ws) {
    console.warn("[seed] WARNING: Sheet 'Companies' not found in xlsx.");
    return new Map();
  }

  const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, {
    defval: "",
  });
  const map = new Map<string, CompanyEntry>();

  for (const row of rows) {
    const name = (row["Company Name"] || "").trim();
    if (!name) continue;

    const domain = (row["Domain"] || "").trim();
    const websiteUrl = domain
      ? domain.startsWith("http")
        ? domain
        : `https://${domain}`
      : null;

    const city = (row["Location (City)"] || "Kathmandu").trim();
    const location = city.toLowerCase().includes("nepal")
      ? city
      : `${city}, Nepal`;

    const description = (row["Company Description"] || "").trim() || null;
    const sector = (row["Sector"] || "Technology").trim();
    const hrName = (row["HR Name"] || "").trim() || null;
    const hrEmail = (row["HR Email"] || "").trim() || null;
    const techRaw = (row["Tech Stack"] || "").trim();
    const techStack = techRaw
      ? techRaw
          .split(/[,;]/)
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const key = normalise(name);
    map.set(key, {
      name,
      description,
      sector,
      websiteUrl,
      logoUrl: faviconUrl(domain),
      location,
      hrName,
      hrEmail,
      techStack,
    });
  }

  console.log(
    `[seed] Parsed ${map.size} companies from nepal_it_companies.xlsx`
  );
  return map;
}

// ── Merge ─────────────────────────────────────────────────────────────────────

function mergeSources(
  mdMap: Map<string, CompanyEntry>,
  xlsxMap: Map<string, CompanyEntry>
): CompanyEntry[] {
  const merged = new Map<string, CompanyEntry>(mdMap);
  let overlapCount = 0;

  for (const [key, xlsxEntry] of xlsxMap) {
    if (merged.has(key)) {
      // Already exists from MD — enrich it with XLSX fields
      const existing = merged.get(key)!;
      overlapCount++;
      const xlsxDescLen = xlsxEntry.description?.length ?? 0;
      const existingDescLen = existing.description?.length ?? 0;
      merged.set(key, {
        ...existing,
        // Prefer xlsx description if it's more informative
        description:
          xlsxEntry.description && xlsxDescLen > existingDescLen
            ? xlsxEntry.description
            : existing.description,
        // Prefer xlsx sector if it's more specific than generic "Technology"
        sector:
          xlsxEntry.sector && xlsxEntry.sector !== "Technology"
            ? xlsxEntry.sector
            : existing.sector,
        // Use xlsx HR data if available
        hrName: xlsxEntry.hrName ?? existing.hrName,
        hrEmail: xlsxEntry.hrEmail ?? existing.hrEmail,
        // Merge tech stacks
        techStack: [
          ...new Set([...existing.techStack, ...xlsxEntry.techStack]),
        ],
        // Keep md logo (has real domain) if xlsx logo is null
        logoUrl: existing.logoUrl ?? xlsxEntry.logoUrl,
      });
    } else {
      // New company only in xlsx
      merged.set(key, xlsxEntry);
    }
  }

  console.log(
    `[seed] Merged: ${merged.size} unique companies (${overlapCount} duplicates removed)`
  );
  return Array.from(merged.values());
}

// ── DB: Get existing names to avoid re-inserting ──────────────────────────────

async function getExistingNormalisedNames(): Promise<Set<string>> {
  const rows = await db.select({ name: companies.name }).from(companies);
  return new Set(rows.map((r) => normalise(r.name)));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const adminId = process.env.SEED_USER_ID;
  if (!adminId) {
    console.error("❌  ERROR: Set SEED_USER_ID env var to a valid user UUID.");
    console.error(
      "   Example: SEED_USER_ID=<uuid> bun run src/db/seed-companies.ts"
    );
    process.exit(1);
  }

  console.log("🌱 Tailr Company Seed — Nepal IT Companies");
  console.log("===========================================");

  // 1. Parse both sources
  const mdMap = parseMdCompanies();
  const xlsxMap = await parseXlsxCompanies();

  // 2. Merge + deduplicate
  const allEntries = mergeSources(mdMap, xlsxMap);

  // 3. Get already-seeded names from DB
  const existingNames = await getExistingNormalisedNames();
  const toInsert = allEntries.filter(
    (e) => !existingNames.has(normalise(e.name))
  );

  console.log(`[seed] Already in DB: ${existingNames.size}`);
  console.log(`[seed] To insert:     ${toInsert.length}`);

  if (toInsert.length === 0) {
    console.log("✅ Nothing new to insert. Database is already up-to-date.");
    process.exit(0);
  }

  // 4. Batch insert in chunks of 50
  const CHUNK = 50;
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK);
    const values = chunk.map((e) => ({
      name: e.name,
      description: e.description ?? null,
      sector: e.sector || "Technology",
      industry: e.sector || "Technology",
      websiteUrl: e.websiteUrl ?? null,
      linkedinUrl: null as null,
      location: e.location || "Kathmandu, Nepal",
      hrName: e.hrName ?? null,
      hrEmail: e.hrEmail ?? null,
      hrLinkedin: null as null,
      logoUrl: e.logoUrl ?? null,
      techStack: e.techStack.length > 0 ? e.techStack : [],
      createdBy: adminId,
    }));

    await db.insert(companies).values(values);
    inserted += chunk.length;
    console.log(`[seed] Inserted ${inserted}/${toInsert.length}...`);
  }

  console.log(`\n✅ Done! Seeded ${inserted} companies into the database.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
