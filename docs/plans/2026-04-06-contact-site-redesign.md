# Contact Site Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the static contact card site into a full-featured personal site using TanStack Start on Cloudflare Workers with D1, KV, and a dark luxury design system.

**Architecture:** TanStack Start (React + file-based routing + server functions) deployed to Cloudflare Workers. Cloudflare D1 for persistent data (portfolio, blog, contact form submissions, analytics). Cloudflare KV for edge caching. Tailwind CSS v4 + shadcn/ui for styling, themed with a dark luxury palette (near-black + warm gold accents).

**Tech Stack:** TanStack Start, React 19, Tailwind CSS v4, shadcn/ui, Cloudflare Workers, D1, KV, Wrangler, Playfair Display + DM Sans + JetBrains Mono fonts

**Design Reference:** `docs/plans/2026-04-06-contact-site-redesign-design.md`

---

## Task 1: Scaffold TanStack Start Project

**Files:**
- Create: `package.json`
- Create: `app.config.ts`
- Create: `tsconfig.json`
- Create: `app/router.tsx`
- Create: `app/routes/__root.tsx`
- Create: `app/routes/index.tsx`
- Create: `app/client.tsx`
- Create: `app/ssr.tsx`
- Create: `app/routeTree.gen.ts` (auto-generated)

**Step 1: Initialize TanStack Start project**

Run:
```bash
npm create @tanstack/start@latest . -- --template basic
```

If the interactive CLI blocks, manually create the scaffolding:

```bash
npm init -y
npm install @tanstack/react-start @tanstack/react-router react react-dom vinxi
npm install -D @types/react @types/react-dom typescript vite-tsconfig-paths
```

**Step 2: Create `app.config.ts`**

```ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [tsConfigPaths({ root: "./" })],
  },
  server: {
    preset: "cloudflare-pages",
  },
});
```

**Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

**Step 4: Create `app/router.tsx`**

```tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

**Step 5: Create `app/client.tsx`**

```tsx
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
```

**Step 6: Create `app/ssr.tsx`**

```tsx
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
```

**Step 7: Create `app/routes/__root.tsx`**

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Stephen Frederick</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

**Step 8: Create `app/routes/index.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <div><h1>Stephen Frederick</h1><p>Coming soon</p></div>;
}
```

**Step 9: Generate route tree and verify dev server starts**

Run:
```bash
npx vinxi dev
```

Expected: Dev server starts, homepage renders at `http://localhost:3000`

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold TanStack Start project with Cloudflare Workers preset"
```

---

## Task 2: Set Up Tailwind CSS v4 + shadcn/ui

**Files:**
- Modify: `package.json` (add dependencies)
- Create: `app/styles.css` (Tailwind entry + CSS variables)
- Modify: `app/routes/__root.tsx` (import styles)
- Create: `components.json` (shadcn config)
- Create: `app/lib/utils.ts` (cn utility)

**Step 1: Install Tailwind CSS v4**

```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2: Add Tailwind Vite plugin to `app.config.ts`**

```ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tsConfigPaths({ root: "./" }), tailwindcss()],
  },
  server: {
    preset: "cloudflare-pages",
  },
});
```

**Step 3: Create `app/styles.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #09090B;
  --color-bg-surface: #18181B;
  --color-bg-elevated: #27272A;
  --color-accent: #C9A962;
  --color-accent-muted: #A68B4B;
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #71717A;
  --color-border: #27272A;

  --font-display: "Playfair Display", serif;
  --font-body: "DM Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

**Step 4: Import styles in `__root.tsx`**

Update `__root.tsx` head to include:
```tsx
import appStyles from "~/styles.css?url";

// In the component, add to <head>:
<link rel="stylesheet" href={appStyles} />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
  rel="stylesheet"
/>
```

**Step 5: Install shadcn/ui dependencies**

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

**Step 6: Create `app/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 7: Verify Tailwind is working**

Update `app/routes/index.tsx` to use Tailwind classes:
```tsx
function Home() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <h1 className="font-display text-4xl text-accent">Stephen Frederick</h1>
    </div>
  );
}
```

