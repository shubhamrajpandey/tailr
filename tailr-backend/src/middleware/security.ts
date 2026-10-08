import { Elysia } from "elysia";
import { PayloadTooLargeError } from "./error";
import { env } from "../config/env";

const MAX_BODY_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Platform security middleware enforcing:
 * 1. Request payload size limit (10MB max to prevent memory exhaustion DoS)
 * 2. Standard OWASP secure HTTP response headers
 */
export const platformSecurity = new Elysia({ name: "platform-security" })
  .onRequest(({ request, set }) => {
    // 1. Enforce payload size limit on incoming requests
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE_BYTES) {
      set.status = 413;
      throw new PayloadTooLargeError(
        "Request payload exceeds maximum allowed limit of 10MB."
      );
    }
  })
  .onAfterHandle({ as: "global" }, ({ set }) => {
    // 2. Set defense-in-depth OWASP security headers
    set.headers["x-content-type-options"] = "nosniff";
    set.headers["x-frame-options"] = "DENY";
    set.headers["x-xss-protection"] = "0";
    set.headers["referrer-policy"] = "strict-origin-when-cross-origin";
    set.headers["permissions-policy"] = "camera=(), microphone=(), geolocation=()";

    if (env.NODE_ENV === "production") {
      set.headers["strict-transport-security"] = "max-age=31536000; includeSubDomains; preload";
    }
  });
