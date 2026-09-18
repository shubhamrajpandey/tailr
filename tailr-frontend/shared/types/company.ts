export type HiringStatus =
  | "ACTIVELY_HIRING"
  | "SELECTIVE"
  | "FREEZE"
  | "UNKNOWN";

export interface HRContact {
  name: string;
  title?: string;
  email?: string | null;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
  notes?: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  linkedinUrl?: string | null;
  industry: string;
  location: string;
  employeeCount?: string;
  description?: string;
  hiringStatus?: HiringStatus;
  hrContact: HRContact;
  activeApplicationsCount?: number;
  createdAt?: string;
}
