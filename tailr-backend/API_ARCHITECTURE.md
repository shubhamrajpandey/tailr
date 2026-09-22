# API_ARCHITECTURE.md

A single reference for how APIs in this codebase should be designed —
covering pagination, security, performance, and resilience. Any AI
agent (or human) adding a new endpoint should follow this before
writing route code. This complements `AGENT.md` (folder/architecture
rules) and `CLAUDE.md` (Claude-specific workflow) — read those too.

---

## 1. Resource & Route Design

- **Nouns, not verbs.** `GET /users/:id`, not `GET /getUser`.
- **Plural resource names.** `/orders`, `/orders/:id/items`.
- **Version the API from day one.** Prefix routes: `/v1/auth/login`.
  Never break `/v1` once a client depends on it — ship `/v2` alongside
  it instead of mutating `/v1` in place.
- **Nest sparingly.** One level of nesting max
  (`/users/:id/orders`), not `/users/:id/orders/:id/items/:id`. Deep
  nesting → promote the child to its own top-level resource with a
  filter (`/order-items?orderId=...`).
- **Consistent envelope.** Every success response:
  ```json
  { "message": "...", "data": { } }
  ```
  Every error response (already enforced by `middleware/errorHandler.ts`):
  ```json
  { "error": { "code": "SOME_CODE", "message": "Human readable." } }
  ```
  A client should never need to branch on response *shape* — only on
  status code and `error.code`.

---

## 2. Pagination

**Never return an unbounded list.** Every collection endpoint must
paginate, even if you're sure the table is small today.

### Use cursor-based pagination, not offset, for anything user-facing or growing

| | Offset (`?page=3&limit=20`) | Cursor (`?cursor=xyz&limit=20`) |
|---|---|---|
| Perf at scale | Degrades — `OFFSET 100000` still scans+discards 100k rows | Stays O(log n) with an indexed column |
| Consistency | Items shift/duplicate if rows are inserted/deleted between pages | Stable — cursor pins to a specific row |
| Use when | Small, static datasets; "jump to page N" UI | Feeds, infinite scroll, anything growing or real-time |

**Implementation pattern (Drizzle + Postgres), cursor on `(created_at, id)` for a stable tie-break:**

```ts
// auth.model.ts (or the relevant module's model file)
export const ListQuery = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
  cursor: t.Optional(t.String()), // base64( `${created_at_iso}|${id}` )
});
```

```ts
// service layer
function encodeCursor(row: { createdAt: Date; id: string }) {
  return Buffer.from(`${row.createdAt.toISOString()}|${row.id}`).toString("base64url");
}

function decodeCursor(cursor: string) {
  const [createdAt, id] = Buffer.from(cursor, "base64url").toString().split("|");
  return { createdAt: new Date(createdAt), id };
}

async function listItems(limit: number, cursor?: string) {
  const decoded = cursor ? decodeCursor(cursor) : null;

  const rows = await db.query.items.findMany({
    where: decoded
      ? or(
          lt(items.createdAt, decoded.createdAt),
          and(eq(items.createdAt, decoded.createdAt), lt(items.id, decoded.id))
        )
      : undefined,
    orderBy: [desc(items.createdAt), desc(items.id)],
    limit: limit + 1, // fetch one extra to know if there's a next page
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  return {
    data: page,
    pageInfo: {
      hasMore,
      nextCursor: hasMore ? encodeCursor(page[page.length - 1]) : null,
    },
  };
}
```

**Response shape:**
```json
{
  "data": [ { "...": "..." } ],
  "pageInfo": { "hasMore": true, "nextCursor": "MjAyNi0wOS0yMH..." }
}
```

**Rules:**
- Always cap `limit` server-side (e.g. max 100) — never trust a client-supplied limit unbounded.
- Always index the column(s) you paginate/sort on. An unindexed `ORDER BY` under pagination is the #1 cause of "the API got slow as the table grew."
- Return `hasMore` explicitly; don't make the client guess from `data.length < limit` (breaks if `limit` was clamped).

---

## 3. Security

### 3.1 Input validation
- Every route validates `body`, `query`, and `params` with Elysia's `t.Object` schemas — no exceptions, no "trust the frontend." This is already enforced pattern-wide (see `auth.model.ts`).
- Reject unknown fields where practical (Elysia does this by default with `t.Object` unless `additionalProperties` is relaxed) — don't silently accept extra payload.

