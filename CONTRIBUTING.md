# Contributing to Tailr

Thank you for your interest in contributing to **Tailr**! We welcome community contributions, bug reports, and suggestions to make AI resume tailoring transparent, safe, and hallucination-free.

---

## Code of Conduct

By participating in this project, you agree to treat everyone with respect, maintain constructive collaboration, and adhere to standard open-source citizenship principles.

---

## Development Setup

### Prerequisites
- [Bun](https://bun.sh/) (`v1.2+`) for the backend
- [Node.js](https://nodejs.org/) (`v20+`) and `npm` for the frontend
- [Docker](https://www.docker.com/) for running local PostgreSQL (or an external Neon/Supabase PostgreSQL database)

### Monorepo Structure
- `tailr-frontend/`: Next.js 16 (App Router), React 19, Tailwind CSS v4, Redux Toolkit, TanStack Query.
- `tailr-backend/`: ElysiaJS, Bun runtime, Drizzle ORM, PostgreSQL.

### Quick Start

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/shubhamrajpandey/tailr.git
   cd tailr
   ```

2. **Backend Setup**:
   ```bash
   cd tailr-backend
   bun install
   cp .env.example .env
   # Start local PostgreSQL via Docker:
   docker-compose up -d
   # Run database migrations:
   bun run db:migrate
   # Run backend development server:
   bun run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../tailr-frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

4. **Verify Quality & Tests**:
   ```bash
   # Frontend tests & typecheck
   cd tailr-frontend
   npm test
   npm run typecheck

   # Backend tests & typecheck
   cd ../tailr-backend
   bun test
   bun run typecheck
   ```

---

## Contributing Guidelines

### Reporting Bugs
- Search existing issues to ensure the problem has not already been reported.
- Open a new issue with a descriptive title, steps to reproduce, expected behavior, and environment details.

### Security Vulnerabilities
- If you discover a security vulnerability, please do **NOT** open a public issue.
- Report security issues privately to the project maintainers or via GitHub Security Advisories.

### Pull Requests
1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Keep changes focused and atomic.
3. Write automated unit/integration tests for any new logic or bug fixes.
4. Ensure all linters, type checks, and tests pass before opening a PR.
5. Provide a clear PR description detailing the changes and testing evidence.

---

## License

By contributing to Tailr, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
