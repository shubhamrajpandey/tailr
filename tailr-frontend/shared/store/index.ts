import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

// ─── Store ──────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  /**
   * Serializable check middleware is enabled by default.
   * All state in this store is serializable (plain objects + primitives).
   */
  devTools: process.env.NODE_ENV !== "production",
});

// ─── Typed Helpers ───────────────────────────────────────────────────────────────

/** Infer the `RootState` type directly from the store. */
export type RootState = ReturnType<typeof store.getState>;

/** Infer the `AppDispatch` type so dispatch knows about all thunk types. */
export type AppDispatch = typeof store.dispatch;
