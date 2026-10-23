/**
 * API-aligned company shape returned by GET /companies and GET /companies/:id.
 */
export interface Company {
  id: string;
  name: string;
  description: string | null;
  sector: string;
  industry: string;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  location: string;
  hrName: string | null;
  hrEmail: string | null;
  hrLinkedin: string | null;
  logoUrl: string | null;
  techStack: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPageInfo {
  hasMore: boolean;
  nextCursor: string | null;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
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

export interface CreateCompanyInput {
  name: string;
  description?: string | null;
  sector?: string;
  industry?: string;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  location?: string;
  hrName?: string | null;
  hrEmail?: string | null;
  hrLinkedin?: string | null;
  logoUrl?: string | null;
  techStack?: string[];
}
