import { eq, and, ilike, sql, or, lt, desc } from "drizzle-orm";
import { db } from "../../db/client";
import { companies, type Company, type NewCompany } from "../../db/schema";
import { NotFoundError } from "../../middleware/error";
import { globalCache } from "../../utils/cache";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyListQueryInput,
} from "./companies.model";

// ─── Cursor helpers (per API_ARCHITECTURE.md) ────────────────────────────────

function encodeCursor(row: { createdAt: Date; id: string }): string {
  return Buffer.from(`${row.createdAt.toISOString()}|${row.id}`).toString(
    "base64url"
  );
}

function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  const raw = Buffer.from(cursor, "base64url").toString("utf-8");
  const pipeIndex = raw.indexOf("|");
  const createdAt = new Date(raw.slice(0, pipeIndex));
  const id = raw.slice(pipeIndex + 1);
  return { createdAt, id };
}

// ─── Safe public company shape ────────────────────────────────────────────────

export function toPublicCompany(row: Company) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    sector: row.sector || row.industry || "Technology",
    industry: row.industry,
    websiteUrl: row.websiteUrl ?? null,
    linkedinUrl: row.linkedinUrl ?? null,
    location: row.location ?? "Kathmandu, Nepal",
    hrName: row.hrName ?? null,
    hrEmail: row.hrEmail ?? null,
    hrLinkedin: row.hrLinkedin ?? null,
    logoUrl: row.logoUrl ?? null,
    techStack: row.techStack ?? [],
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type PublicCompany = ReturnType<typeof toPublicCompany>;

export class CompaniesService {
  /**
   * Creates a new company entry. Admin-only — adminId is taken from the
   * verified JWT payload, never from the request body.
   */
  async create(input: CreateCompanyInput, adminId: string): Promise<PublicCompany> {
    const sectorVal = input.sector?.trim() || input.industry?.trim() || "Technology";
    const values: NewCompany = {
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      sector: sectorVal,
      industry: sectorVal,
      websiteUrl: input.websiteUrl?.trim() ?? null,
      linkedinUrl: input.linkedinUrl?.trim() ?? null,
      location: input.location?.trim() ?? "Kathmandu, Nepal",
      hrName: input.hrName?.trim() ?? null,
      hrEmail: input.hrEmail?.trim() ?? null,
      hrLinkedin: input.hrLinkedin?.trim() ?? null,
      logoUrl: input.logoUrl?.trim() ?? null,
      techStack: input.techStack ?? [],
      createdBy: adminId,
    };

    const [created] = await db.insert(companies).values(values).returning();
    globalCache.clearPrefix("companies:");
    return toPublicCompany(created);
  }

  /**
   * Partially updates an existing company. Admin-only.
   * Only the provided fields are patched.
   */
  async update(
    id: string,
    input: UpdateCompanyInput
  ): Promise<PublicCompany> {
    const existing = await db.query.companies.findFirst({
      where: eq(companies.id, id),
    });

    if (!existing) {
      throw new NotFoundError(`Company with ID "${id}" was not found.`);
    }

    const patch: Partial<NewCompany> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) patch.name = input.name.trim();
    if (input.description !== undefined)
      patch.description = input.description.trim() || null;
    if (input.sector !== undefined) {
      patch.sector = input.sector.trim();
      patch.industry = input.sector.trim();
    } else if (input.industry !== undefined) {
      patch.industry = input.industry.trim();
      patch.sector = input.industry.trim();
    }
    if (input.websiteUrl !== undefined)
      patch.websiteUrl = input.websiteUrl.trim() || null;
    if (input.linkedinUrl !== undefined)
      patch.linkedinUrl = input.linkedinUrl.trim() || null;
    if (input.location !== undefined)
      patch.location = input.location.trim() || null;
    if (input.hrName !== undefined)
      patch.hrName = input.hrName.trim() || null;
    if (input.hrEmail !== undefined)
      patch.hrEmail = input.hrEmail.trim() || null;
    if (input.hrLinkedin !== undefined)
      patch.hrLinkedin = input.hrLinkedin.trim() || null;
    if (input.logoUrl !== undefined)
      patch.logoUrl = input.logoUrl.trim() || null;
    if (input.techStack !== undefined)
      patch.techStack = input.techStack;

