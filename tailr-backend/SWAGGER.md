# Tailr Platform API — Comprehensive OpenAPI & Swagger 3.0 Documentation

> **Architectural Level**: Production-Ready / Enterprise Grade  
> **Runtime**: [Bun](https://bun.sh) with [ElysiaJS](https://elysiajs.com) & [Drizzle ORM](https://orm.drizzle.team)  
> **AI Engines**: Google Gemini 2.5 Flash (`@google/genai`) with automated high-availability fallback to Groq (`llama-3.3-70b-versatile`)  
> **Database**: PostgreSQL (Neon Serverless Pooler) with SSL encryption & transaction isolation  

---

## 1. Quick Access URLs & Endpoints

When running the backend server locally (`bun run dev`):

| Resource | URL | Description |
|---|---|---|
| **Interactive Swagger UI** | [http://localhost:3001/swagger](http://localhost:3001/swagger) | Complete OpenAPI 3.0 explorer with live "Try it out" runner and Bearer authorization modal |
| **OpenAPI Specification (JSON)** | [http://localhost:3001/swagger/json](http://localhost:3001/swagger/json) | Raw OpenAPI 3.0 JSON schema for code generation, Postman, or Insomnia imports |
| **Backend Base URL** | `http://localhost:3001` | Server root with CORS configured for `http://localhost:3000` |
| **Health & Diagnostic Probe** | [http://localhost:3001/health](http://localhost:3001/health) | Real-time database connectivity and runtime uptime probe |

---

## 2. API Architecture & Security Model

The Tailr backend implements senior-tier defensive security and resilient patterns:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              HTTP Request                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Global Centralized Middleware                      │
│  - JSON Error Envelope Handler (Custom AppError, ValidationError)      │
│  - CORS with Credentials & Origin Whitelist (localhost:3000)           │
│  - Rate Limiter (Sliding Window Cooldown on Sensitive Endpoints)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Authentication Middleware                        │
│  - Bearer JWT Validation (Short-lived 15m Access Token in Authorization)│
│  - HttpOnly Cookie Validation (Long-lived 7d Refresh Token Session)    │
│  - Role Guard (Enforces 'admin' for Directory Mutations)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Module Controller & Services                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │     Auth     │ │ Applications │ │  Analytics   │ │  Companies   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│  ┌───────────────────────────────┐ ┌───────────────────────────────┐   │
│  │   Resumes & ATS Engine        │ │   Cover Letter Generator      │   │
│  │   (Gemini + LaTeX Export)     │ │   (Zero-Hallucination AI)     │   │
│  └───────────────────────────────┘ └───────────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           PostgreSQL Database                          │
│  - Drizzle ORM (Type-Safe Schema, Relations, & Migrations)             │
│  - Neon Connection Pooler with SSL Verification                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Security Highlights
- **Password Storage**: Bun-native `argon2id` (memory-hard, resistant to GPU/ASIC brute force).
- **Dual-Token Flow**: Short-lived (15-minute) Bearer JWT access token + long-lived (7-day) cryptographically random HttpOnly `SameSite=Lax` refresh cookie stored in PostgreSQL.
- **OTP Verification**: 6-digit numeric OTP hashed with SHA-256 before database persistence; automatic expiration after 10 minutes; rate-limited resend cooldown (30 seconds).
- **Gemini + Groq High Availability**: AI endpoints prioritize Google Gemini 2.5 Flash, automatically intercepting 429 / 503 quota limits to fail over to Groq without client disruption.

---

## 3. Complete API Endpoint Directory

### Tag 1: System (`System`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/health` | Server liveness and database connectivity health probe | None | `200`, `503` |

### Tag 2: Authentication & Identity (`Auth`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `POST` | `/auth/signup` | Register new user; dispatches 6-digit OTP email | None | `200`, `400`, `409` |
| `POST` | `/auth/verify-otp` | Verify 6-digit OTP code, activate user, return access token & set refresh cookie | None | `200`, `400` |
| `POST` | `/auth/resend-otp` | Resend 6-digit OTP (rate-limited cooldown) | None | `200`, `429` |
| `POST` | `/auth/login` | User credential login; returns access token & sets HttpOnly cookie | None | `200`, `401`, `403`, `429` |
| `POST` | `/auth/refresh` | Rotate access and refresh tokens from HttpOnly cookie | Cookie | `200`, `401` |
| `POST` | `/auth/logout` | Revoke session in database and clear HttpOnly cookie | Cookie | `200` |
| `GET` | `/auth/me` | Fetch authenticated user profile details | **Bearer JWT** | `200`, `401` |

### Tag 3: Applications Tracker (`Applications`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/applications` | List tracked applications (optional filter by `status`) | **Bearer JWT** | `200`, `401` |
| `POST` | `/applications` | Create and track a new job application | **Bearer JWT** | `201`, `400`, `401` |
| `GET` | `/applications/:id` | Get full details of a specific job application | **Bearer JWT** | `200`, `401`, `404` |
| `PATCH` | `/applications/:id` | Update status, interview date, salary, or notes | **Bearer JWT** | `200`, `400`, `401`, `404` |
| `DELETE` | `/applications/:id` | Permanently remove a tracked job application | **Bearer JWT** | `200`, `401`, `404` |

### Tag 4: Recruitment Analytics (`Analytics`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/analytics/overview` | Core recruitment KPI stats, response velocity, interview rates, and timeline trends | **Bearer JWT** | `200`, `401` |
| `GET` | `/analytics/funnel` | 4-stage recruitment pipeline funnel (Wishlist -> Applied -> Interview -> Offer) with drop-off analytics | **Bearer JWT** | `200`, `401` |

### Tag 5: IT Companies Directory (`Companies`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/companies` | Cursor-paginated company list with search & A–Z filtering (`?search=`, `?letter=`, `?cursor=`, `?limit=`) | **Bearer JWT** | `200`, `401` |
| `GET` | `/companies/:id` | Get single company profile by UUID | **Bearer JWT** | `200`, `401`, `404` |
| `POST` | `/admin/companies` | **Admin Only**: Create a new company profile | **Bearer JWT (Admin)** | `201`, `400`, `401`, `403` |
| `PATCH` | `/admin/companies/:id` | **Admin Only**: Update fields of an existing company | **Bearer JWT (Admin)** | `200`, `400`, `401`, `403`, `404` |

### Tag 6: AI Cover Letters (`Cover Letters`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `POST` | `/cover-letter/generate` | Generate AI-tailored cover letter strictly grounded in master resume with zero-hallucination guarantee | Optional **Bearer** | `200`, `400`, `429`, `500` |
| `GET` | `/cover-letters` | List all persistent cover letters saved by authenticated user | **Bearer JWT** | `200`, `401` |
| `POST` | `/cover-letters` | Save/create a new persistent cover letter in PostgreSQL | **Bearer JWT** | `201`, `400`, `401` |
| `GET` | `/cover-letters/:id` | Get cover letter details and full content by ID | **Bearer JWT** | `200`, `401`, `404` |
| `PUT` | `/cover-letters/:id` | Update cover letter content, status (DRAFT/FINAL), tone, or details | **Bearer JWT** | `200`, `400`, `401`, `404` |
| `DELETE` | `/cover-letters/:id` | Permanently delete a saved cover letter | **Bearer JWT** | `200`, `401`, `404` |


### Tag 7: Resumes, ATS Scoring & LaTeX (`Resumes`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/resume/master` | Retrieve active structured Master Resume (or default profile) | Optional **Bearer** | `200`, `401` |
| `POST` | `/resume` | Save or create structured Master Resume | Optional **Bearer** | `201`, `400`, `401` |
| `POST` | `/resume/upload` | Parse raw text, Markdown, or Base64 PDF into canonical ATS schema via Gemini AI | Optional **Bearer** | `201`, `400`, `401`, `429` |
| `GET` | `/resume` | List all saved resumes for authenticated user | Optional **Bearer** | `200`, `401` |
| `GET` | `/resume/:id` | Get resume by UUID | Optional **Bearer** | `200`, `401`, `404` |
| `PUT` | `/resume/:id` | Update resume by UUID | Optional **Bearer** | `200`, `400`, `401`, `404` |
| `DELETE` | `/resume/:id` | Delete resume by UUID | Optional **Bearer** | `200`, `401`, `404` |
| `POST` | `/resume/tailor` | Tailor resume for job with Gemini AI, compute 0–100 ATS score, and export LaTeX | Optional **Bearer** | `200`, `400`, `401`, `429`, `500` |
| `GET` | `/resume/tailored` | List all saved tailored resume versions | Optional **Bearer** | `200`, `401` |
| `GET` | `/resume/tailored/:id` | Get tailored resume version details, ATS score, and LaTeX source | Optional **Bearer** | `200`, `401`, `404` |

### Tag 8: User Settings & Workspace Defaults (`Settings`)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/settings` | Retrieve user workspace settings, AI configurations, UI appearance, and CRM defaults | **Bearer JWT** | `200`, `401` |
| `PUT` | `/settings` | Update workspace preferences, AI defaults, resume templates, and UI appearance | **Bearer JWT** | `200`, `400`, `401` |
| `PUT` | `/settings/profile` | Update account profile full name and email | **Bearer JWT** | `200`, `400`, `401` |
| `PUT` | `/settings/password` | Change account password (requires current password verification, hashes with Argon2id) | **Bearer JWT** | `200`, `400`, `401` |
| `GET` | `/settings/export-data` | Export all account data (profile, settings, applications, resumes, tailored versions, cover letters) | **Bearer JWT** | `200`, `401` |
| `DELETE` | `/settings/account` | Permanently delete account and all associated user data | **Bearer JWT** | `200`, `400`, `401` |

---

## 4. Step-by-Step Swagger UI Interactive Guide

Open [http://localhost:3001/swagger](http://localhost:3001/swagger) in your browser:

### Step 1: Health Check
1. Expand `GET /health` under **System**.
2. Click **Try it out** → **Execute**.
3. Verify `status: "healthy"` and `database: "connected"`.

### Step 2: Register & Authenticate
1. Expand `POST /auth/signup`.
2. Click **Try it out** and enter:
   ```json
   {
     "fullName": "Senior Engineer",
     "email": "dev@tailr.io",
     "password": "Password123!",
     "confirmPassword": "Password123!"
   }
   ```
3. Click **Execute**. In development mode, check your server console for the logged OTP:
   ```text
   [MOCK-EMAIL] To: dev@tailr.io | Subject: Your Tailr Verification Code
   [MOCK-EMAIL] Code: 123456
   ```
4. Expand `POST /auth/verify-otp`, enter your email and the 6-digit OTP code, and click **Execute**.
5. Copy the returned `accessToken` from the response JSON.

### Step 3: Authorize Swagger UI with Bearer Token
1. Scroll to the top right of the Swagger UI page and click the green **Authorize 🔓** button.
2. In the `bearerAuth` input box, enter:
   ```text
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   *(Or simply paste the token)*.
3. Click **Authorize**, then **Close**. Swagger UI will now automatically attach the `Authorization: Bearer <token>` header to all subsequent API calls!

### Step 4: Test Job Application Tracking
1. Expand `POST /applications`.
2. Click **Try it out** and enter:
   ```json
   {
     "companyName": "Cedar Gate Technologies",
     "roleTitle": "Senior Full-Stack Engineer",
     "status": "applied",
     "salary": "$80,000 - $110,000",
     "location": "Kathmandu / Hybrid",
     "jobUrl": "https://cedargate.com/careers",
     "notes": "Referred by engineering lead"
   }
   ```
3. Click **Execute**. Verify `201 Created` status with unique application UUID.

### Step 5: Test AI Resume Tailoring & ATS Scoring
1. Expand `POST /resume/tailor`.
2. Click **Try it out** and enter:
   ```json
   {
     "companyName": "Google",
     "positionTitle": "Staff Software Engineer",
     "jobDescription": "We are seeking a Staff Software Engineer with deep expertise in distributed systems, TypeScript, Bun, PostgreSQL, high-throughput microservices, and AI integrations."
   }
   ```
3. Click **Execute**. The system analyzes your master resume against the job description using Gemini AI, computes a realistic 0–100 ATS compatibility score, generates improvement tips, and returns compilable LaTeX code!

---

## 5. Standard Error Envelopes

Every error returned by the Tailr API adheres to a standardized JSON schema:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Detailed human-readable message",
    "details": null
  }
}
```

### Common HTTP Status Codes
| HTTP Status | Error Code | Description |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` / `BAD_REQUEST` | Malformed JSON or TypeBox schema violation |
| `401 Unauthorized` | `UNAUTHORIZED` | Missing, malformed, or expired Bearer access token |
| `403 Forbidden` | `FORBIDDEN` | Unverified user account or non-admin attempting admin mutation |
| `404 Not Found` | `NOT_FOUND` | Resource (resume, application, company) does not exist |
| `409 Conflict` | `CONFLICT` | Email already exists during registration |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Exceeded rate limit or AI free-tier quota |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Unexpected backend or AI engine exception |
| `503 Service Unavailable` | `SERVICE_UNAVAILABLE` | Database disconnected or downstream AI unreachable |
