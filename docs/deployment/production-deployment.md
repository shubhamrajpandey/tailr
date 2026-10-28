# Tailr — Production Deployment & Infrastructure Guide

> Complete deployment and infrastructure plan for Tailr.
>
> **Development:** Everything runs locally.
>
> **Production:** Frontend on Vercel, backend/n8n on Render, PostgreSQL on persistent managed hosting, files on object storage, and UptimeRobot for monitoring.

---

# 1. Tailr Production Goal

Tailr is a job-application copilot that helps users:

* Store a master resume
* Store job applications
* Store company and job information
* Analyze job descriptions
* Tailor an existing resume according to a job description
* Generate cover letters
* Generate properly formatted PDF resumes
* Track application status
* Store application history
* Manage notes and related information

The production architecture should separate:

```text
Application Backend
```

from:

```text
Automation / AI Processing
```

---

# 2. High-Level Production Architecture

```text
                         INTERNET
                            |
              +-------------+-------------+
              |                           |
              v                           v
           Vercel                       Render
              |                           |
              |                     ElysiaJS API
              |                           |
              |                  +--------+--------+
              |                  |                 |
              |                  v                 v
              |             PostgreSQL           n8n
              |                                    |
              |                                    v
              |                              Gemini API
              |
              v
         Tailr Frontend

                     |
                     v

              Object Storage
          Resume / PDF / Files
```

---

# 3. Production Components

| Component        | Technology                              | Purpose                          |
| ---------------- | --------------------------------------- | -------------------------------- |
| Frontend         | Next.js                                 | Tailr UI                         |
| Frontend Hosting | Vercel                                  | Deploy Next.js                   |
| Backend          | ElysiaJS                                | API and business logic           |
| Backend Hosting  | Render                                  | Deploy ElysiaJS                  |
| Database         | PostgreSQL                              | Application data                 |
| Automation       | n8n                                     | AI workflow orchestration        |
| AI               | Gemini API                              | JD analysis and resume tailoring |
| File Storage     | Cloudinary / S3 / R2 / Supabase Storage | Resume and PDF storage           |
| Source Control   | GitHub                                  | Code repository                  |
| Monitoring       | UptimeRobot                             | Availability monitoring          |
| DNS              | Domain provider                         | Custom domains                   |
| HTTPS            | Vercel/Render                           | Secure HTTPS                     |
| CI/CD            | GitHub + Vercel + Render                | Automatic deployment             |

---

# 4. Development vs Production

## Development

Everything should run locally.

```text
Next.js
localhost:3000

ElysiaJS
localhost:3001

PostgreSQL
localhost:5432

n8n
localhost:5678

Gemini
External API
```

Example:

```text
Browser
   |
   v
Next.js :3000
   |
   v
ElysiaJS :3001
   |
   +------> PostgreSQL
   |
   +------> n8n :5678
                |
                v
             Gemini
```

---

# 5. Production

Production should look like:

```text
User
 |
 v
https://app.tailr.example
 |
 v
Next.js on Vercel
 |
 v
https://api.tailr.example
 |
 v
ElysiaJS on Render
 |
 +-----------> PostgreSQL
 |
 +-----------> n8n on Render
                  |
                  v
              Gemini API
```

Files:

```text
Resume/PDF
   |
   v
Object Storage
   |
   v
File URL / Key
   |
   v
PostgreSQL
```

---

# 6. Recommended Domain Structure

Use separate subdomains.

```text
tailr.example.com
```

Marketing website or main landing page.

```text
app.tailr.example.com
```

Tailr application.

```text
api.tailr.example.com
```

ElysiaJS backend.

```text
n8n.tailr.example.com
```

n8n dashboard/webhooks.

Example:

```text
Frontend
https://app.tailr.example.com

Backend
https://api.tailr.example.com

n8n
https://n8n.tailr.example.com
```

---

# 7. GitHub

GitHub should be the source of truth for the code.

Possible repository structure:

