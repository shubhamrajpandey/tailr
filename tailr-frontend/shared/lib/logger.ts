import * as Sentry from "@sentry/nextjs";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogMetadata {
  userId?: string;
  applicationId?: string;
  requestId?: string;
  pathname?: string;
  status?: number;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== "production";

  private formatMessage(level: LogLevel, context: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
  }

  debug(context: string, message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      if (metadata) {
        console.debug(this.formatMessage("debug", context, message), metadata);
      } else {
        console.debug(this.formatMessage("debug", context, message));
      }
    }
  }

  info(context: string, message: string, metadata?: LogMetadata) {
    if (metadata) {
      console.info(this.formatMessage("info", context, message), metadata);
    } else {
      console.info(this.formatMessage("info", context, message));
    }
  }

  warn(context: string, message: string, metadata?: LogMetadata) {
    if (metadata) {
      console.warn(this.formatMessage("warn", context, message), metadata);
    } else {
      console.warn(this.formatMessage("warn", context, message));
    }

    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureMessage(`[${context}] ${message}`, {
        level: "warning",
        extra: metadata,
      });
    }
  }

  error(context: string, message: string, error?: unknown, metadata?: LogMetadata) {
    const formatted = this.formatMessage("error", context, message);
    if (error !== undefined) {
      console.error(formatted, error, metadata || {});
    } else {
      console.error(formatted, metadata || {});
    }

    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: { context },
          extra: { message, ...metadata },
        });
      } else {
        Sentry.captureMessage(formatted, {
          level: "error",
          extra: { rawError: error, ...metadata },
        });
      }
    }
  }
}

export const logger = new Logger();
