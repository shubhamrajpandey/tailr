import { Elysia } from "elysia";
import { logger } from "../utils/logger";

/**
 * Request Correlation ID and Structured HTTP Logging Plugin.
 * - Extracts or generates X-Request-ID for distributed tracing.
 * - Injects requestId into Elysia context and response headers.
 * - Records latency and emits structured logs on request completion.
 */
export const requestLogger = new Elysia({ name: "request-logger" })
  .derive({ as: "global" }, ({ request, set }) => {
    const headerReqId = request.headers.get("x-request-id");
    const requestId = headerReqId && headerReqId.length <= 64 ? headerReqId : crypto.randomUUID();
    const startTime = performance.now();

    // Ensure response propagates the correlation ID
    set.headers["x-request-id"] = requestId;

    return {
      requestId,
      startTime,
    };
  })
  .onAfterResponse(({ request, set, path, requestId, startTime }) => {
    const durationMs = Math.round((performance.now() - (startTime || performance.now())) * 100) / 100;
    const statusCode = typeof set.status === "number" ? set.status : 200;
    const method = request.method;

    // Filter out noisy health checks in normal logs
    if (path === "/health" && statusCode === 200) {
      return;
    }

    const logContext = {
      requestId,
      method,
      path,
      statusCode,
      durationMs,
    };

    if (statusCode >= 500) {
      logger.error(`HTTP ${method} ${path} - ${statusCode}`, logContext);
    } else if (statusCode >= 400) {
      logger.warn(`HTTP ${method} ${path} - ${statusCode}`, logContext);
    } else {
      logger.info(`HTTP ${method} ${path} - ${statusCode}`, logContext);
    }
  });