```text
tailr/
├── frontend/
├── backend/
├── n8n/
├── docs/
└── README.md
```

Or use separate repositories:

```text
tailr-frontend
tailr-backend
tailr-n8n
```

Either approach is valid.

For a single developer, a monorepo can be easier to manage.

---

# 8. Deployment Strategy

Do not deploy everything immediately.

Use this process:

```text
BUILD LOCALLY
      |
      v
TEST LOCALLY
      |
      v
COMMIT TO GITHUB
      |
      v
DEPLOY BACKEND
      |
      v
DEPLOY n8n
      |
      v
CONNECT GEMINI
      |
      v
DEPLOY FRONTEND
      |
      v
CONFIGURE DOMAIN
      |
      v
MONITOR
      |
      v
PRODUCTION TEST
```

---

# 9. Next.js Deployment

Use Vercel for the Next.js frontend.

Process:

```text
GitHub
   |
   v
Vercel
   |
   v
Import tailr repository
   |
   v
Configure environment variables
   |
   v
Deploy
```

Production:

```text
https://app.tailr.example.com
```

---

# 10. Next.js Environment Variables

Example:

```env
NEXT_PUBLIC_API_URL=https://api.tailr.example.com
NEXT_PUBLIC_APP_URL=https://app.tailr.example.com
```

Only variables that are intentionally public should use:

```text
NEXT_PUBLIC_
```

Never put secrets in frontend variables.

Never put these in Next.js public variables:

```env
DATABASE_URL=
GEMINI_API_KEY=
JWT_SECRET=
N8N_WEBHOOK_SECRET=
```

---

# 11. ElysiaJS Backend

ElysiaJS is the main Tailr backend.

It should control:

```text
Authentication
Authorization
Users
Applications
Companies
Jobs
Master resumes
Tailored resumes
Cover letters
Application status
Notes
File metadata
AI request permissions
Database access
```

n8n should not replace ElysiaJS.

---

# 12. ElysiaJS Deployment on Render

Create a Render Web Service.

General configuration:

```text
Service:
Web Service

Source:
GitHub

Runtime:
Node/Bun depending on project setup
```

Example build:

```bash
bun install
bun run build
```

Example start:

```bash
bun run start
```

Use the actual scripts from the Tailr backend.

---

# 13. Render Port

The backend must listen on Render's assigned port.

Do not hard-code:

```text
localhost:3001
```

for production.

Use:

```env
PORT=3001
```

or the platform-provided port mechanism supported by the runtime.

The server should listen on:

```text
0.0.0.0
```

rather than only:

```text
localhost
```

---

# 14. Backend Health Endpoint

Create:

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

Production example:

```text
https://api.tailr.example.com/health
```

This endpoint is useful for:

* Render health checks
* UptimeRobot
* Debugging
* Deployment verification

The health endpoint should be lightweight.

---

# 15. PostgreSQL

PostgreSQL stores Tailr's structured application data.

Suggested tables:

```text
users
sessions
companies
job_descriptions
applications
master_resumes
tailored_resumes
cover_letters
files
application_events
notes
ai_usage
```

Example relationship:

```text
User
 |
 +---- Applications
 |
 +---- Master Resumes
 |
 +---- Tailored Resumes
 |
 +---- Cover Letters
 |
 +---- Notes
```

---

# 16. PostgreSQL Production Rule

Do not use temporary/expiring free database storage for important production data.

Render's Free PostgreSQL offering has limitations including expiration.

Therefore:

```text
Development
    |
    v
Local PostgreSQL

Temporary MVP
    |
    v
Free/temporary PostgreSQL if appropriate

Real production
    |
    v
Persistent managed PostgreSQL
```

Possible managed PostgreSQL providers include:

```text
Neon
Supabase
Render paid PostgreSQL
Other reliable managed PostgreSQL providers
```

Choose based on current pricing, region, backups, limits, and requirements.

---

# 17. Database Environment Variable

Backend:

