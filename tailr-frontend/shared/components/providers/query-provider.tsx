"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * Creates a new QueryClient per component mount (Next.js App Router pattern).
 * This prevents state from leaking between requests during SSR and ensures
 * each browser session starts fresh.
 *
 * Config rationale:
 * - retry: 1    → auth endpoints fail fast; 3 retries hammer a locked account
 * - refetchOnWindowFocus: false → auth state lives in Redux; no silent re-fetches
 * - staleTime: 0 → mutations always go to the network, no stale-while-revalidate
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
      mutations: {
        retry: 0, // mutations never retry automatically — user should re-submit
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new client if we don't already have one.
  // This prevents re-creating on every render while avoiding
  // sharing between server requests.
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // NOTE: Avoid useState when initializing the client if you don't have a
  // Suspense boundary between this and the code that may throw.
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
