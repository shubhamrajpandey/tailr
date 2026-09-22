"use client";

import { Provider } from "react-redux";
import { store } from "@/shared/store";
import type { ReactNode } from "react";

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Client-side Redux Provider wrapper.
 * Must be a "use client" component to use React context under Next.js
 * App Router. Wrap this as high as possible in the tree (root layout).
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
