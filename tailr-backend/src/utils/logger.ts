import { env } from "../config/env";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  context?: LogContext;
  error?: {
    name?: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
}

class Logger {
  private readonly serviceName = "tailr-backend";

  private formatError(err: unknown) {
    if (!err) return undefined;
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: (err as any).code || (err as any).statusCode,
      };
    }
    return { message: String(err) };
  }

  private write(level: LogLevel, message: string, context?: LogContext, err?: unknown): void {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      environment: env.NODE_ENV,
      context: context && Object.keys(context).length > 0 ? context : undefined,
      error: this.formatError(err),
    };

    if (env.NODE_ENV === "production") {
      // Production: Structured JSON logging to stdout/stderr
      const line = JSON.stringify(entry);
      if (level === "error") {
        process.stderr.write(line + "\n");
      } else {
        process.stdout.write(line + "\n");
      }
    } else if (env.NODE_ENV !== "test") {
      // Development: Readable colorized format
      const time = entry.timestamp.split("T")[1]?.slice(0, 8) || "";
      const reqId = context?.requestId ? `[${context.requestId.slice(0, 8)}] ` : "";
      const prefix = `[${time}] [${level.toUpperCase()}] ${reqId}`;
      if (level === "error") {
        console.error(`${prefix}${message}`, entry.error?.stack || entry.error?.message || "", context || "");
      } else if (level === "warn") {
        console.warn(`${prefix}${message}`, context || "");
      } else {
        console.log(`${prefix}${message}`, context || "");
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    if (env.NODE_ENV !== "production") {
      this.write("debug", message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext, err?: unknown): void {
    this.write("warn", message, context, err);
  }

  error(message: string, context?: LogContext, err?: unknown): void {
    this.write("error", message, context, err);
  }
}

export const logger = new Logger();