```env
DATABASE_URL=postgresql://...
```

Never commit the actual production connection string to GitHub.

Use:

```text
Render Environment Variables
```

or the secret-management system of the chosen provider.

---

# 18. Database Migrations

Use migrations.

Development:

```text
Create migration
      |
      v
Test locally
      |
      v
Commit migration
```

Production:

```text
Deploy backend
      |
      v
Run migration
      |
      v
Verify database
```

Never randomly modify production tables manually without knowing the consequences.

---

# 19. File Storage

Do not use Render's local filesystem as permanent storage for user files.

Store:

```text
Master resume PDFs
Tailored resume PDFs
Cover letter PDFs
Profile files
Other uploaded documents
```

in object storage.

Possible choices:

```text
Cloudinary
Cloudflare R2
Amazon S3
Supabase Storage
Other S3-compatible storage
```

---

# 20. File Storage Architecture

```text
User
 |
 v
Next.js
 |
 v
ElysiaJS
 |
 v
Object Storage
 |
 +---- Resume PDF
 +---- Tailored Resume PDF
 +---- Cover Letter PDF
 |
 v
PostgreSQL
 |
 +---- file ID
 +---- storage key
 +---- URL
 +---- mime type
 +---- size
 +---- owner ID
```

---

# 21. n8n's Role

n8n is the automation layer.

It should handle:

```text
JD analysis
Resume tailoring
Cover-letter generation
AI workflows
External API workflows
Scheduled automation
Workflow orchestration
```

It should NOT become the primary source of truth for:

```text
Users
Applications
Authentication
Database ownership
Authorization
```

Those belong in ElysiaJS/PostgreSQL.

---

# 22. n8n Production Architecture

```text
ElysiaJS
   |
   | HTTP request
   v
n8n Webhook
   |
   v
Validate input
   |
   v
Prepare data
   |
   v
Gemini
   |
   v
Validate AI output
   |
   v
Callback to ElysiaJS
   |
   v
PostgreSQL
```

---

# 23. Deploying n8n on Render

Render supports deploying self-hosted n8n.

Recommended approach:

```text
Render
 |
 +---- n8n Web Service
 |
 +---- PostgreSQL
```

Use Render's official n8n deployment/template as the starting point.

Do not blindly copy an old Instagram/YouTube tutorial because n8n and Render configuration can change.

---

# 24. n8n Database

n8n itself needs persistent storage for its internal data.

That includes things such as:

```text
Workflows
Credentials
Execution information
n8n configuration
```

Use PostgreSQL for n8n.

Important:

```text
Tailr PostgreSQL
```

and

```text
n8n PostgreSQL
```

are conceptually separate.

You can use separate databases or carefully separated schemas/instances depending on your infrastructure design.

For simplicity, separate databases are easier to reason about.

---

# 25. n8n Public URL

Production n8n should have a public HTTPS URL.

Example:

```text
https://n8n.tailr.example.com
```

or:

```text
https://tailr-n8n.onrender.com
```

---

# 26. n8n WEBHOOK_URL

Configure the production webhook URL.

Example:

```env
WEBHOOK_URL=https://n8n.tailr.example.com/
```

If using Render's generated URL:

```env
WEBHOOK_URL=https://tailr-n8n.onrender.com/
```

After changing this:

```text
Save
  |
Restart/redeploy n8n
  |
Open workflow
  |
Check webhook URL
```

---

# 27. n8n Webhook

Example:

```text
POST /webhook/tailr-tailor
```

Production:

```text
https://n8n.tailr.example.com/webhook/tailr-tailor
```

The frontend should NOT directly call this webhook.

Correct:

```text
Frontend
   |
   v
ElysiaJS
   |
   v
n8n
```

Not:

```text
Frontend
   |
   v
n8n
```

---

# 28. Secure the n8n Webhook

Never leave an important automation webhook completely open.

Use authentication/secret verification.

Example:

