# Project instructions

Preserve the existing UI, route content, responsive behavior, and accessibility when changing the underlying stack.

## Vendored references

- `repos/effect/` is the pinned Effect v4 source. Read `repos/effect/LLMS.md` before writing Effect code and use its implementation, examples, and tests as reference.
- `repos/anti-slop/` is the pinned anti-slop source. The installed rules live in `tools/oxlint/anti-slop/`.
- Treat `repos/` as read-only reference material. Import application dependencies from their installed packages, never from `repos/`.
- Update subtrees with `git subtree pull --prefix=<path> <upstream> <revision> --squash`.

## Checks

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Validate changed Svelte components with the Svelte autofixer. Check desktop and mobile layouts when porting UI.

## Cloudflare tooling

- Use `cf` for Cloudflare CLI operations. Discover commands with `cf cli search "<action and resource type>"`, then inspect the selected command's help. Keep search queries anonymous: no account IDs, resource IDs, domains, names, emails, or tokens.
- `cloudflare.config.ts` owns CLI binding declarations; Alchemy owns production infrastructure. Do not edit the generated `.cloudflare/adapter/wrangler.json` bridge.
- Local D1 commands must use `--local --persist-to .cloudflare/state`. The native adapter uses the corresponding `.cloudflare/state/v3` path.
- Keep local widget credentials in `.dev.vars` and production secrets in the ignored `.env`. Never print Turnstile widget responses or secret values.