Run: `npx vinxi dev`
Expected: Gold "Stephen Frederick" text in Playfair Display on near-black background.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind CSS v4 with dark luxury theme + shadcn/ui setup"
```

---

## Task 3: Build Layout Shell + Navigation

**Files:**
- Create: `app/components/layout/navbar.tsx`
- Create: `app/components/layout/footer.tsx`
- Create: `app/components/ui/noise-overlay.tsx`
- Modify: `app/routes/__root.tsx`

**Step 1: Create noise overlay component**

Create `app/components/ui/noise-overlay.tsx`:
```tsx
export function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
```

**Step 2: Create navbar component**

Create `app/components/layout/navbar.tsx`:
```tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

const routes = [
  { path: "/", label: "Home" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/resume", label: "Resume" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl text-text-primary tracking-wide">
          SF
        </Link>
        <div className="flex items-center gap-8">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "relative font-body text-sm tracking-wide transition-colors duration-300",
                currentPath === route.path
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {route.label}
              {currentPath === route.path && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

**Step 3: Create footer component**

Create `app/components/layout/footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} Stephen Frederick
        </p>
        <p className="font-body text-sm text-text-tertiary">
          Tampa, FL
        </p>
      </div>
    </footer>
  );
}
```

**Step 4: Update `__root.tsx` with layout**

```tsx
import { createRootRoute, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import appStyles from "~/styles.css?url";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { NoiseOverlay } from "~/components/ui/noise-overlay";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stephen Frederick | Staff Engineer" },
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <Meta />
      </head>
      <body className="min-h-screen bg-bg-primary font-body text-text-primary antialiased">
        <NoiseOverlay />
        <Navbar />
        <main className="pt-[73px]">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

**Step 5: Verify layout renders**

Run: `npx vinxi dev`
Expected: Dark background, gold "SF" logo top-left, nav links top-right, footer at bottom, noise texture overlay.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add layout shell with navbar, footer, and noise overlay"
```

---

## Task 4: Build Home Page (Contact Card Hero)

**Files:**
- Modify: `app/routes/index.tsx`
- Create: `app/components/home/hero-section.tsx`
- Create: `app/components/home/services-section.tsx`
- Create: `app/components/home/contact-links.tsx`
- Create: `app/components/home/action-buttons.tsx`
- Create: `app/lib/contact-data.ts`
- Create: `app/lib/vcard.ts`

**Step 1: Create contact data file**

Create `app/lib/contact-data.ts`:
```ts
export const contactData = {
  name: "Stephen Frederick",
  title: "Staff Engineer",
  company: "Advanced Engineering Consultants",
  avatar: "https://sc-frederick.github.io/advancedemailsignature/images/AdvancedLogo.png",
  emails: [
    { address: "sfrederick@advanced-engineers.com", label: "Work" },
    { address: "sc.frederick@outlook.com", label: "Personal" },
  ],
  phone: "+1 (813) 406-0178",
  websites: [
    { url: "https://www.advanced-engineers.com", label: "advanced-engineers.com" },
    { url: "https://sfrederick.dev", label: "sfrederick.dev" },
  ],
  github: "sc-frederick",
  location: {
    label: "Tampa, FL",
    url: "https://www.google.com/maps/place/10009+Gallant+Ln,+Tampa,+FL+33625",
  },
  services: [
    "Civil Engineering",
    "Structural Engineering",
    "MEP Engineering",
    "Fire Protection",
    "Building Design",
    "Construction Documents",
    "Engineering Inspections",
    "Fullstack Web Development",
    "Developer Tools",
    "SEO / Digital Marketing",
    "Product Design",
  ],
} as const;
```

**Step 2: Create vCard utility**

Create `app/lib/vcard.ts`:
```ts
import { contactData } from "./contact-data";

export function generateVCard(): string {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contactData.name}`,
    `N:Frederick;Stephen;;;`,
    `ORG:${contactData.company}`,
    `TITLE:${contactData.title}`,
    ...contactData.emails.map((e) => `EMAIL;TYPE=${e.label.toUpperCase()}:${e.address}`),
    `TEL;TYPE=CELL:${contactData.phone}`,
    ...contactData.websites.map((w) => `URL:${w.url}`),
    `URL:https://github.com/${contactData.github}`,
    `ADR;TYPE=WORK:;;;;;;Tampa, FL`,
    "END:VCARD",
  ].join("\n");

  return vcard;
}

export function downloadVCard() {
  const vcard = generateVCard();
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stephen-frederick.vcf";
  a.click();
  URL.revokeObjectURL(url);
}
```

**Step 3: Create hero section component**

Create `app/components/home/hero-section.tsx`:
```tsx
import { contactData } from "~/lib/contact-data";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-20 pb-12 text-center">
      {/* Avatar */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 rounded-full bg-accent/20 blur-xl" />
        <img
          src={contactData.avatar}
          alt={contactData.name}
          className="relative h-28 w-28 rounded-full border-2 border-accent/30 object-cover"
        />
      </div>

      {/* Name + Title */}
      <h1 className="font-display text-5xl font-semibold tracking-tight text-text-primary md:text-6xl">
        {contactData.name}
      </h1>
      <p className="mt-3 font-body text-lg text-accent">
        {contactData.title}
      </p>
      <p className="mt-1 font-body text-sm text-text-secondary tracking-wide uppercase">
        {contactData.company}
      </p>

      {/* Decorative line */}
      <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </section>
  );
}
```

**Step 4: Create services section component**

Create `app/components/home/services-section.tsx`:
```tsx
import { contactData } from "~/lib/contact-data";