### 3.2 AuthN / AuthZ
- Access tokens: short-lived (15m), sent via `Authorization: Bearer`, verified in `authGuard` — never trust a `userId` passed in the request body.
- Refresh tokens: HttpOnly, Secure (prod), SameSite=Lax cookie, scoped `path`, stored hashed server-side so they're revocable (see `auth.service.ts`).
- **Authorization is per-resource, not just per-route.** `GET /orders/:id` must check the order belongs to `userId`, not just that *a* valid token was presented. A valid JWT proves identity, not ownership — check ownership in the service layer on every read/write of a user-scoped resource.

### 3.3 Injection & data handling
- Drizzle's query builder parameterizes queries — never string-concatenate raw SQL with user input. If you must drop to `sql\`...\`` for a complex query, use `sql\`${value}\`` tagged interpolation, never template literals with `+`.
- Sanitize/escape anything rendered into HTML emails (`utils/email.ts`) to prevent HTML injection via `fullName` etc.

### 3.4 Transport & headers
- Enforce HTTPS in production (terminate TLS at the load balancer/reverse proxy; redirect HTTP → HTTPS).
- Set security headers on every response — add a small plugin:
  ```ts
  new Elysia().onAfterHandle(({ set }) => {
    set.headers["X-Content-Type-Options"] = "nosniff";
    set.headers["X-Frame-Options"] = "DENY";
    set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    set.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
  });
  ```
- CORS: `origin` pinned to the real client URL + `credentials: true` (already configured in `index.ts`) — never `origin: "*"` on a credentialed API.

### 3.5 Rate limiting & abuse prevention
- Every public, auth-adjacent, or expensive endpoint goes through `rateLimit()` (already applied to signup/login/OTP). Tune limits per endpoint: tighter on `resend-otp` (abuse = spam/cost) than on `login`.
- At the infra layer, put the whole API behind a WAF/edge rate limiter (Cloudflare, AWS WAF) as a second line of defense — the in-process limiter alone won't survive a distributed attack.

### 3.6 Secrets & least privilege
- All secrets via `env.ts`, never hardcoded, never logged (audit any `console.log` near auth code).
- Database user for the app should have only the privileges it needs (no `DROP`, no access to other schemas) — don't run the app as the Postgres superuser.
- Rotate JWT secrets and DB credentials on a schedule; design token verification to tolerate a brief dual-secret rotation window if this matters for your deployment.

### 3.7 OWASP API Security Top 10 — quick self-check for any new endpoint
1. Broken object-level authorization → check resource ownership, not just token validity.
2. Broken authentication → covered by JWT/refresh design above.
3. Broken object property-level authorization → don't let a client update fields it shouldn't (e.g. `isEmailVerified`, `role`) — only whitelist mutable fields in your update schema.
4. Unrestricted resource consumption → pagination caps, rate limits, request body size limits.
5. Broken function-level authorization → admin routes check role, not just "logged in."
6. Unrestricted access to sensitive business flows → rate-limit OTP/password-reset specifically.
7. SSRF → never fetch a user-supplied URL server-side without an allowlist.
8. Security misconfiguration → no verbose errors/stack traces in prod (`errorHandler.ts` already handles this).
9. Improper inventory management → keep `/v1` vs `/v2` clearly documented; retire old versions deliberately.
10. Unsafe consumption of APIs → validate/sanitize responses from third-party APIs (Resend, etc.) before trusting them.

---

## 4. Performance

### 4.1 Database
- **Index every column used in `WHERE`, `ORDER BY`, or a join** — already done for `email`, `userId` lookups in `schema.ts`; extend this discipline to new tables.
- **Avoid N+1 queries.** Use Drizzle's relational query API (`with: { ... }`) to fetch related rows in one round trip instead of looping and querying per-row.
- **Connection pooling** is already configured (`db/client.ts`, `max: 10`) — tune `max` to your DB plan's connection limit, not arbitrarily high.
- **Select only needed columns** on hot paths instead of `SELECT *` — smaller payloads, less I/O.

### 4.2 Caching
- Add `Cache-Control` headers on cacheable `GET` endpoints (public, non-personalized data): `Cache-Control: public, max-age=60`.
- For personalized data, use `Cache-Control: private, no-store` explicitly rather than leaving it unset.
- Use `ETag` / conditional requests (`If-None-Match`) for expensive-to-compute-but-rarely-changing resources — return `304 Not Modified` instead of the full body.
- For read-heavy, expensive queries, consider an application-level cache (Redis) with a short TTL — invalidate on write, don't just rely on TTL expiry for correctness-sensitive data.

