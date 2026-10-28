<div align="center">

# 🪡 Tailr

### Precision AI resume tailoring & job application tracker — with zero hallucination.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Elysia.js](https://img.shields.io/badge/Elysia.js-1.4-f3e8ff?style=for-the-badge&logo=elysia&logoColor=purple)](https://elysiajs.com/)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini_API-Pro-8e75ff?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

<p align="center">
  <a href="#the-problem">The Problem</a> •
  <a href="#core-philosophy">Philosophy</a> •
  <a href="#features">Features</a> •
  <a href="#workflow">Workflow</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#roadmap">Roadmap</a>
</p>

</div>

---

## 💡 The Problem

Most AI resume tools today are dangerous. When you ask them to tailor your resume, they fabricate credentials:
- Inventing proficiency in frameworks you've never touched.
- Embellishing metrics and revenue numbers.
- Adding buzzwords that you cannot defend in a live technical interview.

**Tailr fixes this.** It acts as your strategic resume editor, strictly constrained to your actual life experiences.

---

## 🛡️ The Cardinal Rule

> **The AI may *only* rephrase, reorder, or emphasize content that already exists in your master resume.**  
> It must **never** invent skills, tools, companies, metrics, dates, or achievements.  
> **If in doubt, the AI leaves it out.**

Tailr enforces this rule at two distinct levels:
1. **System Prompt Guardrails**: Strict persona instructions that forbid additive hallucination.
2. **Deterministic Post-Generation Validation**: A validation layer that cross-checks every single entity (skills, company names, tools, job titles, dates) in the generated resume against your master resume JSON. If an unverified entity is detected, the output is rejected.

---

## ✨ Features

- **📑 Master Resume (Single Source of Truth)**
  - Store your complete career history in a clean, structured JSON schema.
  - Covers contact basics, professional summary, work experience, projects, skills, education, and certifications.

- **🎯 Contextual AI Tailoring (Gemini API)**
  - Paste any job description to generate a targeted resume version.
  - Automatically highlights relevant experience and reorganizes bullet points to mirror JD keywords and priorities.

- **⚖️ Side-by-Side Diff Inspector**
  - Compare your master resume against the AI-tailored draft line-by-line.
  - Every change comes with a clear reason (`rephrase`, `reorder`, `emphasize`).
  - Full manual editing capability before finalizing.

- **🖨️ Clean HTML/CSS to ATS-Friendly PDF**
  - Generates crisp, modern, ATS-parseable PDF resumes directly from HTML/CSS templates.
  - No bloated LaTeX toolchains required.

- **📊 Application Tracking System (ATS)**
  - Track your applications end-to-end: Company name, role, salary range, job post URL, HR contacts, applied date, and application status (`WISHLIST`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `GHOSTED`).
  - **Direct Lineage**: Every application is tied to the exact tailored resume version used.

---

## 🔄 How It Works