```text
ElysiaJS
 |
 | Authorization: Bearer <internal-secret>
 |
 v
n8n
```

The secret must exist only server-side.

Example:

```env
N8N_WEBHOOK_SECRET=...
```

Do not expose it through:

```text
NEXT_PUBLIC_
```

---

# 29. Tailr Resume Tailoring Workflow

Recommended workflow:

```text
ElysiaJS
   |
   v
n8n Webhook
   |
   v
Validate request
   |
   v
Get job description
   |
   v
Get master resume
   |
   v
Prepare tailoring prompt
   |
   v
Gemini
   |
   v
Parse JSON
   |
   v
Validate structure
   |
   v
Return result
   |
   v
ElysiaJS
   |
   v
PostgreSQL
```

---

# 30. Resume Tailoring Rules

The AI must only modify existing information.

Allowed:

```text
Reordering existing information
Lightly rephrasing existing information
Emphasizing relevant existing skills
Changing wording to match JD terminology
Selecting relevant existing projects
Selecting relevant existing experience
```

Not allowed:

```text
Inventing experience
Inventing projects
Inventing technologies
Inventing certifications
Inventing education
Inventing achievements
Inventing metrics
Inventing responsibilities
Inventing employers
```

The master resume is the source of truth.

---

# 31. Gemini Output

Prefer structured output instead of arbitrary text.

Example:

```json
{
  "summary": "...",
  "skills": [],
  "experience": [],
  "projects": [],
  "education": [],
  "changes": [],
  "warnings": []
}
```

The backend should validate the result before saving it.

---

# 32. AI Workflow Status

Do not confuse application status with AI processing status.

Application status:

```text
SAVED
APPLIED
SCREENING
INTERVIEW
OFFER
REJECTED
WITHDRAWN
```

AI status:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

Example:

```text
Application status:
APPLIED

Resume tailoring:
COMPLETED
```

---

# 33. Recommended Async Flow

Do not make the browser wait for a long AI operation.

Instead:

```text
POST /applications/:id/tailor
       |
       v
Validate request
       |
       v
Create AI job
       |
       v
Trigger n8n
       |
       v
Return 202 Accepted
```

Then:

```text
n8n
 |
 v
Gemini
 |
 v
Result
 |
 v
ElysiaJS callback
 |
 v
Database
 |
 v
Status = COMPLETED
```

---

# 34. Example Status Flow

```text
PENDING
   |
   v
PROCESSING
   |
   +-------> FAILED
   |
   v
COMPLETED
```

Frontend can poll:

```text
GET /applications/:id/tailoring-status
```

or use:

```text
WebSocket
```

or:

```text
Server-Sent Events
```

---

# 35. Cover Letter Workflow

```text
Job Description
      |
      v
Master Resume
      |
      v
Application information
      |
      v
n8n
      |
      v
Gemini
      |
      v
Structured Cover Letter
      |
      v
ElysiaJS
      |
      v
PostgreSQL
```

The cover letter must also follow the same anti-invention principle.

---

# 36. PDF Generation

Separate content generation from PDF rendering.

```text
Resume JSON
    |
    v
Resume Template
    |
    v
PDF Renderer
    |
    v
PDF
    |
    v
Object Storage
```

Do not make Gemini directly responsible for PDF formatting.

Gemini generates content.

Your application controls formatting.

---

# 37. ATS-Friendly Resume

Tailr should prioritize:

```text
Readable text
Standard section headings
Consistent formatting
Simple structure
Relevant keywords
Proper hierarchy
No unnecessary graphics
No invented information
```

Do not claim:

```text
"100% ATS compatible"
```

or:

```text
"Guaranteed ATS score"
```

ATS systems vary.

---

# 38. ElysiaJS → n8n

Recommended:

```text
POST https://n8n.tailr.example.com/webhook/tailr-tailor
```

Payload:

```json
{
  "applicationId": "application-id",
  "userId": "user-id",
  "jobDescriptionId": "job-description-id",
  "masterResumeId": "resume-id"
}
```

