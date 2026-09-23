import { eq, and, ilike, sql, or, lt, desc } from "drizzle-orm";
import { db } from "../../db/client";
import { companies, type Company, type NewCompany } from "../../db/schema";
import { NotFoundError } from "../../middleware/error";
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
    industry: row.industry,
    websiteUrl: row.websiteUrl ?? null,
    logoUrl: row.logoUrl ?? null,
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
    const values: NewCompany = {
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      industry: input.industry?.trim() ?? "IT",
      websiteUrl: input.websiteUrl?.trim() ?? null,
      logoUrl: input.logoUrl?.trim() ?? null,
      createdBy: adminId,
    };

    const [created] = await db.insert(companies).values(values).returning();
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
    if (input.industry !== undefined) patch.industry = input.industry.trim();
    if (input.websiteUrl !== undefined)
      patch.websiteUrl = input.websiteUrl.trim() || null;
    if (input.logoUrl !== undefined)
      patch.logoUrl = input.logoUrl.trim() || null;

    const [updated] = await db
      .update(companies)
      .set(patch)
      .where(eq(companies.id, id))
      .returning();

    return toPublicCompany(updated);
  }

  /**
   * Returns a cursor-paginated list of companies.
   *
   * Filter precedence: search > letter (per spec).
   * When search is provided, letter is ignored.
   */
  async list(query: CompanyListQueryInput): Promise<{
    data: PublicCompany[];
    pageInfo: { hasMore: boolean; nextCursor: string | null };
  }> {
    const limit = Math.min(query.limit ?? 20, 100);
    const decoded = query.cursor ? decodeCursor(query.cursor) : null;

    // Build WHERE conditions
    const conditions: ReturnType<typeof sql>[] = [];

    const search = query.search?.trim();
    const letter = query.letter?.toUpperCase();

    if (search) {
      // Case-insensitive partial match on name (search wins over letter)
      conditions.push(ilike(companies.name, `%${search}%`));
    } else if (letter) {
      // Name starts with the given letter (server-side, case-insensitive)
      conditions.push(
        or(
          ilike(companies.name, `${letter}%`),
          ilike(companies.name, `${letter.toLowerCase()}%`)
        ) as ReturnType<typeof sql>
      );
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

    return {
      data: page.map(toPublicCompany),
      pageInfo: {
        hasMore,
        nextCursor: hasMore ? encodeCursor(page[page.length - 1]) : null,
      },
    };
  }

  /**
   * Returns a single company by ID or throws 404.
   */
  async getById(id: string): Promise<PublicCompany> {
    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
    });

    if (!company) {
      throw new NotFoundError(`Company with ID "${id}" was not found.`);
    }

    return toPublicCompany(company);
  }
}

export const companiesService = new CompaniesService();