```mermaid
flowchart TD
    A[Master Resume JSON] --> B[New Application + Job Description]
    B --> C[Elysia Backend Route]
    C --> D[Google Gemini 1.5 / Pro]
    D --> E[Strict Anti-Hallucination Validator]
    E -- Failed: Hallucination Detected --> D
    E -- Passed --> F[Side-by-Side Diff Inspector]
    F --> G[Manual User Review & Polish]
    G --> H[Saved Resume Version]
    H --> I[ATS-Compliant PDF Export]
    H --> J[Track Application on Dashboard]
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (v16 App Router) | React 19, Server & Client Components, Responsive UI |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Accessible, modern, minimal dark/light interface |
| **Backend** | [ElysiaJS](https://elysiajs.com/) | Ergonomic, end-to-end type-safe web framework |
| **Runtime** | [Bun](https://bun.sh/) | Lightning-fast JavaScript & TypeScript runtime and package manager |
| **AI Engine** | [Google Gemini API](https://ai.google.dev/) | Structured JSON output via server-side route handlers |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Docker / Neon / Supabase) | Robust, relational persistence layer |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL schema, migrations, and queries |
| **Validation**| [Zod](https://zod.dev/) | End-to-end schema validation for resumes and API payloads |

---

## 📂 Repository Structure

```text
tailr/
├── tailr-frontend/          # Next.js App Router frontend application
│   ├── app/                 # Routes: /dashboard, /resume, /applications, /settings
│   ├── shared/              # Reusable components, hooks, stores, and API clients
│   ├── public/              # Static assets and icons
│   └── package.json
│
├── tailr-backend/           # ElysiaJS + Bun high-performance API server
│   ├── src/
│   │   ├── index.ts         # Server entry point, CORS & route definitions
│   │   ├── modules/         # Auth, Resumes, Cover Letters, Applications, Analytics
│   │   └── db/              # Drizzle ORM schema & PostgreSQL client
│   ├── tests/               # Test suites for auth, security, routes, and services
│   ├── docker-compose.yml   # Local PostgreSQL service
│   ├── bun.lock
│   └── package.json
├── docs/                    # Architecture audits, specifications, and deployment runbooks
│   ├── architecture/        # Architecture & code audit reports
│   ├── deployment/          # Production deployment guide
│   └── specs/               # Product and architectural specification (tailr-v1-spec.md)
├── CONTRIBUTING.md          # Guidelines for open source contributors
├── .gitignore               # Root git ignore rules
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (`v1.2+` installed)
- [Node.js](https://nodejs.org/) (`v20+` installed)
- [Docker](https://www.docker.com/) (recommended for local PostgreSQL) or a managed PostgreSQL instance ([Neon](https://neon.tech/) / [Supabase](https://supabase.com/))
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamrajpandey/tailr.git
cd tailr
```

### 2. Backend Setup (`tailr-backend`)

```bash
cd tailr-backend
bun install

# Start local PostgreSQL database container:
docker-compose up -d

# Configure environment variables:
cp .env.example .env
```

Configure your environment variables in `tailr-backend/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tailr
JWT_ACCESS_SECRET=your_minimum_32_character_jwt_secret_here!
JWT_REFRESH_SECRET=your_minimum_32_character_jwt_secret_here!
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

Run database migrations to initialize tables:
```bash
bun run db:migrate
```

*(Optional)* Run test suite to verify backend health:
```bash
bun test
```

Start the backend development server:
```bash
bun run dev
```
> Backend runs at `http://localhost:3001` with auto-reload.

---

### 3. Frontend Setup (`tailr-frontend`)

Open a new terminal window:

```bash
cd tailr-frontend
npm install

# Configure environment variables
cp .env.example .env.local
```

Add your configuration to `tailr-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend development server:
```bash
npm run dev
```
> Frontend runs at `http://localhost:3000`.

---

## 📐 Data Model

```
┌───────────────────────────────┐
│         master_resume         │
├───────────────────────────────┤
│ id: string (PK)               │
│ basics: JSON                  │
│ summary: text                 │
│ skills: JSON                  │
│ experience: JSON              │
│ projects: JSON                │
│ education: JSON               │
│ certifications: JSON          │
│ updatedAt: timestamp          │
└───────────────┬───────────────┘
                │ 1
                │
                │ *
┌───────────────▼───────────────┐       1      ┌───────────────────────────────┐
│        resume_versions        ├──────────────►          applications         │
├───────────────────────────────┤              ├───────────────────────────────┤
│ id: string (PK)               │              │ id: string (PK)               │
│ applicationId: FK -> apps.id  │              │ companyName: text             │
│ label: text                   │              │ positionTitle: text           │
│ resumeData: JSON              │              │ jobDescriptionRaw: text       │
│ source: AI_TAILORED | MANUAL  │              │ status: ENUM                  │
│ changesSummary: JSON          │              │ appliedDate: date             │
│ createdAt: timestamp          │              │ hrContact: text               │
└───────────────────────────────┘              │ resumeVersionId: FK           │
                                               └───────────────────────────────┘
```

---

## 🔒 Security & Privacy

- **Server-Side API Key Storage**: The Gemini API key is exclusively accessed within server route handlers and is **never** bundled or exposed to the client browser.
- **Data Privacy**: Your resume details and job notes remain completely on your local device / private database.
- **No Unsolicited Scraping**: Tailr does not perform invasive automated job board logins or unauthorized browser botting.

---

## 🗺️ Roadmap

- [x] Monorepo initialization with Next.js 16 and ElysiaJS
- [ ] Master resume JSON schema definition & visual editor
- [ ] Applications tracker with status pipeline (Wishlist -> Applied -> Interview -> Offer)
- [ ] Gemini server-side endpoint with strict anti-hallucination validation
- [ ] Visual diff inspector (Original vs. Tailored side-by-side)
- [ ] Print-ready HTML/CSS PDF export
- [ ] Export & import master resume as standard JSON (JSON Resume schema support)
- [ ] Dark / Light mode toggle with polished design tokens

---

## 🤝 Contributing

Contributions, bug reports, and feature proposals are very welcome!  
Tailr is built to be clean, modular, and developer-friendly.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  Crafted with care by <a href="https://github.com/shubhamrajpandey"><b>Shubham Raj Pandey</b></a>
</div>