    const [updated] = await db
      .update(companies)
      .set(patch)
      .where(eq(companies.id, id))
      .returning();

    globalCache.clearPrefix("companies:");
    return toPublicCompany(updated);
  }

  /**
   * Returns a cursor-paginated list of companies.
   *
   * Filter precedence: search > letter (per spec).
   * Supports filtering by sector and tech stack. Cached for 60s.
   */
  async list(query: CompanyListQueryInput): Promise<{
    data: PublicCompany[];
    pageInfo: { hasMore: boolean; nextCursor: string | null };
  }> {
    const cacheKey = `companies:list:${JSON.stringify(query)}`;
    const cached = globalCache.get<{
      data: PublicCompany[];
      pageInfo: { hasMore: boolean; nextCursor: string | null };
    }>(cacheKey);
    if (cached) return cached;

    const limit = Math.min(query.limit ?? 50, 100);
    const decoded = query.cursor ? decodeCursor(query.cursor) : null;

    // Build WHERE conditions
    const conditions: ReturnType<typeof sql>[] = [];

    const search = query.search?.trim();
    const letter = query.letter?.toUpperCase();

    if (search) {
      // Case-insensitive match on name, sector, location, or tech stack
      conditions.push(
        or(
          ilike(companies.name, `%${search}%`),
          ilike(companies.sector, `%${search}%`),
          ilike(companies.location, `%${search}%`),
          sql`array_to_string(${companies.techStack}, ' ') ILIKE ${`%${search}%`}`
        ) as ReturnType<typeof sql>
      );
    } else if (letter) {
      // Name starts with the given letter (server-side, case-insensitive)
      conditions.push(
        or(
          ilike(companies.name, `${letter}%`),
          ilike(companies.name, `${letter.toLowerCase()}%`)
        ) as ReturnType<typeof sql>
      );
    }

    if (query.sector?.trim()) {
      conditions.push(ilike(companies.sector, `%${query.sector.trim()}%`));
    }

    if (query.tech?.trim()) {
      conditions.push(sql`${query.tech.trim()} = ANY(${companies.techStack})`);
    }

    // Cursor condition: rows before the current cursor position
    if (decoded) {
      conditions.push(
        or(
          lt(companies.createdAt, decoded.createdAt),
          and(
            eq(companies.createdAt, decoded.createdAt),
            lt(companies.id, decoded.id)
          )
        ) as ReturnType<typeof sql>
      );
    }

    const rows = await db
      .select()
      .from(companies)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(companies.createdAt), desc(companies.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const result = {
      data: page.map(toPublicCompany),
      pageInfo: {
        hasMore,
        nextCursor: hasMore ? encodeCursor(page[page.length - 1]) : null,
      },
    };

    globalCache.set(cacheKey, result, 60);
    return result;
  }

  /**
   * Returns a single company by ID or throws 404. Cached for 120s.
   */
  async getById(id: string): Promise<PublicCompany> {
    const cacheKey = `companies:id:${id}`;
    const cached = globalCache.get<PublicCompany>(cacheKey);
    if (cached) return cached;

    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
    });

    if (!company) {
      throw new NotFoundError(`Company with ID "${id}" was not found.`);
    }

    const result = toPublicCompany(company);
    globalCache.set(cacheKey, result, 120);
    return result;
  }

  /**
   * Deletes a company entry by ID. Admin only.
   */
  async delete(id: string): Promise<void> {
    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
    });

    if (!company) {
      throw new NotFoundError(`Company with ID "${id}" was not found.`);
    }

    await db.delete(companies).where(eq(companies.id, id));
    globalCache.clearPrefix("companies:");
  }
}

export const companiesService = new CompaniesService();
