# Cloudflare Workers Setup

One-time setup to provision the D1 database and KV namespace, then wire their IDs into `wrangler.jsonc`.

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

## 2. Create the KV Namespace

```bash
npx wrangler kv namespace create CACHE
```

Output:

```
✅ Successfully created KV namespace 'contact-site-CACHE'
Add the following to your configuration file:
kv_namespaces = [
  { binding = "CACHE", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
]
```

You also need a preview namespace for local dev:

```bash
npx wrangler kv namespace create CACHE --preview
```

Output:

```
{ binding = "CACHE", preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" }
```

Copy both `id` and `preview_id` values.

---

## 3. Update `wrangler.jsonc`

Replace the placeholder values with your real IDs:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "contact-site",
  "compatibility_date": "2024-12-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "contact-site-db",
      "database_id": "<paste database_id here>"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "<paste id here>",
      "preview_id": "<paste preview_id here>"
    }
  ]
}
```

Commit and push after updating — the next deploy will pick up the real bindings.

---

## 4. Apply the Database Schema

Run against the **remote** (production) D1 database:

```bash
npx wrangler d1 execute contact-site-db --remote --file=./db/schema.sql
```

Verify tables were created:

```bash
npx wrangler d1 execute contact-site-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 5. (Optional) Seed with Sample Data

```bash
npx wrangler d1 execute contact-site-db --remote --file=./db/seed.sql
```

> The seed file contains placeholder portfolio projects, blog posts, and sample contact submissions. Replace with real content before going live.

---

## 6. Local Development

For local dev the database and KV run in-process — no remote resources needed.

Apply schema locally:

```bash
npm run db:setup
```

Seed locally:

```bash
npm run db:seed
```

Start dev server:

```bash
npm run dev
```

---

## Tables Created by Schema

| Table | Purpose |
|---|---|
| `portfolio_items` | Projects shown on the portfolio page |
| `blog_posts` | Blog content (slug-routed) |
| `contact_submissions` | Form submissions from the contact page |
| `analytics_events` | Lightweight pageview / click tracking |
