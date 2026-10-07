import { describe, it, expect } from "vitest";
import authReducer, {
  setCredentials,
  clearCredentials,
  setAuthStep,
  type AuthState,
} from "./auth-slice";

describe("authSlice reducer", () => {
  const initialAuthState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    authStep: "signup",
    isBootstrapping: true,
  };

  it("stores user credentials and access token in memory upon setCredentials", () => {
    const mockUser = {
      id: "user-101",
      email: "user@example.com",
      fullName: "Jane Doe",
      isVerified: true,
      createdAt: "2026-01-01T00:00:00Z",
    };

    const nextState = authReducer(
      initialAuthState,
      setCredentials({ user: mockUser, accessToken: "mock-jwt-token" })
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.accessToken).toBe("mock-jwt-token");
    expect(nextState.isBootstrapping).toBe(false);
    expect(nextState.authStep).toBe("done");
  });

  it("clears credentials and wipes in-memory token on clearCredentials", () => {
    const loggedInState: AuthState = {
      user: {
        id: "user-101",
        email: "user@example.com",
        fullName: "Jane Doe",
        isVerified: true,
        createdAt: "2026-01-01T00:00:00Z",
      },
      accessToken: "active-token",
      isAuthenticated: true,
      authStep: "done",
      isBootstrapping: false,
    };

    const nextState = authReducer(loggedInState, clearCredentials());

    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.accessToken).toBeNull();
    expect(nextState.isBootstrapping).toBe(false);
    expect(nextState.authStep).toBe("signup");
  });

  it("updates authStep coordinate for multi-step signup", () => {
    const nextState = authReducer(initialAuthState, setAuthStep("otp"));
    expect(nextState.authStep).toBe("otp");
  });
});
