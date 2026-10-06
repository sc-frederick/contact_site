# Cloudflare setup

Production infrastructure is declared in `alchemy.run.ts`. The cf CLI supplies
local bindings and generates application types; use Alchemy for production
changes.

## Existing production account

The stack keeps these existing resource identities:

- Worker: `contact-site`
- D1: `contact-site-db` (`f3fb4f29-7bd9-468d-a716-13da94ef2718` in cloudflare.config.ts)
- Custom domains: `sfrederick.dev` and `www.sfrederick.dev`
- Contact limiter: namespace `41001`, 5 requests per 60 seconds
- Analytics limiter: namespace `41002`, 120 requests per 60 seconds
- Email sender: `contact@sfrederick.dev`; destination: `sfred.mail@gmail.com`

Connect the correct account using an Alchemy profile:

```bash
pnpm exec alchemy profile edit --add Cloudflare
```

The matching production Turnstile secret was read through cf, verified with
Siteverify, and saved in the ignored `.env` file with permissions `0600`. The
widget was not changed. The public key remains `0x4AAAAAADnzUOVvXoGJmmGf`.
Keep production secrets out of `.dev.vars.example`.

```bash
pnpm build
pnpm exec alchemy plan --stage prod --adopt --env-file .env --no-input
pnpm exec alchemy deploy --stage prod --adopt --env-file .env
```

The first production deployment completed on 2026-10-06, reusing the existing
Worker and adopting the existing database. Live checks passed, and a subsequent
Alchemy plan reports no changes. The deployment used the existing cf OAuth login as temporary
process credentials. The default Alchemy profile has no Cloudflare provider;
configure one with the command above, or supply `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN` in the deployment environment. See
[Stack migration verification](stack-migration.md) for version IDs and checks.

Alchemy persists state locally under `.alchemy/state/contact-site/prod/`.
Preserve this private directory across deployments. It contains the secret
binding value; directories are restricted to `0700` and state files to `0600`.
Configure a shared state
store before using CI or several deployment machines.

## D1 migrations

Alchemy applies `db/migrations/0001_existing_schema.sql`. It is the original
`CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` schema. Existing data
and table names remain intact. Do not seed production as part of this migration.

| Table | Current use |
| --- | --- |
| `contact_submissions` | Contact form storage |
| `analytics_events` | Optional endpoint; no automatic visitor tracking |
| `portfolio_items` | Retained legacy table; displayed projects live in repository data |
| `blog_posts` | Retained legacy table; no blog routes |

## Local development

```bash
cp .dev.vars.example .dev.vars
pnpm db:setup
pnpm dev
```

The example Turnstile keys render a public test widget. Cloudflare's dummy
verification response does not include the real hostname and `contact` action,
so the application's strict verification rejects it. Configure a real widget for
your local hostname to exercise successful verification. Effect service tests
cover the full workflow, including delivery failure after storage.

D1, native limiters, and email bindings are simulated locally. Local commands
and the SvelteKit adapter share `.cloudflare/state/v3`; cf adds `v3` to the
`--persist-to .cloudflare/state` argument. The original local state was copied
from `.wrangler/state/v3` and retained there as a backup.

`cloudflare.config.ts` is the source for CLI bindings and `.cloudflare/types/`.
The native adapter still requires Wrangler internally, so
`tools/cloudflare-adapter.ts` derives an ignored configuration bridge and emits
cf Build Output after Kit builds. `wrangler.config.ts` contains bundler settings
only. `tools/local-cf.mjs` exits after successful local commands because the
pinned cf beta otherwise retains its Miniflare process. The wrapper flushes
output before exiting. Local secrets come only from `.dev.vars`. `pnpm db:seed`
contains optional sample data and does not affect the portfolio shown by the app.
Run it once on a fresh local database; the original seed has unique blog slugs.

## New account or fork

Change the resource names, domains, email sender/destination allowlists, and public
Turnstile site key in `alchemy.run.ts`. Update `cloudflare.config.ts` to match local
binding names and the new database ID after provisioning. Configure the domain
and email service in the target account, then provide that widget's matching
secret. Alchemy manages the Worker, database, bindings, and custom domains.

## Command discovery

Use `cf cli search "<action and resource type>"`, then inspect the selected
command with `--help`. Search queries must omit names, domains, emails, account
IDs, resource IDs, and tokens. Actual resource commands accept those identifiers.

## References

- [Cloudflare CLI migration](https://developers.cloudflare.com/cf/wrangler/migrate/)
- [Cloudflare CLI configuration](https://developers.cloudflare.com/cf/projects/cloudflare-config/)
- [Alchemy profiles](https://alchemy.run/environments/profiles/)
- [Alchemy deploy and adoption](https://alchemy.run/cli/deploy/)
- [Alchemy state storage](https://alchemy.run/state-store/)
- [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
