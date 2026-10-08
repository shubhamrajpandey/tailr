import { logger } from "./logger";

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface Job<TInput = unknown, TOutput = unknown> {
  id: string;
  type: string;
  userId: string;
  input: TInput;
  output?: TOutput;
  status: JobStatus;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export type JobHandler<TInput = any, TOutput = any> = (input: TInput, job: Job<TInput, TOutput>) => Promise<TOutput>;

/**
 * High-performance Asynchronous Job Queue for offloading long-running operations
 * (e.g. AI tailoring, document compiling) from blocking synchronous HTTP loops.
 * Compatible with horizontal distributed queue upgrades (e.g., BullMQ / Redis).
 */
export class AsyncJobQueue {
  private jobs = new Map<string, Job<any, any>>();
  private handlers = new Map<string, JobHandler<any, any>>();
  private isProcessing = false;
  private queue: string[] = [];

  constructor() {
    // Prune completed/failed jobs older than 1 hour to prevent memory leaks
    setInterval(() => {
      const oneHourAgo = Date.now() - 3600000;
      for (const [id, job] of this.jobs.entries()) {
        if ((job.status === "completed" || job.status === "failed") && (job.completedAt || 0) < oneHourAgo) {
          this.jobs.delete(id);
        }
      }
    }, 600000).unref();
  }

  /**
   * Registers a worker handler for a specific job task type.
   */
  registerHandler<TInput, TOutput>(type: string, handler: JobHandler<TInput, TOutput>): void {
    this.handlers.set(type, handler);
  }

  /**
   * Submits a new asynchronous job into the queue.
   */
  enqueue<TInput, TOutput>(
    type: string,
    input: TInput,
    userId: string,
    options?: { maxAttempts?: number }
  ): string {
    const id = `job_${crypto.randomUUID()}`;
    const job: Job<TInput, TOutput> = {
      id,
      type,
      userId,
      input,
      status: "queued",
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      createdAt: Date.now(),
    };

    this.jobs.set(id, job);
    this.queue.push(id);
    logger.info(`[JobQueue] Enqueued job ${id} (type: ${type}) for user ${userId}`);

    // Trigger queue processing worker
    this.processNext();
    return id;
  }

  /**
   * Retrieves current status and output for a job by ID.
   */
  getJob<TInput = unknown, TOutput = unknown>(id: string): Job<TInput, TOutput> | undefined {
    return this.jobs.get(id);
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const jobId = this.queue.shift();
    if (!jobId) {
      this.isProcessing = false;
      return;
    }

    const job = this.jobs.get(jobId);
    if (!job) {
      this.isProcessing = false;
      return this.processNext();
    }

    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.error = `No worker registered for job type: ${job.type}`;
      job.completedAt = Date.now();
      logger.error(`[JobQueue] Missing handler for job ${job.id}`);
      this.isProcessing = false;
      return this.processNext();
    }

    job.status = "processing";
    job.startedAt = Date.now();
    job.attempts += 1;

    try {
      logger.info(`[JobQueue] Processing job ${job.id} (attempt ${job.attempts}/${job.maxAttempts})`);
      const result = await handler(job.input, job);
      job.output = result;
      job.status = "completed";
      job.completedAt = Date.now();
      logger.info(`[JobQueue] Completed job ${job.id} in ${job.completedAt - job.startedAt}ms`);
    } catch (err: any) {
      if (job.attempts < job.maxAttempts) {
        logger.warn(`[JobQueue] Retrying job ${job.id} after error: ${err?.message || err}`);
        this.queue.push(job.id);
      } else {
        job.status = "failed";
        job.error = err?.message || String(err);
        job.completedAt = Date.now();
        logger.error(`[JobQueue] Job ${job.id} permanently failed: ${job.error}`);
      }
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }
}

export const asyncJobQueue = new AsyncJobQueue();
