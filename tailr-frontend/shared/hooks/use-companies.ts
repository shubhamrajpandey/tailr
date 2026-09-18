"use client";

import * as React from "react";
import { Company } from "@/shared/types/company";
import { DEMO_COMPANIES } from "@/app/(dashboard)/companies/data/demo-companies";

/**
 * Hook to manage Companies & HR directory data.
 * Currently backed by admin-managed seed data.
 * When backend API is connected, this hook can fetch from `/api/companies`.
 */
export function useCompanies() {
  const [companies] = React.useState<Company[]>(DEMO_COMPANIES);
  const [isLoaded] = React.useState<boolean>(true);

  const getCompanyById = React.useCallback(
    (id: string): Company | undefined => {
      return companies.find((c) => c.id === id);
    },
    [companies]
  );

  return {
    companies,
    isLoaded,
    totalCount: companies.length,
    getCompanyById,
  };
}