Avoid sending huge duplicated files if n8n can securely retrieve them using IDs.

---

# 39. n8n → ElysiaJS

After processing:

```text
POST https://api.tailr.example.com/internal/n8n/tailor-complete
```

Payload:

```json
{
  "applicationId": "application-id",
  "status": "COMPLETED",
  "result": {}
}
```

Protect the endpoint using an internal secret.

---

# 40. Never Trust AI Output

Gemini output must be treated as untrusted external data.

Process:

```text
Gemini
   |
   v
Parse
   |
   v
Schema validation
   |
   v
Business validation
   |
   v
Database
```

If validation fails:

```text
status = FAILED
```

Do not blindly save the output.

---

# 41. AI Cost Protection

AI endpoints must not be publicly unlimited.

Use:

```text
Authentication
Rate limiting
Usage limits
Request size limits
Timeouts
Retry limits
```

Flow:

```text
User
 |
 v
Authenticated API
 |
 v
Usage check
 |
 v
Rate limit
 |
 v
n8n
 |
 v
Gemini
```

---

# 42. Gemini API Key

Never expose:

```text
GEMINI_API_KEY
```

to the browser.

Correct:

```text
ElysiaJS / n8n
       |
       v
Gemini API
```

Incorrect:

```text
Browser
   |
   v
Gemini API
```

---

# 43. Environment Variables

## Backend

Example:

```env
NODE_ENV=production
PORT=3001

DATABASE_URL=...

JWT_SECRET=...

FRONTEND_URL=https://app.tailr.example.com

N8N_BASE_URL=https://n8n.tailr.example.com
N8N_WEBHOOK_SECRET=...

GEMINI_API_KEY=...

STORAGE_PROVIDER=...
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
```

Use the actual authentication and storage strategy implemented by Tailr.

---

# 44. `.env.example`

Commit only:

```env
NODE_ENV=
PORT=

DATABASE_URL=

JWT_SECRET=

FRONTEND_URL=

N8N_BASE_URL=
N8N_WEBHOOK_SECRET=

GEMINI_API_KEY=

STORAGE_PROVIDER=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Never commit:

```text
real API keys
real database passwords
JWT secrets
production credentials
```

---

# 45. CORS

Backend should allow the actual Tailr frontend.

Example:

```text
https://app.tailr.example.com
```

Avoid blindly using:

```text
*
```

for authenticated production APIs.

---

# 46. Authentication

Production authentication should include:

```text
Password hashing
Secure sessions/JWT
HTTPS
Authorization
Input validation
Rate limiting
Secure cookies where applicable
```

Never store plain-text passwords.

---

# 47. File Upload Security

Validate:

```text
File type
File extension
MIME type
File size
File name
Authenticated user
```

Do not allow arbitrary executable files.

For resume uploads, restrict to the formats Tailr actually supports.

Example:

```text
PDF
DOCX
```

if supported.

---

# 48. UptimeRobot

UptimeRobot can monitor Tailr services.

Recommended monitors:

```text
Frontend:
https://app.tailr.example.com

Backend:
https://api.tailr.example.com/health

n8n:
https://n8n.tailr.example.com
```

Use it primarily for:

```text
Monitoring
Availability checks
Downtime alerts
```

---

# 49. UptimeRobot and Render Free Services

Render Free Web Services can spin down after inactivity.

An uptime monitor periodically sending an HTTP request can help keep traffic flowing and can reduce idle sleeping.

Example:

```text
UptimeRobot
     |
     | every few minutes
     v
