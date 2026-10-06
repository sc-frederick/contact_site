# Stack migration verification

The React/TanStack application was ported to SvelteKit 3.0.1, Svelte 5.57.2,
Effect 4.0.1, and Alchemy 2.0.0-beta.81. Effect and anti-slop were vendored as
squashed Git subtrees before application changes. Their commits and update
commands are recorded in the README.

## Preserved behavior

- The four routes, custom 404, eleven portfolio records, resume, and public
  contact content retain their existing markup structure and design classes.
- The original photo, fonts, icons, SVG drawings, and WGSL shader recipes remain.
- Mobile navigation, active links, project dialogs, focus restoration, motion
  preferences, portrait reveal, and the scroll-following timeline remain.
- Contact validation limits, user feedback, provider ordering, rate limits,
  Turnstile hostname/action checks, parameterized D1 writes, fixed-recipient
  email, and visitor metadata exclusion remain.
- The optional analytics capability remains; the UI still does not call it.
- The HTTPS redirect and security headers remain.

## Checks completed on 2026-10-06

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed, including vendored anti-slop and Effect rules |
| `pnpm format:check` | Passed; formatter output is stable |
| `pnpm typecheck` | Passed; Svelte reports zero errors and zero warnings, Alchemy stack compiles |
| `pnpm test` | All 15 tests passed |
| `pnpm build` | Cloudflare Worker and assets built successfully |
| Svelte autofixer | All 28 components/modules reviewed; no issues |
| Desktop/mobile baselines | Captured and compared all four routes and 404 at 1280×800 and 390×800 |
| Browser interactions | Menu focus/Escape, navigation, dialog Tab wrapping/Escape/focus restoration, pause across navigation, reduced motion, timeline scrolling, field errors, and rejected contact feedback passed |
| Built Worker | Four routes return 200, custom 404 returns 404, security headers present |
| Asset exclusions | `/_worker.js` and `/wrangler.jsonc` return 404; server source is not exposed |
| Local analytics | Endpoint writes to D1 with null IP and user agent |

The baseline comparisons matched static geometry, typography, colors, and
visible content. Contact widget loading/error states differ with external
Turnstile responses and affect its card height; the underlying layout and field
positions remain the same. Required-marker and mobile date spacing differences
found during the port were corrected.

The autofixer's remaining ShaderSurface suggestions concern state updated after
an asynchronous module import. This is intentional resource acquisition with
cancellation cleanup; a synchronous derived value cannot replace it.

## Production deployment

Deployed through Alchemy on 2026-10-06 at 17:04 UTC after reviewing the plan.
`alchemy deploy --stage prod --adopt --env-file .env --yes --no-input` reused the
existing `contact-site` Worker and adopted D1 database
`f3fb4f29-7bd9-468d-a716-13da94ef2718`. The Worker and its 31 static assets were
uploaded successfully; both custom domains remain attached. No replacement
database, destructive migration, or production seed was applied.

The active deployment is `c8d6e194-171a-4bb7-9288-bafaa5f89ee5`, serving version
`f0f6cb2b-44e8-4762-a452-0f0f849ed4aa` at 100 percent. The preceding version
`c5d7d452-3e1a-4660-9e3f-eca6fbd03fbf` remains available in Cloudflare's version
history. A subsequent authenticated Alchemy plan reports no changes.

Production checks passed for all four pages, custom 404, both domains, stylesheet
and JavaScript assets, and security headers. Worker source and configuration
paths return 404. The production public Turnstile key matches the existing
widget, the shared browser receives a challenge response, and malformed fields
and invalid tokens produce failure responses. Desktop and mobile contact layouts
have no horizontal overflow; mobile menu focus and Escape behavior work.

The real Turnstile secret was recovered through the authenticated cf CLI,
validated with Siteverify, and saved in the ignored `.env` file with permissions
`0600`. The widget and public key were not changed. Production deployment used
the existing cf OAuth token only in the Alchemy child process environment.

The default Alchemy profile has no Cloudflare provider. For regular deployments,
configure an Alchemy profile or supply `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN` in the deployment environment. Deployment did
not persist cf's access or refresh tokens in the repository or another profile.
Alchemy state is stored under `.alchemy/state/contact-site/prod/`. Its directories
are restricted to `0700`, and state files to `0600`. This state includes the
secret binding value; preserve it privately between deployments.

Public Turnstile test credentials load the widget but return `example.com`
without a `contact` action at Siteverify. They are rejected by the original
strict checks. Contact success, storage failure, and post-storage email failure
are tested through the Effect service seams. The live Worker has the real widget
credentials and the constrained email binding. Production email delivery was
not exercised by the deployment checks.

Alchemy's Effect 4 release is currently pinned to a beta. The build also reports
one large lazy GPU chunk, about 2.54 MB minified / 708 KB gzip, from the retained
shader library. Static artwork does not depend on that download.

## cf CLI migration

The project uses cf 1.0.0-beta.12 for development, build, binding types, and local
D1 operations. `cloudflare.config.ts` replaces the old `wrangler.jsonc` binding
configuration. `wrangler.config.ts` retains only cf bundler settings. Wrangler
4.147.0 remains an internal dependency of cf's bundler and the native SvelteKit
adapter; project commands no longer call the Wrangler CLI.

The adapter bridge in `tools/cloudflare-adapter.ts` is generated from the cf
configuration and ignored under `.cloudflare/adapter/`. It emits cf Build Output
after Kit builds. Local credentials are read only from `.dev.vars`; the
production secret in `.env` is excluded from development bindings. cf-generated
types live in `.cloudflare/types/index.d.ts` and infer the required secret binding.

Local state was copied to `.cloudflare/state/v3` with the original retained.
`tools/local-cf.mjs` handles a pinned-beta issue where local Miniflare commands
retain an open process after returning: it waits for command completion and
flushes both streams before exiting. Database helpers always select `--local`.

Additional checks on 2026-10-06:

- cf type generation, Svelte diagnostics, infrastructure TypeScript, lint, and
  formatting pass. All 15 application tests pass.
- `cf build` finishes and validates `.cloudflare/output/v0/`.
- Local migrations complete and a repeat finds no unapplied migrations.
- Schema and original sample seed complete against an isolated fresh local D1.
  Reseeding reports the original unique blog-slug constraint failure.
- A development API analytics write is readable through cf in the shared local
  D1 database, with null IP and user agent.
- The shared browser loads the contact page without mobile overflow; menu open
  and Escape behavior remain intact. No UI components were changed for the CLI
  migration.
- The cf-bundled Worker returns 200 for all four pages and 404 for missing routes,
  `/_worker.js`, `/cloudflare.config.ts`, and `/wrangler.config.ts`. Security
  headers are present on every checked response.
- Local binding resolution uses the public test keys and excludes a production
  secret supplied by the parent process. The recovered secret is absent from
  tracked changes, the adapter bridge, and both Worker/asset output directories.
