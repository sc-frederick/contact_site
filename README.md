# sfrederick.dev

Stephen Frederick's personal site: profile, portfolio, resume, and contact form.
SvelteKit 3 renders the site on a Cloudflare Worker. Effect 4 handles validation
and server workflows; Alchemy manages production infrastructure.

## Pages

| Route | Content |
| --- | --- |
| `/` | Profile and contact links |
| `/portfolio` | Eleven projects with detail dialogs |
| `/resume` | Work history, education, and skills |
| `/contact` | Direct contact details and the contact form |

The site retains the previous design, responsive layouts, text, icons, motion
controls, SVG artwork, and progressive WebGPU effects. It also has a custom 404.
There are no blog or admin routes.

## Stack

- SvelteKit **3.0.1**, Svelte **5.57.2**, TypeScript **6**
- Effect **4.0.1**
- Alchemy **2.0.0-beta.81** (the Effect 4 implementation)
- Vite 8, Tailwind CSS 4, Shaders 4
- Cloudflare Workers, D1, native Rate Limiting, Turnstile, and Email Sending
- Cloudflare CLI `cf` **1.0.0-beta.12**
- Oxlint with the vendored anti-slop and Effect rules
- pnpm 10.10.0

Alchemy is pinned to a beta release. Its stack is typechecked separately from the
Svelte application. SvelteKit 3 config lives in `vite.config.ts`; application
imports use `#lib`, as required by Kit 3.

## Local development

Use Node.js 24 or later and the pinned pnpm version.

```bash
pnpm install
cp .dev.vars.example .dev.vars
pnpm db:setup
pnpm dev
```

Open `http://localhost:3000`. The profile, portfolio, and resume do not require D1.
The example variables contain public Turnstile test credentials. They let the
widget load locally, but Cloudflare's test verification response has the hostname
`example.com` and no `contact` action. The existing server checks reject it. A
successful contact submission needs a real widget configured for the request
hostname, its matching secret, and an available email binding. The tests exercise
success and failure through the application's Effect services without weakening
those checks. Local email delivery is simulated by the Cloudflare runtime.

`pnpm db:seed` is optional sample data; it does not change the displayed portfolio.

## Application behavior

Portfolio items live in `src/lib/server/portfolio-data.ts` and load through the
SvelteKit server loader. Resume and public contact details live in
`src/lib/resume-data.ts` and `src/lib/contact-data.ts`.

`POST /api/contact` validates a strict, bounded Effect Schema, checks the existing
five-per-minute IP limiter, verifies Turnstile's hostname and `contact` action,
stores the submission in D1, then sends the fixed-recipient email. Tokens, IP
addresses, and user agents are not retained with submissions. Failed delivery is
reported honestly after storage. Application policy uses Effect services; the
Cloudflare adapters supply the actual bindings per request.

`POST /api/analytics` preserves the optional D1 analytics capability. The rendered
site does not call it. Metadata remains bounded, and IP/user agent columns remain
empty.

