# sfrederick.dev

This repository contains the source for [sfrederick.dev](https://sfrederick.dev),
Stephen Frederick's personal site. It has a portfolio, a resume, and a contact
form. TanStack Start renders the React app on a Cloudflare Worker.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Profile and contact links |
| `/portfolio` | The full project list with detail dialogs |
| `/resume` | Work history, education, and skills |
| `/contact` | Direct contact details and the contact form |

The router also provides a custom 404 page. There are no blog or admin routes.

## Stack

- TanStack Start and TanStack Router
- React 19 and TypeScript
- Vite 8 with the Cloudflare Vite plugin
- Tailwind CSS 4
- Cloudflare Workers, D1, Rate Limiting, Turnstile, and Email Sending
- pnpm 10

## Run it locally

Vite 8 requires Node.js `^20.19.0` or `>=22.12.0`. This repo pins pnpm 10.10.0
in `package.json`.

Install the dependencies:

```bash
pnpm install
```

Create `.dev.vars` for the contact form. The Turnstile values below are
Cloudflare's public test credentials and always pass verification.

```dotenv
CONTACT_FROM_EMAIL=contact@sfrederick.dev
CONTACT_FROM_NAME=sfrederick.dev contact form
CONTACT_TO_EMAIL=you@example.com
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Start Vite:

```bash
pnpm run dev
```

Open `http://localhost:3000`.

The profile, portfolio, and resume pages do not need D1. The contact form writes
submissions to D1, so apply the local schema before testing it:

```bash
pnpm run db:setup
```

The seed data is optional:

```bash
pnpm run db:seed
```

## What the app uses today

Portfolio items live in `app/lib/server/db.ts`. The portfolio route loader fetches
that in-memory list through a TanStack server function. Resume and contact
details live in `app/lib/resume-data.ts` and `app/lib/contact-data.ts`.

The contact form validates input on the client and server, limits each IP address
to five requests per minute, and verifies a Turnstile token. It stores valid
submissions in D1, then sends an email through the `SEND_EMAIL` binding. The app
does not retain the visitor's IP address or user agent with the submission.

`server.ts` wraps the TanStack handler. It redirects non-local HTTP requests to
HTTPS and adds CSP, HSTS, frame, content type, referrer, and permissions headers
to responses returned by the TanStack handler.

## Unfinished code

The app uses D1 for contact submissions and analytics events. Portfolio reads
still use the in-memory list in `app/lib/server/db.ts`. That file also contains
leftover mock blog data, but the repository has no blog routes or blog data
loader.

The analytics server functions write to D1, but the rendered app does not call
them. Seeding D1 does not change the portfolio content shown by the current app.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Starts Vite on port 3000 |
| `pnpm run build` | Builds the Worker bundle |
| `pnpm run test` | Runs the Vitest suite |
| `pnpm run typecheck` | Regenerates Cloudflare types and runs TypeScript checks |
| `pnpm run preview` | Serves the production build locally |
| `pnpm run cf-typegen` | Generates types for Cloudflare bindings |
| `pnpm run db:setup` | Applies `db/schema.sql` to local D1 |
| `pnpm run db:seed` | Applies `db/seed.sql` to local D1 |
| `pnpm run deploy` | Deploys with Wrangler |

## Repository map

| Path | Contents |
| --- | --- |
| `app/routes/` | TanStack file routes |
| `app/components/` | Page sections and shared UI |
| `app/lib/server/` | Server functions for portfolio, contact, email, Turnstile, and analytics |
| `app/lib/resume-data.ts` | Resume content |
| `app/lib/contact-data.ts` | Public profile and contact details |
| `db/` | The D1 schema and sample seed data |
| `docs/` | Cloudflare setup notes and the profile photo used on the home page |
| `server.ts` | Worker entry and response security headers |
| `wrangler.jsonc` | Worker routes, bindings, and production variables |

## Deploy

The checked-in Wrangler configuration belongs to `sfrederick.dev`. It names the
production Worker, custom domains, D1 database, rate limiters, email binding, and
public variables. A fork must replace those values with its own Cloudflare
resources.

Production also needs the Turnstile secret:

```bash
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
```

Build and deploy:

```bash
pnpm run build
pnpm run deploy
```

## License

`package.json` declares the ISC license. This repository does not include a
separate license file.