export function ServicesSection() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
          Services
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {contactData.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-border bg-bg-surface/50 px-4 py-1.5 font-body text-xs tracking-wide text-text-secondary backdrop-blur-sm transition-colors duration-300 hover:border-accent/30 hover:text-accent"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 5: Create contact links component**

Create `app/components/home/contact-links.tsx`:
```tsx
import { contactData } from "~/lib/contact-data";
import {
  Mail,
  Phone,
  Globe,
  Github,
  MapPin,
} from "lucide-react";

const contactItems = [
  ...contactData.emails.map((e) => ({
    icon: Mail,
    label: e.address,
    href: `mailto:${e.address}`,
    sublabel: e.label,
  })),
  {
    icon: Phone,
    label: contactData.phone,
    href: `tel:${contactData.phone.replace(/\D/g, "")}`,
    sublabel: "Mobile",
  },
  ...contactData.websites.map((w) => ({
    icon: Globe,
    label: w.label,
    href: w.url,
    sublabel: "Website",
  })),
  {
    icon: Github,
    label: contactData.github,
    href: `https://github.com/${contactData.github}`,
    sublabel: "GitHub",
  },
  {
    icon: MapPin,
    label: contactData.location.label,
    href: contactData.location.url,
    sublabel: "Location",
  },
];

export function ContactLinks() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-8 text-center font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
          Get in Touch
        </h2>
        <div className="space-y-2">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto:") || item.href.startsWith("tel:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-all duration-300 hover:border-accent/20 hover:bg-bg-surface/50"
            >
              <item.icon className="h-4 w-4 text-text-tertiary transition-colors group-hover:text-accent" />
              <div className="flex-1">
                <p className="font-body text-sm text-text-primary">{item.label}</p>
              </div>
              <span className="font-body text-xs text-text-tertiary">{item.sublabel}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 6: Create action buttons component**

Create `app/components/home/action-buttons.tsx`:
```tsx
"use client";

import { Download, Share2 } from "lucide-react";
import { downloadVCard } from "~/lib/vcard";

export function ActionButtons() {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Stephen Frederick",
        text: "Staff Engineer | Advanced Engineering Consultants",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // TODO: toast notification
    }
  };

  return (
    <section className="px-6 py-12">
      <div className="mx-auto flex max-w-xl gap-3">
        <button
          onClick={downloadVCard}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-sm font-medium text-bg-primary transition-colors duration-300 hover:bg-accent-muted"
        >
          <Download className="h-4 w-4" />
          Save Contact
        </button>
        <button
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-bg-surface px-6 py-3 font-body text-sm font-medium text-text-primary transition-colors duration-300 hover:border-accent/30 hover:text-accent"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </section>
  );
}
```

**Step 7: Assemble home page**

Update `app/routes/index.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "~/components/home/hero-section";
import { ServicesSection } from "~/components/home/services-section";
import { ContactLinks } from "~/components/home/contact-links";
import { ActionButtons } from "~/components/home/action-buttons";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <HeroSection />
      <ServicesSection />
      <ContactLinks />
      <ActionButtons />
    </div>
  );
}
```

**Step 8: Verify home page**