### 4.3 Payload & transport
- Enable gzip/brotli compression at the reverse proxy (or Elysia's compression plugin) for JSON responses over a size threshold.
- Keep responses lean — don't return fields the client doesn't need; add a `?fields=` param for large resources if different consumers need different subsets.

### 4.4 Async & I/O
- Never block the event loop with synchronous heavy computation (e.g. CPU-bound hashing loops) — offload to a worker if it exceeds a few ms; `Bun.password.hash` is already async and appropriately expensive-but-bounded for auth.
- Fire-and-forget work that doesn't need to block the response (e.g. analytics events) should be queued, not awaited inline.

---

## 5. Resilience & Reliability ("don't break under load or failure")

### 5.1 Timeouts everywhere
- Set explicit timeouts on outbound calls (email provider, any third-party API) — an unbounded `fetch` can hang a request indefinitely and exhaust connections. Wrap with `AbortController`:
  ```ts
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  ```

### 5.2 Idempotency
- **Mutating endpoints that might be retried by the client (payments, signup, order creation) should accept an `Idempotency-Key` header.** Store `(key, response)` and return the cached response on a duplicate key within a TTL window, instead of re-executing the side effect. This is what makes "user double-clicks submit" or "client retries after a timeout" safe.

### 5.3 Retries with backoff (for calls *this* service makes outward)
- Retry transient failures (5xx, network errors) with exponential backoff + jitter, capped attempts (e.g. 3):
  ```ts
  async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === attempts - 1) throw err;
        const delay = Math.min(1000 * 2 ** i, 8000) + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw new Error("unreachable");
  }
  ```
- Never retry a non-idempotent operation blindly (e.g. "send OTP email") without a dedupe/idempotency mechanism, or you'll double-send.

### 5.4 Circuit breaking & graceful degradation
- If a downstream dependency (email provider, third-party API) is failing repeatedly, stop hammering it — trip a circuit breaker for a cooldown window and fail fast instead of piling up slow/hanging requests.
- Design non-critical-path failures to degrade, not cascade: e.g. if email sending fails during signup, the user account should still be created (queue the email for retry) rather than the whole signup transaction rolling back — decide per-flow which failures are "hard fail" vs "soft fail, retry async."

### 5.5 Database transactions
- Wrap multi-step writes that must succeed or fail together in a Drizzle transaction:
  ```ts
  await db.transaction(async (tx) => {
    await tx.insert(users).values(...);
    await tx.insert(otps).values(...);
  });
  ```
  Don't leave the system in a half-written state if step 2 fails.

### 5.6 Health checks & graceful shutdown
- `/health` (already present) should be a **liveness** check (is the process up). Add a **readiness** check (`/ready`) that verifies the DB connection is actually reachable — load balancers should only route traffic once `/ready` passes.
- On `SIGTERM` (container redeploy/scale-down), stop accepting new connections, let in-flight requests finish, then close the DB pool — don't hard-kill mid-request:
  ```ts
  process.on("SIGTERM", async () => {
    console.log("Shutting down gracefully...");
    await app.stop();
    process.exit(0);
  });
  ```

### 5.7 Observability
- **Structured logging**, not `console.log` strings — JSON logs with a request ID so you can trace one request across services:
  ```ts
  new Elysia().derive(() => ({ requestId: crypto.randomUUID() }))
    .onAfterHandle(({ requestId, request, set }) => {
      console.log(JSON.stringify({ requestId, method: request.method, path: request.url, status: set.status }));
    });
  ```
- Propagate/log a `requestId` in every error response in non-prod so a client bug report can be matched to server logs.
- Track and alert on: error rate, p95/p99 latency, DB pool saturation, rate-limit rejections spiking (signal of an attack or a broken client retry loop).

### 5.8 Backpressure
- Cap request body size (`Content-Length` limit) so a large payload can't exhaust memory.
- Under sustained overload, prefer shedding load with `503 Service Unavailable` + `Retry-After` over queuing requests indefinitely and falling over.

---

## 6. Checklist for every new endpoint

- [ ] Route is versioned (`/v1/...`)
- [ ] Request validated with a Elysia `t.Object` schema (body/query/params)
- [ ] Auth: does it need `authGuard`? Does it check *ownership*, not just identity?
- [ ] Rate-limited if public or expensive
- [ ] Paginated if it returns a list, with a capped `limit` and cursor
- [ ] Errors thrown as `AppError` with a stable `code`, never raw messages leaked in prod
- [ ] DB queries indexed on filter/sort columns; no N+1
- [ ] Multi-step writes wrapped in a transaction
- [ ] Outbound calls have a timeout; retries (if any) are idempotency-safe
- [ ] Cache-Control set explicitly (even if `no-store`)
- [ ] Logged with a request ID; no secrets/PII in logs