https://api.tailr.example.com/health
```

However:

> **Do not treat this as guaranteed production uptime.**

It is a workaround useful for an MVP/testing environment.

For real production, use an appropriate paid/reliable service tier.

---

# 50. UptimeRobot Should NOT Call Expensive Endpoints

Do not monitor:

```text
POST /generate-resume
POST /tailor
POST /cover-letter
```

Use:

```text
GET /health
```

The endpoint should be lightweight.

---

# 51. Render Cron Jobs

Render also supports Cron Jobs.

Use Cron Jobs for actual scheduled server-side tasks.

Examples:

```text
Cleanup temporary files
Database maintenance
Scheduled data processing
Periodic maintenance
```

Do not create a cron job simply because you think every service needs one.

---

# 52. UptimeRobot vs Render Cron vs n8n Schedule

They have different jobs.

### UptimeRobot

```text
Monitoring
Health checks
Alerts
```

### Render Cron

```text
Scheduled server-side jobs
```

### n8n Schedule Trigger

```text
Scheduled automation workflows
```

Example:

```text
Every Monday
    |
    v
n8n Schedule Trigger
    |
    v
Automation
```

---

# 53. Render Free Tier Strategy

For development/MVP:

```text
Render Free
+
n8n
+
UptimeRobot
```

can be useful.

But understand the limitations:

```text
Service sleeping
Cold starts
Resource limits
Ephemeral filesystem
Temporary/limited database
```

Do not depend on these limitations being suitable for permanent production.

---

# 54. Production Upgrade

When Tailr starts handling real users:

```text
Vercel
      +
Paid/reliable Render backend
      +
Persistent PostgreSQL
      +
Reliable n8n hosting
      +
Object storage
      +
UptimeRobot
      +
Backups
```

The goal is reliability, not forcing every component to remain free.

---

# 55. Monitoring

Monitor at least:

```text
Frontend availability
Backend availability
n8n availability
Database health
AI failures
File upload failures
PDF generation failures
```

Backend health:

```text
GET /health
```

---

# 56. Logging

Log:

```text
request ID
user ID
application ID
workflow ID
operation
duration
status
error type
timestamp
```

Never log:

```text
passwords
API keys
JWT secrets
database passwords
private tokens
full resume contents
```

---

# 57. Error Handling

User-facing error:

```text
Resume tailoring failed. Please try again.
```

Backend logs should contain useful debugging information.

Do not expose raw:

```text
Gemini errors
n8n errors
database errors
Render errors
```

to the user.

---

# 58. Retry Strategy

AI/API operations can fail temporarily.

Use controlled retries:

```text
Attempt 1
   |
   v
Failure
   |
   v
Wait
   |
   v
Attempt 2
   |
   v
Failure
   |
   v
Attempt 3
   |
   v
FAILED
```

Do not create unlimited retries.

---

# 59. Timeouts

External operations should have reasonable timeouts.

Examples:

```text
Gemini request timeout
n8n request timeout
Storage upload timeout
Database timeout
```

A failed request should eventually become:

```text
FAILED
```

instead of remaining:

```text
PROCESSING
```

forever.

---

# 60. Production Database Backups

Production PostgreSQL should have:

```text
Automated backups
Recovery strategy
Retention policy
Restore testing
```

Do not assume:

```text
Database exists = database is safe
```

A backup that cannot be restored is not a useful backup.

---

# 61. CI/CD

Recommended:

```text
Developer
    |
    v
Git
    |
    v
GitHub
    |
    v
CI
    |
    +---- Lint
    +---- Typecheck
    +---- Tests
    +---- Build
    |
    v
Deploy
```

---

# 62. Pre-Deployment Commands

Use the scripts defined in the project.

Typical:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

Do not deploy code that only works locally.

---

# 63. Deployment Order

Deploy production in this order:

```text
1. PostgreSQL
        |
        v
2. ElysiaJS
        |
        v
3. /health
        |
        v
4. n8n
        |
        v
5. n8n PostgreSQL
        |
        v
6. WEBHOOK_URL
        |
        v
7. Gemini credentials
        |
        v
8. Object storage
        |
        v
9. Next.js
        |
        v
10. Custom domains
        |
        v
11. UptimeRobot
        |
        v
12. End-to-end testing
```

---

# 64. Production End-to-End Test

Test:

```text
User
 |
 v
