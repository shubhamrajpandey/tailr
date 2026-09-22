# ⚡ Tailr Backend

The high-performance API service for **Tailr**, built with [ElysiaJS](https://elysiajs.com/) and powered by [Bun](https://bun.sh/).

## 🛠️ Responsibilities
- **AI Tailoring Engine**: Direct server-side integration with the Google Gemini API.
- **Strict Anti-Hallucination Validator**: Deterministically ensures no hallucinated skills, tools, or dates are added to the resume.
- **Persistence Layer**: Manages `master_resume`, `applications`, and `resume_versions`.
- **PDF Generation**: Generates PDF exports from HTML/CSS templates.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your `GEMINI_API_KEY`, `DATABASE_URL`, and optionally `PORT` (defaults to `3001`).

### 3. Run Development Server
```bash
bun run dev
```

Server will start on [http://localhost:3001](http://localhost:3001).

## 📖 API Documentation & Swagger UI

- **Interactive Swagger UI**: [http://localhost:3001/swagger](http://localhost:3001/swagger)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:3001/swagger/json](http://localhost:3001/swagger/json)
- Full guide & step-by-step interactive testing walkthrough: see [SWAGGER.md](./SWAGGER.md).