`src/hooks.server.ts` preserves the HTTPS redirect and response security headers.
Effects live in `src/lib/components/effects/` and `src/css/effects.css`. GPU code
loads near the viewport and static SVG artwork remains available without WebGPU.
Reduced motion, page visibility, and the footer's motion control govern animation.
Pointer effects require a hover-capable fine pointer. Printing shows the original
portrait.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | `cf dev`, which starts Vite on port 3000 with local Cloudflare bindings |
| `pnpm build` | `cf build`; native Kit output in `.svelte-kit/cloudflare/`, bundled Build Output in `.cloudflare/output/v0/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Oxlint, including all anti-slop and Effect rules |
| `pnpm format` / `pnpm format:check` | Format / check application and infrastructure code |
| `pnpm typecheck` | Generate bindings, check Svelte, and typecheck the Alchemy stack |
| `pnpm test` | Vitest validation and contact workflow tests |
| `pnpm cf-typegen` | `cf workers types`, generated in `.cloudflare/types/` |
| `pnpm db:setup` / `pnpm db:seed` | Apply local migrations / optional seed through `cf` |
| `pnpm infra:plan` | Build, then plan adoption of existing production resources |
| `pnpm deploy` | Build, then deploy through Alchemy with resource adoption |

## Infrastructure and deployment

`alchemy.run.ts` owns the production Worker `contact-site`, the existing
`contact-site-db` D1 database, rate limiters, email binding, variables, and both
custom domains (`sfrederick.dev` and `www.sfrederick.dev`). It bundles the native
Cloudflare adapter output with its static assets. `static/.assetsignore` prevents
the Worker source and configuration files from being served as public assets.
`cloudflare.config.ts` supplies the account, local bindings, and generated types.
`wrangler.config.ts` contains build settings for cf's installed bundler.

The pinned cf beta and SvelteKit Cloudflare adapter still depend on Wrangler
internally. `tools/cloudflare-adapter.ts` derives an ignored JSON configuration
for the native adapter from `cloudflare.config.ts`, then invokes cf's bundler
after Kit writes the Worker. No project script invokes the Wrangler CLI.
Local D1 commands and the adapter share `.cloudflare/state/v3/`; cf receives
`.cloudflare/state` and appends `v3`. Existing local state was copied there during
this migration, with the original retained under `.wrangler/state/v3/`.
Local widget credentials come from `.dev.vars`; the production `.env` secret is
excluded from the adapter's development bindings.

Sign in to cf for account operations:

```bash
pnpm exec cf auth login
pnpm exec cf auth whoami
```

Configure Alchemy's Cloudflare profile independently of cf:

```bash
pnpm exec alchemy profile edit --add Cloudflare
```

The existing widget's secret was retrieved through the authenticated cf CLI,
validated with Siteverify, and stored as `TURNSTILE_SECRET_KEY` in the ignored
`.env` file with permissions `0600`. It was not rotated or committed. The
deployment commands load that file:

```bash
pnpm infra:plan
pnpm deploy
```

The fixed resource names and `--adopt` transfer management of the existing
resources to Alchemy. The first production deployment completed on 2026-10-06
using the existing cf login; live checks passed and the subsequent plan reports
no changes. The verification record is in [Stack migration](docs/stack-migration.md).
`db/migrations/0001_existing_schema.sql` uses the original idempotent schema and
retains all existing tables. It contains no drops, replacements, or seed data.

This stack uses local Alchemy state under `.alchemy/state/contact-site/prod/`.
Keep that directory private and preserve it between deployments. It stores the
secret binding value; directories use `0700` and state files use `0600`. For deployments
from multiple machines or CI, configure a shared state store before enabling that
workflow. A fork must change the production resource names, domains, and email
allowlists. See [Cloudflare setup](docs/cloudflare-setup.md).

## Vendored references

The references were added as squashed Git subtrees before the port:

| Path | Upstream | Pinned commit |
| --- | --- | --- |
| `repos/effect/` | [Effect](https://github.com/Effect-TS/effect) | `2131d44bd105766994201d3ffa3e180c0d33f655` |
| `repos/anti-slop/` | [anti-slop](https://github.com/dmmulroy/anti-slop) | `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b` |

Read `repos/effect/LLMS.md` before writing Effect code. These directories are
reference material; application imports resolve to the pinned package dependency.
Installed lint rules live in `tools/oxlint/anti-slop/`, with their upstream license
and provenance. Update each subtree with
`git subtree pull --prefix=<path> <upstream> <revision> --squash`, then rerun the
anti-slop installer if its rules change.

## Repository map

| Path | Contents |
| --- | --- |
| `src/routes/` | SvelteKit pages, loaders, and HTTP endpoints |
| `src/lib/components/` | Svelte page sections, dialogs, and effects |
| `src/lib/server/` | Effect services and Cloudflare adapters |
| `src/lib/assets/` | Original profile photo |
| `src/css/`, `src/styles.css` | Existing design system and effects |
| `src/hooks.server.ts` | HTTPS redirect and security headers |
| `static/` | Public assets and asset upload exclusions |
| `db/` | Original schema, migration, and optional sample seed |
| `alchemy.run.ts` | Production infrastructure |
| `cloudflare.config.ts` | cf account, local bindings, and generated type source |
| `wrangler.config.ts`, `tools/cloudflare-adapter.ts` | cf bundler settings and native Kit adapter integration |
| `repos/`, `tools/oxlint/` | Vendored references and installed lint rules |

## License

`package.json` declares ISC. Vendored projects retain their own license files.
