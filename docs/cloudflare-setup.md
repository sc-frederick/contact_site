# Cloudflare Workers Setup

One-time setup to provision the D1 database and configure Worker bindings in `wrangler.jsonc`.

## Prerequisites

- `wrangler` installed and authenticated (`npx wrangler login`)
- Cloudflare account with Workers access

---

## 1. Create the D1 Database

```bash
npx wrangler d1 create contact-site-db
```

Output will include:

```
✅ Successfully created DB 'contact-site-db'

[[d1_databases]]
binding = "DB"
database_name = "contact-site-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` value.

---

## 2. Update `wrangler.jsonc`

Replace the placeholder values with your real IDs:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "contact-site",
  "compatibility_date": "2026-08-11",
  "compatibility_flags": ["nodejs_compat"],
  "main": "./server.ts",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "contact-site-db",
      "database_id": "<paste database_id here>"
    }
  ],
  "ratelimits": [
    {
      "name": "CONTACT_RATE_LIMITER",
      "namespace_id": "41001",
      "simple": { "limit": 5, "period": 60 }
    },
    {
      "name": "ANALYTICS_RATE_LIMITER",
      "namespace_id": "41002",
      "simple": { "limit": 120, "period": 60 }
    }
  ]
}
```

Commit and push after updating — the next deploy will pick up the real bindings.

---

## 3. Apply the Database Schema

Run against the **remote** (production) D1 database:

```bash
npx wrangler d1 execute contact-site-db --remote --file=./db/schema.sql
```

Verify tables were created:

```bash
npx wrangler d1 execute contact-site-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 4. (Optional) Seed with Sample Data

```bash
npx wrangler d1 execute contact-site-db --remote --file=./db/seed.sql
```

> The seed file contains placeholder portfolio projects, blog posts, and sample contact submissions. Replace with real content before going live.

---

## 5. Local Development

For local development, D1 and rate-limiting bindings are simulated in-process.

Apply schema locally:

```bash
pnpm run db:setup
```

Seed locally:

```bash
pnpm run db:seed
```

Start dev server:

```bash
pnpm run dev
```

---

## Tables Created by Schema

| Table | Purpose |
|---|---|
| `portfolio_items` | Projects shown on the portfolio page |
| `blog_posts` | Blog content (slug-routed) |
| `contact_submissions` | Form submissions from the contact page |
| `analytics_events` | Lightweight pageview / click tracking |
