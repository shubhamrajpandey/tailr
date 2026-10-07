# 🎨 Tailr Frontend

The frontend interface for **Tailr**, built with [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS v4, and TypeScript.

## 🛠️ Features

- **Master Resume Editor**: Clean UI to manage your structured career data.
- **Application Tracker**: Dashboard with status pipeline (`WISHLIST`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `GHOSTED`).
- **Diff Inspector**: Side-by-side comparison between master resume bullets and AI-tailored drafts.
- **PDF Renderer**: Clean, printable ATS-friendly resume formatting.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend server URL (default: `http://localhost:3001`).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Scripts

- `npm run dev`: Start Next.js dev server with Turbopack / Fast Refresh.
- `npm run build`: Build production optimized bundle.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint checks.