Register
 |
 v
Login
 |
 v
Upload master resume
 |
 v
Create application
 |
 v
Paste JD
 |
 v
Analyze JD
 |
 v
Tailor resume
 |
 v
Generate cover letter
 |
 v
Edit result
 |
 v
Generate PDF
 |
 v
Download/open PDF
 |
 v
Check application history
```

Verify:

```text
Frontend
Backend
Database
n8n
Gemini
Storage
PDF
```

all work together.

---

# 65. Production Checklist

## Frontend

```text
[ ] Production URL configured
[ ] API URL configured
[ ] No localhost URLs
[ ] Build passes
[ ] Environment variables configured
[ ] Authentication works
```

## Backend

```text
[ ] Production URL configured
[ ] PORT configured
[ ] Database configured
[ ] CORS configured
[ ] Authentication configured
[ ] Rate limiting configured
[ ] Health endpoint works
[ ] Logs configured
```

## PostgreSQL

```text
[ ] Persistent database
[ ] Migrations tested
[ ] Backups configured
[ ] Connection string secured
```

## n8n

```text
[ ] n8n deployed
[ ] PostgreSQL configured
[ ] Owner account created
[ ] WEBHOOK_URL configured
[ ] Workflow imported
[ ] Workflow tested
[ ] Workflow activated
[ ] Webhook secured
```

## Gemini

```text
[ ] API key configured
[ ] Key is server-side
[ ] Request limits configured
[ ] Output schema validated
[ ] Retry strategy configured
```

## Storage

```text
[ ] Resume uploads work
[ ] PDF uploads work
[ ] File size limits exist
[ ] File type validation exists
[ ] Production storage configured
```

## Monitoring

```text
[ ] UptimeRobot configured
[ ] Backend /health monitored
[ ] n8n monitored
[ ] Frontend monitored
[ ] Downtime alerts enabled
```

---

# 66. Security Checklist

Before calling Tailr production-ready:

```text
[ ] HTTPS everywhere
[ ] Passwords hashed
[ ] Secrets not committed
[ ] CORS restricted
[ ] Authentication enforced
[ ] Authorization enforced
[ ] API rate limiting
[ ] File upload validation
[ ] File size limits
[ ] AI usage limits
[ ] n8n webhook secured
[ ] Internal callback secured
[ ] Production database secured
[ ] Database backups
[ ] Logs do not expose secrets
[ ] Error messages do not expose internals
```

---

# 67. Recommended Production Architecture

Final architecture:

```text
                         TAILR
                           |
              +------------+------------+
              |                         |
              v                         v
          Next.js                   ElysiaJS
          Vercel                    Render
              |                         |
              |              +----------+----------+
              |              |                     |
              |              v                     v
              |        PostgreSQL                 n8n
              |                                    |
              |                                    v
              |                              Gemini API
              |
              v
       Tailr Application UI

                         |
                         v

                  Object Storage
                /       |        \
               /        |         \
          Resume      PDF      Cover Letter
```

---

# 68. Final Technology Stack

```text
Frontend:
Next.js

Frontend Hosting:
Vercel

Backend:
ElysiaJS

Backend Hosting:
Render

Database:
PostgreSQL

Automation:
n8n

n8n Hosting:
Render initially

AI:
Gemini API

File Storage:
Cloudinary / Cloudflare R2 / S3 / Supabase Storage

Source Control:
GitHub

Monitoring:
UptimeRobot

DNS:
Domain provider

HTTPS:
Vercel + Render

CI/CD:
GitHub + Vercel + Render
```

---

# 69. Recommended Development Workflow

During development:

```text
LOCAL
 |
 +---- Next.js
 |
 +---- ElysiaJS
 |
 +---- PostgreSQL
 |
 +---- n8n
 |
 +---- Gemini API
 |
 +---- Local testing
```

Only after the feature works:

```text
Git
 |
 v
GitHub
 |
 v