Run: `npx vinxi dev`
Expected: Dark luxury home page with hero, services pills, contact links, and action buttons.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: build home page with hero, services, contacts, and save/share actions"
```

---

## Task 5: Set Up Cloudflare D1 + Wrangler

**Files:**
- Create: `wrangler.toml`
- Create: `db/schema.sql`
- Create: `db/seed.sql`
- Modify: `package.json` (add wrangler scripts)

**Step 1: Install Wrangler**

```bash
npm install -D wrangler
```

**Step 2: Create `wrangler.toml`**

```toml
name = "contact-site"
compatibility_date = "2024-12-01"

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "contact-site-db"
database_id = "placeholder-will-be-set-after-create"

[[kv_namespaces]]
binding = "CACHE"
id = "placeholder-will-be-set-after-create"
```

**Step 3: Create `db/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published_at TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

**Step 4: Create `db/seed.sql`**

```sql
INSERT INTO portfolio_items (title, description, tech_stack, link, sort_order) VALUES
  ('Advanced Engineers Website', 'Corporate website for Advanced Engineering Consultants featuring project showcases and service descriptions.', '["HTML", "CSS", "JavaScript"]', 'https://www.advanced-engineers.com', 1),
  ('Contact Site', 'Personal digital business card with vCard download, built with TanStack Start on Cloudflare Workers.', '["TanStack Start", "React", "Tailwind CSS", "Cloudflare Workers", "D1"]', 'https://sfrederick.dev', 2);

INSERT INTO blog_posts (slug, title, content, excerpt, published_at) VALUES
  ('hello-world', 'Hello World', '# Hello World\n\nWelcome to my blog. I will be writing about engineering, web development, and technology.\n\nStay tuned for more posts.', 'Welcome to my blog. I will be writing about engineering, web development, and technology.', datetime('now'));
```

**Step 5: Add npm scripts**

Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "db:setup": "wrangler d1 execute contact-site-db --local --file=./db/schema.sql",
    "db:seed": "wrangler d1 execute contact-site-db --local --file=./db/seed.sql",
    "deploy": "wrangler deploy"
  }
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Wrangler config and D1 database schema"
```

---

## Task 6: Create Server Functions + D1 Bindings

**Files:**
- Create: `app/lib/server/db.ts`
- Create: `app/lib/server/portfolio.ts`
- Create: `app/lib/server/blog.ts`
- Create: `app/lib/server/contact.ts`
- Create: `app/lib/server/analytics.ts`
- Create: `app/types.ts`

**Step 1: Create types**

Create `app/types.ts`:
```ts
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  link: string | null;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

export interface AnalyticsEvent {
  event_type: string;
  path: string;
  referrer?: string;
  user_agent?: string;
}
```

**Step 2: Create D1 helper**

Create `app/lib/server/db.ts`:
```ts
import { getWebRequest } from "@tanstack/react-start/server";

export function getD1() {
  const request = getWebRequest();
  const env = (request as any).cf?.env ?? (globalThis as any).__env__;
  return env.DB as D1Database;
}

export function getKV() {
  const request = getWebRequest();
  const env = (request as any).cf?.env ?? (globalThis as any).__env__;
  return env.CACHE as KVNamespace;
}
```

Note: The exact way to access Cloudflare bindings in TanStack Start may vary depending on the version. Check TanStack Start Cloudflare docs if the above doesn't work. The pattern may use `getEvent()` from vinxi or a different binding access method. Adapt as needed.

**Step 3: Create portfolio server functions**

Create `app/lib/server/portfolio.ts`:
```ts
import { createServerFn } from "@tanstack/react-start";
import type { PortfolioItem } from "~/types";

export const getPortfolioItems = createServerFn({ method: "GET" }).handler(
  async () => {
    // For now, return static data until D1 bindings are verified
    const items: PortfolioItem[] = [
      {
        id: 1,
        title: "Advanced Engineers Website",
        description: "Corporate website for Advanced Engineering Consultants.",
        image_url: null,
        tech_stack: ["HTML", "CSS", "JavaScript"],
        link: "https://www.advanced-engineers.com",
        sort_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Contact Site",
        description: "Personal digital business card built with TanStack Start on Cloudflare Workers.",
        image_url: null,
        tech_stack: ["TanStack Start", "React", "Tailwind CSS", "Cloudflare Workers"],
        link: "https://sfrederick.dev",
        sort_order: 2,
        created_at: new Date().toISOString(),
      },
    ];
    return items;
  }
);
```

**Step 4: Create blog server functions**

Create `app/lib/server/blog.ts`:
```ts
import { createServerFn } from "@tanstack/react-start";
import type { BlogPost, BlogPostSummary } from "~/types";

