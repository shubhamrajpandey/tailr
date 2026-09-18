# Tailr

A personal, single-user web app that tailors your resume to a specific job description using AI, and tracks the jobs you apply to.

## What it does

- Store one master resume as structured data.
- Paste a job description, generate a tailored version of your resume that only rephrases, reorders, or emphasizes content already in your master resume — never invents new skills, experience, or achievements.
- Compare original vs. tailored resume before saving.
- Export the tailored resume as a PDF.
- Track applications: company, position, job description, HR contact, applied status, and key dates — each linked to the exact resume version used.

## Tech stack

- Next.js (App Router) + TypeScript
- [Database — e.g. SQLite / Supabase Postgres]
- Drizzle ORM
- Gemini API for resume tailoring
- Tailwind CSS + shadcn/ui

## Getting started

```bash
git clone https://github.com/yourusername/tailr.git
cd tailr
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev
```

### Environment variables

See `.env.example` for the required variables (Gemini API key, database URL).

## Status

Personal project, actively in development. Not intended for multi-user use.
