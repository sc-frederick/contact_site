# Stephen Frederick - Personal Site

Personal website, portfolio, resume, blog, and contact form for
[sfrederick.dev](https://sfrederick.dev). The app is built with TanStack Start
and deployed as a Cloudflare Worker.

## Current State

The production site is a server-rendered React app with file-based routes,
Cloudflare bindings, contact-form bot protection, email notifications, and
security headers. Portfolio and blog content currently come from in-repo mock data
in `app/lib/server/db.ts`; the D1 schema and bindings are present for the next
step of moving that content into Cloudflare D1.

## Features

- Responsive dark personal site with home, portfolio, resume, blog, and contact pages
- Featured-project and full-portfolio views with modal project details
- Resume timeline and skills sections backed by structured local data
- Blog listing and slug pages backed by local mock blog data
- Contact form with strict validation, Turnstile verification, native rate limiting, D1 persistence, and Email Sending notifications
- Lightweight analytics server functions for pageview and event tracking
- Custom Worker entry that enforces HTTPS and adds CSP, HSTS, frame, referrer, and permissions headers
- D1 schema for portfolio items, blog posts, contact submissions, and analytics events

## Tech Stack

- TanStack Start, TanStack Router, React 19, and TypeScript
- Vite 8 with the Cloudflare Vite plugin
- Tailwind CSS v4 with custom design tokens
- Cloudflare Workers for SSR and deployment
- Cloudflare's native Rate Limiting binding for contact-form abuse protection
- Cloudflare Turnstile for bot checks
- Cloudflare Email Sending for contact notifications
- Cloudflare D1 schema provisioned for future persistent content/submissions
- pnpm 10

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page with about hero, featured projects, skills, and contact CTA |
| `/portfolio` | Full portfolio grid |
| `/resume` | Resume timeline and skills |
| `/blog` | Blog post listing |
| `/blog/$slug` | Individual blog post |
| `/contact` | Contact form and collaboration details |

## Project Layout

| Path | Purpose |
| --- | --- |
| `app/routes/` | TanStack file routes |
| `app/components/` | Page and UI components |
| `app/lib/server/` | Server functions for portfolio, blog, contact, analytics, Turnstile, and email |
| `app/lib/resume-data.ts` | Resume content shown on `/resume` |
| `app/lib/contact-data.ts` | Public contact/profile data |
| `db/schema.sql` | D1 table and index schema |
| `db/seed.sql` | Optional sample data for local/remote D1 |
| `server.ts` | Custom Cloudflare Worker entry and security headers |
| `wrangler.jsonc` | Worker routes, bindings, vars, and deployment config |
| `docs/` | Cloudflare setup/migration notes and project plans |

## Prerequisites

- Node.js 20+
- pnpm 10+
- Cloudflare account access for deployment and remote resource management

Install dependencies:

```bash
pnpm install
```

## Local Development

Create a local `.dev.vars` file. The file is git-ignored and should contain the
local values needed by the contact form:

```dotenv
CONTACT_FROM_EMAIL=contact@sfrederick.dev
CONTACT_FROM_NAME=sfrederick.dev contact form
CONTACT_TO_EMAIL=your-email@example.com
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Apply the local D1 schema:

```bash
pnpm run db:setup
```

Optionally seed local D1:

```bash
pnpm run db:seed
```

Start the dev server:

```bash
pnpm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm run dev` | Start Vite dev server on port 3000 |
| `pnpm run build` | Build the production bundle |
| `pnpm run preview` | Preview the built Vite app |
| `pnpm run cf-typegen` | Generate Cloudflare binding types |
| `pnpm run db:setup` | Apply `db/schema.sql` to local D1 |
| `pnpm run db:seed` | Apply `db/seed.sql` to local D1 |
| `pnpm run deploy` | Deploy with Wrangler |

## Cloudflare Configuration

`wrangler.jsonc` is configured for:

- Worker name: `contact-site`
- Custom domains: `sfrederick.dev` and `www.sfrederick.dev`
- D1 binding: `DB` (`contact-site-db`)
- Native rate-limiting bindings for contact and analytics ingestion
- Email binding: `SEND_EMAIL`
- Public vars for contact email metadata and the Turnstile site key
- Secret required in Cloudflare: `TURNSTILE_SECRET_KEY`

For a first-time Cloudflare setup, see
[docs/cloudflare-setup.md](docs/cloudflare-setup.md).

Apply the schema to the remote D1 database when provisioning or changing tables:

```bash
npx wrangler d1 execute contact-site-db --remote --file=./db/schema.sql
```

Set or rotate the Turnstile secret with:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

## Deployment

Build locally before deploying:

```bash
pnpm run build
```

Deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

The Worker entry is `server.ts`, which wraps the TanStack Start handler to add
HTTPS redirects outside local development and security headers on every response.

## Data Notes

- Portfolio and blog read paths currently return mock data from `app/lib/server/db.ts`.
- Contact submissions and analytics events are persisted with parameterized D1 statements.
- Contact and analytics ingestion use separate native Rate Limiting bindings.
- Visitor IP addresses and raw user-agent strings are not retained with submissions or analytics events.
- Email Sending is the delivery path for contact messages; if email delivery fails, the form reports the failure to the visitor.

## Contact

- Website: [sfrederick.dev](https://sfrederick.dev)
- GitHub: [github.com/sc-frederick](https://github.com/sc-frederick)
- Email: sc.frederick@outlook.com
- Location: Tampa, FL

## License

This project is proprietary and maintained by Stephen Frederick.