export const getBlogPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const posts: BlogPostSummary[] = [
      {
        id: 1,
        slug: "hello-world",
        title: "Hello World",
        excerpt: "Welcome to my blog. I will be writing about engineering, web development, and technology.",
        published_at: new Date().toISOString(),
      },
    ];
    return posts;
  }
);

export const getBlogPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post: BlogPost | null = slug === "hello-world"
      ? {
          id: 1,
          slug: "hello-world",
          title: "Hello World",
          content: "# Hello World\n\nWelcome to my blog. I will be writing about engineering, web development, and technology.\n\nStay tuned for more posts.",
          excerpt: "Welcome to my blog.",
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      : null;

    if (!post) throw new Error("Post not found");
    return post;
  });
```

**Step 5: Create contact server function**

Create `app/lib/server/contact.ts`:
```ts
import { createServerFn } from "@tanstack/react-start";
import type { ContactSubmission } from "~/types";

export const submitContactForm = createServerFn({ method: "POST" })
  .validator((data: ContactSubmission) => {
    if (!data.name || !data.email || !data.message) {
      throw new Error("All fields are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Invalid email address");
    }
    return data;
  })
  .handler(async ({ data }) => {
    // For now, just log. Will save to D1 once bindings are working.
    console.log("Contact form submission:", data);
    return { success: true, message: "Message sent successfully!" };
  });
```

**Step 6: Create analytics server function**

Create `app/lib/server/analytics.ts`:
```ts
import { createServerFn } from "@tanstack/react-start";
import type { AnalyticsEvent } from "~/types";

