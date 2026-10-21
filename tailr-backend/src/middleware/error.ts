import { Elysia } from "elysia";
import { logger } from "../utils/logger";

/**
 * Base HTTP exception class.
 */
export class HttpError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details?: unknown) {
    super(400, "BAD_REQUEST", message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(401, "UNAUTHORIZED", message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details?: unknown) {
    super(403, "FORBIDDEN", message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found", details?: unknown) {
    super(404, "NOT_FOUND", message, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict with existing resource", details?: unknown) {
    super(409, "CONFLICT", message, details);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Too many requests. Please slow down.", details?: unknown) {
    super(429, "TOO_MANY_REQUESTS", message, details);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = "Request entity too large", details?: unknown) {
    super(413, "PAYLOAD_TOO_LARGE", message, details);
  }
}

/**
 * Centralized error handler plugin for Elysia.
 * Installed directly on the Elysia app instance via .use(errorHandler)
 * to intercept all route exceptions and schema validation errors.
 */
export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    const timestamp = new Date().toISOString();

    // 1. Handled custom application errors (HttpError)
    if (error instanceof HttpError || (error as any)?.statusCode) {
      const statusCode = (error as any).statusCode || 500;
      set.status = statusCode;
      return {
        success: false,
        error: {
          code: (error as any).code || code,
          message: (error as any)?.message || "Request failed.",
          ...((error as any).details ? { details: (error as any).details } : {}),
        },
        timestamp,
      };
    }

    // 2. Elysia schema validation failures (TypeBox)
    if (code === "VALIDATION") {
      set.status = 400;
      const rawMsg = (error as any)?.message || "Validation failed";
      let parsedDetails: unknown = rawMsg;
      try {
        parsedDetails = JSON.parse(rawMsg);
      } catch {}

      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request payload failed schema validation.",
          details: parsedDetails,
        },
        timestamp,
      };
    }

    // 3. Not found routes
    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        error: {
          code: "ROUTE_NOT_FOUND",
          message: "The requested route or method does not exist.",
        },
        timestamp,
      };
    }

    // 4. PostgreSQL duplicate key violation (23505)
    if ((error as any)?.code === "23505") {
      set.status = 409;
      return {
        success: false,
        error: {
          code: "DUPLICATE_KEY",
          message: "A record with this unique identifier already exists.",
        },
        timestamp,
      };
    }

    // 5. PostgreSQL connection / network failures (e.g. ECONNREFUSED)
    const errAny = error as any;
    if (
      errAny?.code === "ECONNREFUSED" ||
      errAny?.cause?.code === "ECONNREFUSED" ||
      errAny?.message?.includes("ECONNREFUSED") ||
      errAny?.message?.includes("connect ECONNREFUSED")
    ) {
      logger.error("Database connection refused - PostgreSQL service unreachable", { code }, error);
      set.status = 503;
      return {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "Database service is currently unreachable. Ensure PostgreSQL is active on port 5432.",
        },
        timestamp,
      };
    }

    // 6. Unhandled internal server errors
    logger.error("Unhandled Server Error", { code }, error);
    set.status = 500;
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected internal server error occurred.",
      },
      timestamp,
    };
  });
