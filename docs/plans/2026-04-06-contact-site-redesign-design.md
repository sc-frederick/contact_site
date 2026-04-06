# Contact Site Redesign -- Full-Stack on TanStack Start + Cloudflare Workers

**Date**: 2026-04-06
**Status**: Approved

## Overview

Rebuild the current static HTML/CSS/JS digital business card into a full-featured personal site using TanStack Start, deployed to Cloudflare Workers. The site expands from a single contact card to a multi-page personal platform with portfolio, resume, blog, and contact form -- all powered by Cloudflare's edge infrastructure (D1, KV, Workers).

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | TanStack Start | Full-stack React, type-safe routing, server functions, Cloudflare Workers preset |
| Runtime | Cloudflare Workers | Edge deployment, global low-latency, native bindings to D1/KV/R2 |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with pre-built accessible components, themed to dark luxury |
| Database | Cloudflare D1 | SQLite at the edge for portfolio, blog, contact submissions, analytics |
| Cache | Cloudflare KV | Edge-cached content for instant global loads |
| Email | Resend (or Mailchannels) via Workers | Contact form email notifications |
| Typography | Playfair Display + DM Sans + JetBrains Mono | Luxury serif + clean sans + technical mono |

## Routes

```
/                  -> Contact card hero landing page
/portfolio         -> Project showcase grid
/resume            -> Professional CV / experience timeline
/blog              -> Article listing
/blog/:slug        -> Individual blog post
/contact           -> Contact form with server-side handling
```

## Server Functions

- `submitContactForm` -- validate, store in D1, send email notification
- `trackEvent` -- log page view / link click to D1 analytics table
- `getPortfolioItems` -- fetch from D1, cache in KV
- `getBlogPosts` / `getBlogPost` -- fetch from D1, cache in KV
- `getResumeData` -- fetch from D1 or static JSON, cache in KV
- `getAnalytics` -- admin analytics view (future)

## D1 Database Schema

```sql
CREATE TABLE portfolio_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT,          -- JSON array of tech names
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,     -- Markdown content
  excerpt TEXT,
  published_at TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,  -- 'page_view', 'link_click', 'download_vcard', etc.
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## Visual Design System

### Aesthetic

Dark luxury -- high-end watch brand meets tech studio. Near-black backgrounds with warm gold accents. Premium feel without being gaudy.

### Color Palette

```
--bg-primary:     #09090B    (near-black, zinc-950)
--bg-surface:     #18181B    (dark card surface, zinc-900)
--bg-elevated:    #27272A    (elevated elements, zinc-800)
--accent:         #C9A962    (warm gold)
--accent-muted:   #A68B4B    (darker gold for hover states)
--text-primary:   #FAFAFA    (near-white)
--text-secondary: #A1A1AA    (muted zinc)
--text-tertiary:  #71717A    (dimmer zinc)
--border:         #27272A    (subtle borders)
--glow:           rgba(201, 169, 98, 0.15)  (gold glow)
```

### Typography

- **Display/Headings**: Playfair Display -- serif with character, luxury editorial feel
- **Body**: DM Sans -- geometric sans-serif, clean and modern
- **Mono/Code**: JetBrains Mono -- for technical content, code blocks

### Layout Principles

- Full-viewport dark background with subtle CSS noise texture overlay
- Minimal top navigation: name left, routes right, gold accent on active
- Content max-width 1200px with generous padding
- Cards with subtle zinc-800 borders, no heavy shadows
- Gold accent used sparingly: active nav, hover states, CTAs, dividers
- Subtle gradient line separators instead of solid borders

### Signature Design Details

- Page transitions with smooth fade/slide (TanStack Router)
- Hero: large name typography with subtle gold text-shadow glow
- Service pills: glassmorphism (backdrop-blur, translucent bg, thin white border)
- Contact links: gold underline animation on hover (grows from left)
- Scroll-triggered fade-in animations for portfolio and resume
- CSS noise/grain texture overlay on backgrounds
- Custom subtle glow on interactive elements

### Page Layouts

1. **Home (/)** -- Full-width editorial hero. Large name + title, service pills with glassmorphism, contact links as refined list, Save/Share CTAs with gold accent.

2. **Portfolio (/portfolio)** -- Staggered grid. Dark surface cards with image, title overlay, tech stack tags. Hover: lift + gold border glow.

3. **Resume (/resume)** -- Timeline layout. Dates left, role/company/description right. Education below. Skills as tags or bar visualization.

4. **Blog (/blog)** -- Clean editorial list. Title in Playfair, excerpt in DM Sans, date + reading time metadata.

5. **Blog Post (/blog/:slug)** -- Long-form centered layout (~720px). Playfair headings, DM Sans body, JetBrains Mono code blocks with syntax highlighting.

6. **Contact (/contact)** -- Minimal form: name, email, message fields. Gold submit button. Animated success state.

## Data / Content Notes

### Contact Info (from current site)

- Name: Stephen Frederick
- Title: Staff Engineer
- Company: Advanced Engineering Consultants
- Email: sfrederick@advanced-engineers.com
- Email: sc.frederick@outlook.com
- Phone: +1 (813) 406-0178
- Website: www.advanced-engineers.com
- GitHub: github.com/sc-frederick
- Location: Tampa, FL

### Services

Civil Engineering, Structural Engineering, MEP Engineering, Fire Protection, Building Design, Construction Documents, Engineering Inspections, Fullstack Web Development, Developer Tools, SEO / Digital Marketing, Product Design

### Known Issues to Fix

- Current site has duplicate `advanced-engineers.com` link (one should be `sfrederick.dev`)
- vCard missing personal email, GitHub, and phone number
- `services.md` is stale (unused)
- Dead code in `script.js` for `.social-link` class that doesn't exist

## Deployment

- Deploy to Cloudflare Workers via `wrangler`
- D1 database provisioned via `wrangler d1 create`
- KV namespace provisioned via `wrangler kv namespace create`
- CI/CD: Cloudflare Pages or direct `wrangler deploy`
