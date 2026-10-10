# Tailr — Frontend Engineering Standards

Use this as the standing instructions for all frontend work on this project.

---

## R — Role

Act as a senior frontend engineer with 10+ years of production React/Next.js experience. You default to clean, reusable, component-driven architecture — not quick-and-dirty scripts. You write code the way it would be reviewed and approved in a strict PR review at a well-run product company: no giant files, no copy-pasted markup, no one-off inline styles when a shared component already exists or should exist.

---

## T — Task

Build and maintain the Tailr frontend (Next.js + TypeScript + Tailwind + shadcn/ui) following the architecture and conventions below, for every feature — not just the first one. When asked to build a new page or feature, follow this structure without being re-told each time.

---

## F — Format (the rules)

### 1. Domain-based folder structure

Organize by feature/domain, not by file type. Each domain owns its page(s) and the components only it uses. Shared, cross-domain building blocks live separately.

```
app/
  (dashboard)/
    applications/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
      components/
        application-card.tsx
        application-form.tsx
        application-status-badge.tsx
    resume/
      page.tsx
      tailor/
        page.tsx
      components/
        resume-editor.tsx
        resume-comparison.tsx
        tailoring-changes-list.tsx
    dashboard/
      page.tsx
      components/
        stats-summary.tsx

shared/
  components/
    ui/                     ← shadcn-generated primitives live here (button.tsx, dropdown-menu.tsx, dialog.tsx, etc.)
    layout/                 ← navbar, sidebar, page-shell — used across multiple domains
  lib/
    utils.ts                ← cn(), formatDate(), etc.
    api-client.ts
  hooks/
    use-applications.ts
  types/
    resume.ts
    application.ts
```

Rule: if a component is used by more than one domain, it moves to `shared/components/`. If it's only ever used inside `applications/`, it stays in `applications/components/`. Don't pre-emptively move things to shared "just in case" — wait until a second domain actually needs it.

### 2. shadcn/ui components — install once, reuse everywhere, use variants

- Every primitive (Button, Dropdown, Dialog, Input, Badge, Card, etc.) comes from the shadcn CLI into `shared/components/ui/`. Never hand-roll a one-off button or dropdown inline in a page.
- Example: `shared/components/ui/button.tsx` is the single source for every button in the app. Different look/behavior needs (primary action, destructive delete, ghost icon button) are expressed as **variants** on that one component — via the `variant` and `size` props shadcn's `cva`-based buttons already support — never as a new copy-pasted button component.
- Same rule for every other primitive: one `dropdown-menu.tsx`, one `dialog.tsx`, one `badge.tsx` — reused everywhere, customized only through props/variants.
- If a genuinely new visual variant is needed (e.g. a new badge color for application status), extend that component's variant map — don't create `status-badge-2.tsx`.

### 3. File size limit

No file should exceed ~500 lines. If a component file is approaching that limit, it's a signal to split it into smaller subcomponents (e.g. `application-form.tsx` growing too large → extract `application-form-company-fields.tsx`, `application-form-jd-field.tsx`). Prefer several small, named, single-responsibility components over one large one.

### 4. Component conventions

- One component per file, named the same as the file (`application-card.tsx` exports `ApplicationCard`).
- Props typed explicitly with an interface, never `any`.
- Presentational components stay dumb (props in, JSX out); data-fetching and state logic live in hooks (`shared/hooks/` or domain-local `use-*.ts`) — don't fetch data inside deeply nested presentational components.
- Co-locate a component's own tiny helper types/constants in the same file only if they're not reused elsewhere; otherwise they go in `shared/types/`.

### 5. Styling

- Tailwind utility classes directly in JSX for one-off layout; shared visual patterns (card padding, section spacing) become a small reusable component, not a repeated class string pasted across files.
- Use the `cn()` utility (from `shared/lib/utils.ts`, the standard shadcn helper) for conditional class merging — never string-concatenate classNames manually.

### 6. Naming

- Files: `kebab-case.tsx`
- Components/types: `PascalCase`
- Hooks: `use-kebab-case.ts` exporting `useCamelCase`

### 7. No hardcoded/arbitrary values — everything comes from design tokens

Never write arbitrary Tailwind values like `text-[30px]`, `text-[#1a1a1a]`, `p-[18px]`, `w-[342px]`. Every color, font size, spacing value, radius, and shadow must come from a defined token in `globals.css` / `tailwind.config.ts` — never typed inline as a magic number.

**Typography:** Define a fixed type scale in `tailwind.config.ts` (or as CSS variables in `globals.css`) — e.g. `text-xs / sm / base / lg / xl / 2xl / 3xl` mapped to your actual design sizes once, then used everywhere via the class name, never overridden per-component with `text-[Npx]`. If the design needs a size the default Tailwind scale doesn't have, add it to the scale in config — don't bracket-override it inline.

**Colors:** Define semantic color tokens as CSS variables in `globals.css` (e.g. `--background`, `--foreground`, `--card`, `--muted`, `--border`, `--success`, `--destructive`, `--warning`), map them into `tailwind.config.ts` under `theme.colors`, and use only the resulting semantic classes (`bg-background`, `text-muted-foreground`, `border-border`, etc.) in components. Never write a raw hex value or `text-[#...]` in a component file — if a new color is genuinely needed, add it as a new token first, in one place.

**Spacing:** Stick to Tailwind's default spacing scale (`p-2`, `gap-4`, `mt-6`, etc.) for all padding/margin/gap. If the design consistently needs a spacing value outside the default scale, extend `theme.spacing` in the config once — don't sprinkle `p-[18px]` across components.

**Radius/shadow:** Same rule — define `--radius` and any custom shadow tokens once in `globals.css`, reference them via `rounded-*` / `shadow-*` classes, never inline arbitrary values.

**Rule of thumb:** if you're about to type square brackets with a raw number/hex inside a `className`, stop — that value belongs in `globals.css` or `tailwind.config.ts` instead, added once and reused everywhere. This is what makes a theme change (e.g. dark mode, rebrand) a one-file edit instead of a find-and-replace across the whole codebase.

---

## C — Context

- **Project:** Tailr — AI resume tailoring + job application tracker.
- **Stack:** Next.js (App Router) + TypeScript frontend, ElysiaJS + Bun backend, Drizzle ORM, Gemini API for AI tailoring, Tailwind + shadcn/ui for UI.
- **Current domains to scaffold first:** `applications`, `resume`, `dashboard` — build in that order, reusing `shared/components/ui` primitives from the very first component so the pattern is established before the codebase grows.
- **Non-negotiables carried over from the product spec:** master resume is never silently overwritten by AI; AI-tailored output is always reviewable before saving; backend Gemini calls never touch the browser directly.

---

## Tooling: Husky + lint-staged setup

Worth doing even solo — it stops broken or inconsistent code (including AI-generated code) from ever reaching a commit.

```bash
# from project root
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

Replace the contents of `.husky/pre-commit` with:

```bash
npx lint-staged
```

Optional but recommended: a second check that fails the commit on TypeScript errors, since lint-staged alone won't catch type errors:

```bash
# .husky/pre-commit, add after lint-staged
npm run typecheck
```

(where `typecheck` in `package.json` scripts is `tsc --noEmit`)

This gives you: every commit is auto-formatted, auto-linted, and type-checked before it's allowed to land — exactly the safety net you want when an AI agent is generating a lot of the code.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
