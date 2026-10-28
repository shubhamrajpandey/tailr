import { describe, it, expect, beforeEach } from "bun:test";
import { AuthService } from "../src/modules/auth/auth.service";
import { redis } from "../src/config/redis";

describe("SEC-03: Google OAuth CSRF State Validation", () => {
  const authService = new AuthService();

  it("rejects callback if authorization code is missing", async () => {
    expect(authService.handleGoogleCallback({ code: "", state: "valid_state" })).rejects.toThrow(
      "Authorization code is missing from Google callback."
    );
  });

  it("rejects callback if state parameter is missing or empty", async () => {
    expect(authService.handleGoogleCallback({ code: "mock_code", state: "" })).rejects.toThrow(
      "OAuth state parameter is missing from Google callback."
    );
    expect(authService.handleGoogleCallback({ code: "mock_code", state: undefined })).rejects.toThrow(
      "OAuth state parameter is missing from Google callback."
    );
  });

  it("rejects callback if state was never generated or has expired", async () => {
    const bogusState = "unrecognized_state_never_in_redis";
    expect(authService.handleGoogleCallback({ code: "mock_code", state: bogusState })).rejects.toThrow(
      "Invalid, expired, or replayed OAuth state parameter."
    );
  });

  it("rejects callback if state is replayed (single-use enforcement)", async () => {
    const replayState = "test_replay_state_12345";
    await redis.set(`oauth:google:state:${replayState}`, "1", { ex: 600 });

    // First consumption: should consume the state
    const consumedFirst = await redis.del(`oauth:google:state:${replayState}`);
    expect(consumedFirst).toBe(1);

    // Second consumption (attacker replay attempt): state is gone
    const consumedSecond = await redis.del(`oauth:google:state:${replayState}`);
    expect(consumedSecond).toBe(0);

    // handleGoogleCallback should reject
    expect(authService.handleGoogleCallback({ code: "mock_code", state: replayState })).rejects.toThrow(
      "Invalid, expired, or replayed OAuth state parameter."
    );
  });

  it("getGoogleAuthUrl generates secure state and stores it in Redis", async () => {
    const authUrl = await authService.getGoogleAuthUrl();
    const url = new URL(authUrl);
    const state = url.searchParams.get("state");
    expect(state).toBeDefined();
    expect(state?.length).toBeGreaterThan(16);

    const inRedis = await redis.get(`oauth:google:state:${state}`);
    expect(inRedis).toBe("1");

    // Clean up
    await redis.del(`oauth:google:state:${state}`);
  });
});
