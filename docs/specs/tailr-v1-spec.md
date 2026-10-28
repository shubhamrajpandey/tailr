# Tailr — V1 Build Spec

**What this is:** A personal, single-user web app that (1) tailors your master resume to a specific job description using AI, and (2) tracks the jobs you apply to.

**Who it's for:** Just you. No multi-user, no auth complexity, no SaaS scaffolding.

**Primary rule, above all others:** The AI may only rephrase, reorder, or emphasize content that already exists in the master resume. It must never invent skills, experience, metrics, companies, dates, or achievements. If in doubt, the AI leaves it out.

---

## 1. Scope

### In scope for V1
- One master resume, stored as structured JSON.
- Paste a job description → AI generates a tailored resume version.
- AI output is validated against the master resume before it can be saved (no hallucinated content).
- Side-by-side comparison of original vs. tailored resume before accepting.
- Export tailored resume as PDF.
- Applications tracker: company, position, JD, HR contact, applied status, key dates, linked to the resume version used.
- Simple dashboard: list/filter/search applications.

### Explicitly out of scope for V1 (add later if you actually miss them)
- User accounts / login / JWT / sessions — this is a single-user app, skip auth entirely (see Section 3).
- LaTeX pipeline — use HTML/CSS → PDF instead. Only revisit LaTeX if you already have a template you love.
- Interviews, follow-ups, tags, notes-per-entity, analytics dashboard, priority levels.
- Job description AI "analyzer" as a separate structured extraction step — fold this into the single tailoring prompt instead of building it as its own feature.
- Cover letters, auto-apply, job scraping, browser automation.

**Rule of thumb while building:** if a feature isn't on the path `paste JD → get tailored resume → save application record`, it's Phase 2. Write it down in a `LATER.md`, don't build it now.

---

## 2. Tech Stack (lean version)

- **Framework:** Next.js (App Router) + TypeScript — frontend and backend in one project via API routes/route handlers.
- **Database:** SQLite (via Drizzle ORM or Prisma) for local use, or Supabase Postgres if you want it accessible from anywhere. Either is fine — don't stand up a separate backend service for a single-user app.
- **AI:** Gemini Pro API, called only from server-side route handlers — never from the browser. Store the key in `.env.local`, never expose it client-side.
- **PDF generation:** HTML/CSS resume template rendered to PDF via a headless-browser library (e.g. Puppeteer) or a PDF-from-HTML service. Skip LaTeX for V1.
- **Styling:** Tailwind CSS + shadcn/ui components — fast to build a clean, minimal UI with.
- **Validation:** Zod schemas shared between frontend forms and backend route handlers.

No ElysiaJS, no Bun, no JWT/refresh-token system, no microservices. One Next.js app, one database.

---

## 3. Auth Decision

Skip real authentication. Options, pick one:

- **A — Local only:** run it on `localhost`, no auth at all.
- **B — Deployed, simple gate:** one shared password checked server-side, stored as a signed cookie. No user table, no registration flow, no password hashing infrastructure.

Do not build registration/login/refresh-tokens/sessions for an app only you will ever use. If this ever becomes multi-user, that's a distinct future project.

---

## 4. Data Model

### `master_resume` (single row)
```
id
basics       { name, email, phone, location, linkedin, github, portfolio }
summary      text
education    []
skills       { languages[], frameworks[], tools[], other[] }
experience   []   // each: company, title, startDate, endDate, bullets[]
projects     []   // each: name, description, bullets[], tech[]
certifications []
achievements []
updatedAt
```

### `applications`
```
id
companyName
companyWebsite
positionTitle
jobDescriptionRaw     text
positionOpenDate      date, nullable
appliedDate           date, nullable
applied               boolean
status                enum: WISHLIST | APPLIED | INTERVIEW | OFFER | REJECTED | GHOSTED
hrName                text, nullable
hrLinkedinUrl         text, nullable
resumeVersionId       references resume_versions.id, nullable
createdAt
updatedAt
```

