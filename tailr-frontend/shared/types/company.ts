/**
 * API-aligned company shape returned by GET /companies and GET /companies/:id.
 * Explicitly excludes hiring-status, HR contacts, and application counts —
 * this is a static directory, not a job board.
 */
export interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPageInfo {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface CompanyListResponse {
  success: boolean;
  data: Company[];
  pageInfo: CompanyPageInfo;
}

export interface CompanyDetailResponse {
  success: boolean;
  data: { company: Company };
}