Production deployment
```

---

# 70. Recommended MVP Strategy

For the first public version:

```text
Next.js
   ↓
Vercel

ElysiaJS
   ↓
Render

PostgreSQL
   ↓
Persistent managed provider

n8n
   ↓
Render

Gemini
   ↓
Gemini API

Files
   ↓
Object storage

Monitoring
   ↓
UptimeRobot
```

If using Render Free during the MVP phase:

```text
Understand:
- sleeping
- cold starts
- resource limits
- database limitations
- storage limitations
```

Do not build critical assumptions around free-tier workarounds.

---

# 71. When to Upgrade

Upgrade infrastructure when:

```text
Real users
      OR
Important user data
      OR
Frequent AI usage
      OR
Need for reliable 24/7 availability
      OR
Free-tier limitations become a problem
```

Do not upgrade just because a tutorial says you need to.

---

# 72. Important Architecture Rule

Never make n8n the entire Tailr backend.

Bad:

```text
Next.js
   |
   v
n8n
   |
   v
Everything
```

Better:

```text
Next.js
   |
   v
ElysiaJS
   |
   +------ PostgreSQL
   |
   +------ n8n
              |
              +------ Gemini
```

ElysiaJS owns the application.

n8n owns automation.

PostgreSQL owns persistent structured data.

Object storage owns files.

Gemini owns AI generation.

---

# 73. The Complete Tailr Flow

```text
USER
 |
 v
Next.js
 |
 v
ElysiaJS
 |
 +----------------------+
 |                      |
 v                      v
PostgreSQL              n8n
                           |
                           v
                    Prepare Input
                           |
                           v
                       Gemini
                           |
                           v
                    Validate Output
                           |
                           v
                     ElysiaJS
                           |
                           v
                      PostgreSQL
                           |
                           v
                    PDF Generator
                           |
                           v
                    Object Storage
                           |
                           v
                         User
```

---

# 74. Core Principle

Tailr should be designed around these boundaries:

```text
Next.js
= Presentation

ElysiaJS
= Application + Business Logic

PostgreSQL
= Structured Persistent Data

n8n
= Automation

Gemini
= AI

Object Storage
= Files

UptimeRobot
= Monitoring

Vercel
= Frontend Hosting

Render
= Backend / Automation Hosting
```

This separation keeps Tailr maintainable and makes it easier to replace individual infrastructure components later.

---

# 75. Official Documentation to Check Before Deployment

Always check the current official documentation before deploying because hosting limits, pricing, configuration requirements, and UI can change.

Render:

https://render.com/docs/deploy-n8n

Render n8n template:

https://render.com/templates/n8n

Render Free services:

https://render.com/docs/free

Render Web Services:

https://render.com/docs/web-services

Render Cron Jobs:

https://render.com/docs/cronjobs

Render Deployments:

https://render.com/docs/deploys

UptimeRobot:

https://uptimerobot.com/

Vercel:

https://vercel.com/

n8n:

https://n8n.io/

Gemini API:

https://ai.google.dev/

---

# 76. Final Deployment Philosophy

Do not try to make Tailr production-ready by simply deploying it.

Production readiness means:

```text
Code
+
Database
+
Security
+
AI
+
Automation
+
File Storage
+
Monitoring
+
Backups
+
Error Handling
+
Deployment
```

The correct progression is:

```text
LOCAL DEVELOPMENT
        |
        v
FEATURE COMPLETE
        |
        v
LOCAL END-TO-END TEST
        |
        v
MVP DEPLOYMENT
        |
        v
REAL-WORLD TESTING
        |
        v
FIX FAILURES
        |
        v
PRODUCTION HARDENING
        |
        v
REAL PRODUCTION
```

For Tailr, **build locally first, use Render as the initial deployment platform, use n8n as the automation layer, keep ElysiaJS as the application backend, use persistent PostgreSQL for real data, use object storage for files, and use UptimeRobot for monitoring rather than treating it as a permanent uptime hack.**