export const trackEvent = createServerFn({ method: "POST" })
  .validator((data: AnalyticsEvent) => data)
  .handler(async ({ data }) => {
    // For now, just log. Will save to D1 once bindings are working.
    console.log("Analytics event:", data);
    return { success: true };
  });
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add server functions for portfolio, blog, contact, and analytics"
```

---

## Task 7: Build Portfolio Page

**Files:**
- Create: `app/routes/portfolio.tsx`
- Create: `app/components/portfolio/portfolio-grid.tsx`
- Create: `app/components/portfolio/portfolio-card.tsx`

**Step 1: Create portfolio card component**

Create `app/components/portfolio/portfolio-card.tsx`:
```tsx
import { ExternalLink } from "lucide-react";
import type { PortfolioItem } from "~/types";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-bg-surface/50 p-6 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(201,169,98,0.08)]">
      {/* Image placeholder */}
      {item.image_url && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={item.image_url}
            alt={item.title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <h3 className="font-display text-xl text-text-primary">{item.title}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
        {item.description}
      </p>

      {/* Tech stack tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tech_stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-bg-elevated px-2 py-0.5 font-mono text-xs text-text-tertiary"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Link */}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-body text-sm text-accent transition-colors hover:text-accent-muted"
        >
          View project
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
```

**Step 2: Create portfolio grid component**

Create `app/components/portfolio/portfolio-grid.tsx`:
```tsx
import { PortfolioCard } from "./portfolio-card";
import type { PortfolioItem } from "~/types";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <PortfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

**Step 3: Create portfolio route**

Create `app/routes/portfolio.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getPortfolioItems } from "~/lib/server/portfolio";
import { PortfolioGrid } from "~/components/portfolio/portfolio-grid";

export const Route = createFileRoute("/portfolio")({
  loader: () => getPortfolioItems(),
  component: Portfolio,
});

function Portfolio() {
  const items = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
          Portfolio
        </h1>
        <p className="mt-4 font-body text-text-secondary">
          A selection of projects and work
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </header>
      <PortfolioGrid items={items} />
    </div>
  );
}
```

**Step 4: Verify portfolio page**

Run: `npx vinxi dev`
Navigate to `/portfolio`
Expected: Dark page with header and two project cards in a grid.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build portfolio page with project cards grid"
```

---

## Task 8: Build Resume Page

**Files:**
- Create: `app/routes/resume.tsx`
- Create: `app/components/resume/timeline.tsx`
- Create: `app/components/resume/skills-section.tsx`
- Create: `app/lib/resume-data.ts`

**Step 1: Create resume data**

Create `app/lib/resume-data.ts`:
```ts
export const resumeData = {
  experience: [
    {
      role: "Staff Engineer",
      company: "Advanced Engineering Consultants",
      location: "Tampa, FL",
      period: "Present",
      description:
        "Leading engineering projects across civil, structural, and MEP disciplines. Building internal tools and web applications to streamline engineering workflows.",
      highlights: [
        "Full-stack web development for internal tools",
        "Civil and structural engineering project leadership",
        "Client-facing technical consulting",
      ],
    },
  ],
  education: [
    {
      degree: "Engineering",
      school: "University",
      period: "",
      description: "Engineering fundamentals and applied sciences.",
    },
  ],
  skills: {
    engineering: [
      "Civil Engineering",
      "Structural Engineering",
      "MEP Engineering",
      "Fire Protection",
      "Building Design",
      "Construction Documents",
    ],
    development: [
      "TypeScript",
      "React",
      "Node.js",
      "Tailwind CSS",
      "Cloudflare Workers",
      "Full-Stack Development",
    ],
    other: [
      "SEO / Digital Marketing",
      "Product Design",
      "Developer Tools",
      "Technical Writing",
    ],
  },
};
```

Note: Fill in real education/experience data later. This is placeholder structure.

**Step 2: Create timeline component**

Create `app/components/resume/timeline.tsx`:
```tsx
interface TimelineItem {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-12">
      {items.map((item, i) => (
        <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-accent after:absolute after:left-[3px] after:top-4 after:h-full after:w-px after:bg-border">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-display text-lg text-text-primary">{item.role}</h3>
            <span className="font-mono text-xs text-text-tertiary">{item.period}</span>
          </div>
          <p className="mt-1 font-body text-sm text-accent">{item.company}</p>
          <p className="mt-1 font-body text-xs text-text-tertiary">{item.location}</p>
          <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
            {item.description}
          </p>
          {item.highlights.length > 0 && (
            <ul className="mt-3 space-y-1">
              {item.highlights.map((h, j) => (
                <li
                  key={j}
                  className="font-body text-sm text-text-secondary before:mr-2 before:text-accent before:content-['—']"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Create skills section**

Create `app/components/resume/skills-section.tsx`:
```tsx
interface SkillsSectionProps {
  skills: Record<string, string[]>;
}

const categoryLabels: Record<string, string> = {
  engineering: "Engineering",
  development: "Development",
  other: "Other",
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="space-y-8">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-3 font-display text-sm uppercase tracking-[0.15em] text-text-tertiary">
            {categoryLabels[category] ?? category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-bg-surface/50 px-3 py-1 font-body text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 4: Create resume route**

Create `app/routes/resume.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { resumeData } from "~/lib/resume-data";
import { Timeline } from "~/components/resume/timeline";
import { SkillsSection } from "~/components/resume/skills-section";
import { Download } from "lucide-react";

export const Route = createFileRoute("/resume")({
  component: Resume,
});

function Resume() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
          Resume
        </h1>
        <p className="mt-4 font-body text-text-secondary">
          Experience, education, and skills
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </header>

      {/* Experience */}
      <section className="mb-16">
        <h2 className="mb-8 font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
          Experience
        </h2>
        <Timeline items={resumeData.experience} />
      </section>

      {/* Education */}
      <section className="mb-16">
        <h2 className="mb-8 font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
          Education
        </h2>
        <Timeline
          items={resumeData.education.map((e) => ({
            role: e.degree,
            company: e.school,
            location: "",
            period: e.period,
            description: e.description,
            highlights: [],
          }))}
        />
      </section>

      {/* Skills */}
      <section>
        <h2 className="mb-8 font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
          Skills
        </h2>
        <SkillsSection skills={resumeData.skills} />
      </section>
    </div>
  );
}
```

**Step 5: Verify and commit**

Run: `npx vinxi dev`, navigate to `/resume`
Expected: Timeline layout with experience, education, skills sections.

```bash
git add -A
git commit -m "feat: build resume page with timeline and skills sections"
```

---

## Task 9: Build Blog Pages

**Files:**
- Create: `app/routes/blog/index.tsx`
- Create: `app/routes/blog/$slug.tsx`
- Create: `app/components/blog/post-list.tsx`
- Create: `app/components/blog/post-content.tsx`

**Step 1: Create blog post list component**

Create `app/components/blog/post-list.tsx`:
```tsx
import { Link } from "@tanstack/react-router";
import type { BlogPostSummary } from "~/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostList({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-center font-body text-text-secondary">
        No posts yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="group block rounded-xl border border-transparent p-6 transition-all duration-300 hover:border-accent/20 hover:bg-bg-surface/30"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl text-text-primary transition-colors group-hover:text-accent">
              {post.title}
            </h2>
            <time className="shrink-0 font-mono text-xs text-text-tertiary">
              {formatDate(post.published_at)}
            </time>
          </div>
          {post.excerpt && (
            <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
              {post.excerpt}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
```

**Step 2: Create blog post content component**

Create `app/components/blog/post-content.tsx`:
```tsx
import type { BlogPost } from "~/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostContent({ post }: { post: BlogPost }) {
  // Simple markdown-to-HTML (replace with a proper library later)
  const html = post.content
    .replace(/^### (.+)$/gm, '<h3 class="font-display text-xl text-text-primary mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-display text-2xl text-text-primary mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-display text-3xl text-text-primary mt-12 mb-6">$1</h1>')
    .replace(/\n\n/g, '</p><p class="font-body text-text-secondary leading-relaxed mb-4">')
    .replace(/^(?!<[hp])(.+)$/gm, '$1');

  return (
    <article className="mx-auto max-w-2xl">
      <header className="mb-12">
        <time className="font-mono text-xs text-text-tertiary">
          {formatDate(post.published_at)}
        </time>
        <h1 className="mt-4 font-display text-4xl font-semibold text-text-primary md:text-5xl">
          {post.title}
        </h1>
      </header>
      <div
        className="prose-dark font-body text-text-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
```

**Step 3: Create blog index route**

Create `app/routes/blog/index.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getBlogPosts } from "~/lib/server/blog";
import { PostList } from "~/components/blog/post-list";

export const Route = createFileRoute("/blog/")({
  loader: () => getBlogPosts(),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
          Blog
        </h1>
        <p className="mt-4 font-body text-text-secondary">
          Thoughts on engineering and technology
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </header>
      <PostList posts={posts} />
    </div>
  );
}
```

**Step 4: Create blog post route**

Create `app/routes/blog/$slug.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getBlogPost } from "~/lib/server/blog";
import { PostContent } from "~/components/blog/post-content";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getBlogPost({ data: params.slug }),
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        to="/blog"
        className="mb-12 inline-flex items-center gap-2 font-body text-sm text-text-tertiary transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to blog
      </Link>
      <PostContent post={post} />
    </div>
  );
}
```

**Step 5: Verify and commit**

Run: `npx vinxi dev`, navigate to `/blog` and `/blog/hello-world`
Expected: Blog listing with one post, clickable to individual post view.

```bash
git add -A
git commit -m "feat: build blog listing and post pages"
```

---

## Task 10: Build Contact Form Page

**Files:**
- Create: `app/routes/contact.tsx`
- Create: `app/components/contact/contact-form.tsx`

**Step 1: Create contact form component**

Create `app/components/contact/contact-form.tsx`:
```tsx
import { useState } from "react";
import { submitContactForm } from "~/lib/server/contact";
import { Send, Check } from "lucide-react";

export function ContactForm() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      await submitContactForm({ data });
      setFormState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/20 bg-bg-surface/50 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Check className="h-6 w-6 text-accent" />
        </div>
        <h3 className="font-display text-xl text-text-primary">Message Sent</h3>
        <p className="font-body text-sm text-text-secondary">
          Thank you for reaching out. I'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block font-body text-sm text-text-secondary">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block font-body text-sm text-text-secondary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-body text-sm text-text-secondary">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-border bg-bg-surface/50 px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
          placeholder="What can I help you with?"
        />
      </div>

      {error && (
        <p className="font-body text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-sm font-medium text-bg-primary transition-colors duration-300 hover:bg-accent-muted disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {formState === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

**Step 2: Create contact route**

Create `app/routes/contact.tsx`:
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "~/components/contact/contact-form";
import { contactData } from "~/lib/contact-data";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
          Contact
        </h1>
        <p className="mt-4 font-body text-text-secondary">
          Let's work together
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </header>

      <div className="grid gap-16 md:grid-cols-2">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Direct contact info */}
        <div className="space-y-6">
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-text-tertiary">
            Direct Contact
          </h2>
          <div className="space-y-4">
            {contactData.emails.map((e) => (
              <a
                key={e.address}
                href={`mailto:${e.address}`}
                className="flex items-center gap-3 font-body text-sm text-text-secondary transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 text-text-tertiary" />
                {e.address}
              </a>
            ))}
            <a
              href={`tel:${contactData.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-3 font-body text-sm text-text-secondary transition-colors hover:text-accent"
            >
              <Phone className="h-4 w-4 text-text-tertiary" />
              {contactData.phone}
            </a>
            <div className="flex items-center gap-3 font-body text-sm text-text-secondary">
              <MapPin className="h-4 w-4 text-text-tertiary" />
              {contactData.location.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify and commit**

Run: `npx vinxi dev`, navigate to `/contact`
Expected: Split layout with form on left, contact info on right.

```bash
git add -A
git commit -m "feat: build contact page with form and direct contact info"
```

---

## Task 11: Add Mobile Navigation

**Files:**
- Modify: `app/components/layout/navbar.tsx`

**Step 1: Add mobile hamburger menu**

Update `app/components/layout/navbar.tsx` to include a mobile menu toggle:
```tsx
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { Menu, X } from "lucide-react";

const routes = [
  { path: "/", label: "Home" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/resume", label: "Resume" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl text-text-primary tracking-wide">
          SF
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "relative font-body text-sm tracking-wide transition-colors duration-300",
                currentPath === route.path
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {route.label}
              {currentPath === route.path && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-bg-primary/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-body text-sm tracking-wide py-2 transition-colors",
                  currentPath === route.path ? "text-accent" : "text-text-secondary"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

**Step 2: Verify and commit**

Run: `npx vinxi dev`, resize to mobile width
Expected: Hamburger menu appears, toggles a dropdown nav.

```bash
git add -A
git commit -m "feat: add responsive mobile navigation"
```

---

## Task 12: Add Animations + Polish

**Files:**
- Modify: `app/styles.css` (add animation utilities)
- Create: `app/components/ui/fade-in.tsx`
- Modify: various page components to add fade-in

**Step 1: Add CSS animation utilities to `app/styles.css`**

Append to `app/styles.css`:
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
```

**Step 2: Create FadeIn wrapper component**

Create `app/components/ui/fade-in.tsx`:
```tsx
import { cn } from "~/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

**Step 3: Add fade-in animations to home page sections**

Update `app/routes/index.tsx` to wrap sections with `<FadeIn>`:
```tsx
import { FadeIn } from "~/components/ui/fade-in";

function Home() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <FadeIn>
        <HeroSection />
      </FadeIn>
      <FadeIn delay={200}>
        <ServicesSection />
      </FadeIn>
      <FadeIn delay={400}>
        <ContactLinks />
      </FadeIn>
      <FadeIn delay={500}>
        <ActionButtons />
      </FadeIn>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add fade-in animations and polish"
```

---

## Task 13: Final Verification + Cleanup

**Step 1: Remove old static files**

The old `index.html`, `styles.css`, `script.js`, and `services.md` are no longer needed. Remove them:
```bash
git rm index.html styles.css script.js services.md
```

Keep `README.md` but update it to reflect the new stack.

**Step 2: Update README.md**

Update `README.md` with the new tech stack, setup instructions (`npm install`, `npm run dev`, `npm run db:setup`), and deployment info.

**Step 3: Run dev server and verify all routes**

```bash
npx vinxi dev
```

Visit each route and verify:
- `/` -- Home with hero, services, contacts, action buttons
- `/portfolio` -- Project cards grid
- `/resume` -- Timeline + skills
- `/blog` -- Post listing
- `/blog/hello-world` -- Individual post
- `/contact` -- Form + contact info

Verify mobile responsiveness at 375px width.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old static files and update README"
```

**Step 5: Build for Cloudflare**

```bash
npm run build
```

Verify the build succeeds without errors.

```bash
git add -A
git commit -m "chore: verify production build"
```