### `resume_versions`
```
id
applicationId        references applications.id, nullable
label                 text  // e.g. "UI/UX — Acme Corp"
resumeData            json  // same shape as master_resume
source                enum: AI_TAILORED | MANUAL
changesSummary        json  // list of { section, original, updated, reason }
createdAt
```

That's it. No companies table separate from applications for V1 — if you reapply to the same company later, just create a new application row. Merge that later if it's actually annoying in practice.

---

## 5. Core Workflow

```
Open app
  ↓
Fill in / edit master resume (once, then rarely touched)
  ↓
New Application
  ↓
Enter company, position, paste job description, HR info if known
  ↓
Click "Tailor Resume"
  ↓
Backend sends { masterResume, jobDescription } to Gemini
  ↓
Gemini returns { tailoredResume, changes[] } as strict JSON
  ↓
Backend validates: every skill/company/project/date in tailoredResume
  must already exist in masterResume — reject and retry/error if not
  ↓
Show side-by-side comparison (original vs tailored) with the changes list
  ↓
User edits if needed → Save as resume_version, linked to this application
  ↓
Export PDF
  ↓
Mark applied, fill in applied date → application now tracked on dashboard
```

---

## 6. The AI Prompt (this is the part that matters most)

Send Gemini something close to this as the system instruction:

```
You are tailoring an existing resume to better match a specific job description.

STRICT RULES:
- You may only rephrase, reorder, or re-emphasize content that already
  exists in the master resume provided below.
- You must NEVER add a skill, technology, tool, company, job title,
  project, metric, certification, degree, or achievement that is not
  already present in the master resume.
- You must NEVER change employment dates, company names, or job titles.
- If the job description mentions a requirement the candidate's resume
  does not support, do not add it — just don't emphasize it.

Return strict JSON only, in this shape:
{
  "tailoredResume": { ...same shape as input masterResume... },
  "changes": [
    { "section": "", "type": "rephrase|reorder|emphasize",
      "original": "", "updated": "", "reason": "" }
  ]
}

MASTER RESUME:
<json>

JOB DESCRIPTION:
<raw text>
```

### Validation layer (non-negotiable, do this even in V1)
After parsing the JSON response, write a function that walks `tailoredResume` and confirms every skill, company name, project name, and date string appears somewhere in the original `masterResume`. If anything new shows up that isn't a close paraphrase, reject the response and either retry with a stricter prompt or surface an error rather than silently saving it.

---

## 7. Build Order

1. **Project setup** — Next.js + TypeScript + Tailwind + shadcn/ui + database connection.
2. **Data layer** — schema + migrations for `master_resume`, `applications`, `resume_versions`.
3. **Master Resume screen** — form to create/edit your one master resume, saved as JSON.
4. **Applications list + new application form** — plain CRUD, no AI yet. Get the tracker itself working and usable.
5. **AI tailoring route** — server-side Gemini call + the validation layer above. Test it hard against your real resume with a few different job descriptions before trusting it.
6. **Comparison UI** — original vs. tailored, with changes list, editable before save.
7. **Resume version save**, linked to the application.
8. **PDF export** — HTML/CSS template → PDF.
9. **Polish** — search/filter on applications list, empty states, loading states.

Ship after step 8. Use it for real applications. Only then decide what from the "out of scope" list you actually want.

---

## 8. Guardrails to Keep in Mind While Building

- The master resume is the source of truth. AI output is always a *suggestion* that produces a new version — it never overwrites the master resume.
- Never trust AI JSON output without validating it against the master resume first.
- Keep the AI call server-side only; the Gemini key must never reach the browser.
- Don't hard-code dashboard stats — compute them from real rows, even if there are only two.
- Resist adding fields/tables that aren't used by the core workflow in Section 5. If you want to add something, ask: does this block `paste JD → tailored resume → tracked application`? If not, it's Phase 2.
