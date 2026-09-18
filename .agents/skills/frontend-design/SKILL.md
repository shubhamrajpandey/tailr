---
name: frontend-design
description: Design system, UI/UX guidelines, component standards, and aesthetic rules for building the Tailr frontend application. Use when creating, styling, or refactoring UI components and pages in tailr-frontend.
---

# Tailr Frontend Design System & UI/UX Guidelines

This skill defines the visual identity, component architecture, styling conventions, and user experience standards for the **Tailr** web application.

---

## 🎨 1. Visual Identity & Aesthetic Principles

Tailr is an elite, personal productivity tool for career growth. Its visual identity must feel **exceptionally premium, focused, and distraction-free** (inspired by Linear, Raycast, and Vercel).

### Core Aesthetic Pillars
- **Dark Mode First**: Deep neutral backgrounds with high-contrast, razor-sharp typography.
- **Subtle Depth & Layering**: Use 1px subtle borders (`border-white/10` or `border-neutral-800`), dark elevated card surfaces (`bg-neutral-900/60`), and soft backdrop blurs (`backdrop-blur-md`).
- **Precision Typography**: Clean grotesque or geometric sans (Geist Sans / Inter), tight tracking on headings (`tracking-tight`), and tabular figures (`font-mono`) for dates, metrics, and version tags.
- **Intentional Accent Colors**: Purposeful accent colors — an electric indigo/violet primary glow (`#6366f1` / `#818cf8`) paired with semantic status colors. Avoid rainbow overload.
- **Dynamic Micro-Interactions**: Smooth hover elevations, button press scale feedback (`active:scale-[0.98]`), gentle fade-in transitions, and skeleton loaders.

---

## 🌈 2. Color Palette & Token System

```css
/* Backgrounds */
--bg-canvas: #09090b;       /* Deepest obsidian canvas */
--bg-surface: #121215;      /* Primary container/card background */
--bg-surface-hover: #18181b;/* Interactive hover states */
--bg-elevated: #1e1e24;     /* Floating dropdowns, modals, popovers */

/* Borders & Dividers */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-default: rgba(255, 255, 255, 0.14);
--border-focus: #6366f1;

/* Typography */
--text-primary: #f4f4f5;    /* 90% white for headings and primary content */
--text-secondary: #a1a1aa;  /* Muted descriptions and secondary metadata */
--text-tertiary: #71717a;   /* Placeholders, hints, timestamps */

/* Brand & Status Accents */
--accent-primary: #6366f1;  /* Electric Indigo - Primary actions */
--accent-primary-hover: #4f46e5;
--status-wishlist: #a855f7; /* Purple */
--status-applied: #3b82f6;  /* Sky Blue */
--status-interview: #f59e0b;/* Amber Warm */
--status-offer: #10b981;    /* Emerald Green */
--status-rejected: #ef4444; /* Crimson */
--status-ghosted: #64748b;  /* Slate Muted */
```

---

## 🧩 3. Key UI Components & Layouts

### 1. Application Shell & Navigation
- Top navigation bar or slim collapsible sidebar.
- Brand logo with precision badge ("Single-User Edition").
- Quick links: **Dashboard** (Applications), **Master Resume**, **New Application** (`+` action button).
- System health status pill: Connected backend status indicator.

### 2. Master Resume Editor (`/resume`)
- Divided into structured, collapsable sections:
  - **Basics**: Name, Email, Phone, Location, Portfolio, GitHub, LinkedIn.
  - **Summary**: Markdown-friendly textarea with character counter.
  - **Experience**: Timeline cards with drag-reorder handles, company, role, date range, and bullet points.
  - **Skills**: Grouped tags (`Languages`, `Frameworks`, `Tools`, `Other`) with instant tag insertion and deletion.
  - **Projects & Education**: Structured cards with technologies used and bullet points.
- Autosave indicator or clean floating Save button with last-saved timestamp.

### 3. Application Workflow & Tailoring Modal (`/applications/new`)
- Step 1: Ingest Job Description (paste raw text, company name, role title, HR contacts).
- Step 2: One-click action: **"Tailor with Gemini Pro"** with a rich animated processing spinner and stage indicator.
- Step 3: **Diff & Validation Inspector**:
  - Split-view comparison: Original Master Resume bullets on the left, Tailored draft on the right.
  - Highlighted badges for changes: `[Rephrased]`, `[Reordered]`, `[Emphasized]`.
  - Manual edit override before saving.
- Step 4: Save as `resume_version` & generate instant ATS-friendly PDF.

### 4. Application Tracker Dashboard (`/dashboard`)
- Stat summary cards: Total Applications, Active Interviews, Pending Response, Offers.
- Filter toolbar: Search by company/role, filter by status pills, sort by date.
- Dual view toggle:
  - **Table View**: Compact, dense view with status chips, linked resume version, and quick actions.
  - **Kanban Board**: Drag-and-drop or column view categorized by application stages.

### 5. PDF Resume Renderer
- Clean, ATS-compliant 1-page/2-page format.
- Standard typography hierarchy (10pt-11pt body text, clear section headers with clean line rules).
- Zero graphic icons or tables that break automated parsing.

---

## 💻 4. Technical Implementation Rules

1. **Framework**: Next.js 16 App Router (`app/` directory).
2. **Styling**: Tailwind CSS v4 with semantic utility classes. No inline CSS or messy ad-hoc hex values.
3. **Icons**: Use `lucide-react` for consistent 16px/18px stroke icons.
4. **State Management**: React 19 hooks, URL search params for filters/search, optimistic UI updates where appropriate.
5. **Component Modularity**: Keep components decoupled in `components/ui/` and `components/modules/`.
6. **Form Validation**: Zod schema validation matching the Master Resume JSON specification.
