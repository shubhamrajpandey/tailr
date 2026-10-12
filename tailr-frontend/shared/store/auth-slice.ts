import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/shared/types/auth";
import { getStoredAuth, isTokenValid, clearStoredAuth } from "@/shared/lib/cookie";

// ─── State Shape ────────────────────────────────────────────────────────────────

export type AuthStep = "signup" | "otp" | "done";

interface AuthState {
  user: User | null;
  /** Short-lived JWT. Kept in memory only — backed by resilient storage fallback. */
  accessToken: string | null;
  isAuthenticated: boolean;
  /** Tracks which step the signup flow is on for UI coordination. */
  authStep: AuthStep;
  /**
   * True while AuthProvider's initial session verification is in-flight.
   * ProtectedRoute waits for this to be false before deciding to redirect.
   */
  isBootstrapping: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authStep: "signup",
  isBootstrapping: true,
};

// ─── Slice ──────────────────────────────────────────────────────────────────────

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Called by TanStack Query mutation callbacks on successful login,
     * OTP verification, or silent token refresh. Stores user + token in memory.
     */
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.authStep = "done";
      state.isBootstrapping = false;
    },

    /**
     * Called on logout or when the refresh-token interceptor fails.
     * Wipes all auth state so ProtectedRoute redirects to /login.
     */
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.authStep = "signup";
      state.isBootstrapping = false;
      clearStoredAuth();
    },

    /**
     * Called by signup flow to advance from 'signup' → 'otp' → 'done'.
     * Decoupled from server state — just UI coordination.
     */
    setAuthStep: (state, action: PayloadAction<AuthStep>) => {
      state.authStep = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthStep } = authSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────────────────────

export type { AuthState };
export default authSlice.reducer;
