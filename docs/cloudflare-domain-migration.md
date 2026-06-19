# Domain consolidation runbook (Vercel → Cloudflare)

Goal: consolidate the whole devstack onto Cloudflare — registrar + DNS + hosting in one
account. This covers the two domains currently **registered at Vercel**:
`scoutwork.app` and `sfrederick.dev`. (`aeccloud.io` is registered at a third party and is
out of scope here.)

Status as of 2026-06-19:

- `contact-site` is a TanStack Start + Workers app (D1 `contact-site-db` + KV `CACHE`),
  deployed to the `contact-site` worker (`contact-site.sc-frederick.workers.dev`).
  `master` now equals the TanStack redesign.
- `scoutwork.app` already uses Cloudflare nameservers (`cris/pearl.ns.cloudflare.com`) →
  zone active, ready for registrar transfer now.
- `sfrederick.dev` still uses Vercel nameservers → needs DNS → Cloudflare first, then transfer.

---

## Pre-flight (once)

- Cloudflare account has a **verified email** and a **valid payment method** on file.
- Eligibility ✅: both domains were registered 2026-03-19 (past the ICANN 60-day
  post-registration lock), so they're eligible to transfer out.
- Cloudflare Registrar is **at-cost** (no markup); Vercel charges nothing to release. Each
  transfer **adds a 1-year extension** → expiry moves Mar 2027 → **Mar 2028**.

---

## Domain A — `scoutwork.app` (already on Cloudflare DNS → transfer only)

Nameservers are already `cris/pearl.ns.cloudflare.com`, so the DNS step is done. Go straight
to the registrar transfer:

1. **Unlock + get the auth code from Vercel:** Vercel dashboard → **Domains** → **⋯
   (triple-dot) menu** on `scoutwork.app` → **Transfer Out**. For Vercel-registered domains
   there is **no separate unlock toggle** — running **Transfer Out** is what removes the
   transfer lock (`clientTransferProhibited`) *and* reveals the **EPP/auth code**. Copy the code.
   - ⚠️ **Do this BEFORE starting the transfer in Cloudflare.** If you skip it, Cloudflare's
     pre-check stops with *"scoutwork.app cannot be transferred — Domain is locked"* and never
     prompts for the code.
   - Allow **5–24h** for the unlock to propagate. Verify at <https://lookup.icann.org> that
     **Domain Status** no longer shows `clientTransferProhibited` (should read `ok`).
2. **Start the transfer in Cloudflare:** dashboard → **Domain Registration → Transfer
   Domains** → select `scoutwork.app` → paste the auth code.
3. **Pay + contact info:** confirm payment (≈ $15, +1 yr) and enter accurate registrant
   contacts (Cloudflare redacts these from public WHOIS by default).
4. **Approve:** respond to the confirmation email from Vercel/registry. Completes in
   ~5 business days.
5. **Auto-renew:** after it lands, **Domain Registration → `scoutwork.app` → Configuration →
   enable Auto-Renew**.

> ⚠️ If the transfer errors on **DNSSEC**: Cloudflare DNS → `scoutwork.app` → **DNSSEC**,
> disable it, wait, retry. Also decide what `scoutwork.app` should serve — it's on CF DNS
> but has no worker attached yet.

---

## Domain B — `sfrederick.dev` (DNS first → point at worker → transfer)

Still on Vercel nameservers, so it needs the full sequence.

### Step 1 — Move DNS to Cloudflare

1. **(First) disable DNSSEC at Vercel** for `sfrederick.dev` if enabled, and wait ~24h before
   changing nameservers (prevents the domain going unreachable).
2. Cloudflare dashboard → **Domains → Onboard a domain** → enter `sfrederick.dev` → let
   Cloudflare **scan/import** existing DNS records → choose the **Free** plan.
3. Review imported records. **Remove** any leftover `A → 76.76.21.21` or other Vercel records
   for the hostnames you'll route to the worker (apex + www) — the worker custom domain
   creates its own.
4. Copy the **two Cloudflare nameservers** shown (also on the zone **Overview** page; these
   are fixed and can't be changed).
5. **Vercel** → Domains → `sfrederick.dev` → replace the nameservers with the Cloudflare pair.
6. Wait until Cloudflare shows the zone **Active** (minutes–24h; you'll get an email).
   Confirm with `dig NS sfrederick.dev`.

### Step 2 — Point `sfrederick.dev` at the `contact-site` worker

Once the zone is **Active**, pick either method.

**Dashboard:** Workers & Pages → **contact-site** → **Settings → Domains & Routes → Add →
Custom Domain** → enter `sfrederick.dev` → Add. Repeat for `www.sfrederick.dev`. Cloudflare
auto-creates the DNS records and issues the certs.

**…or wrangler** (edit `wrangler.jsonc`, then `pnpm run build && npx wrangler deploy`):

```jsonc
"routes": [
  { "pattern": "sfrederick.dev",     "custom_domain": true },
  { "pattern": "www.sfrederick.dev", "custom_domain": true }
]
```

> Note: a worker custom domain matches the **exact hostname** — `sfrederick.dev` won't catch
> `www`, so add both (as above) or set a www→apex redirect. Expect a brief cutover window
> between the NS flip and cert issuance; do it during low traffic.

### Step 3 — Transfer the registrar (after the zone is Active)

Same flow as Domain A: Vercel **Domains → ⋯ → Transfer Out** (copy auth code) → Cloudflare
**Domain Registration → Transfer Domains** → `sfrederick.dev` → paste code → pay (≈ $13,
+1 yr) → enter contacts → approve the email → **enable Auto-Renew**.

---

## Cleanup (only after `sfrederick.dev` serves from the worker)

- Verify https://sfrederick.dev loads the new TanStack site and the contact form / portfolio
  work.
- Then remove the domain from / delete the **Vercel `contact-site` project** so nothing
  dangles. Don't do this earlier — the domain must be live on the worker first.

---

## Sequencing cheat-sheet

- `scoutwork.app`: **transfer now** (DNS already done).
- `sfrederick.dev`: **DNS → worker custom domain → transfer** (registrar transfer is blocked
  until the CF zone is Active).
- `aeccloud.io`: out of scope (third-party registrar) — separate transfer if you want it too.

---

## Sources

- [Cloudflare — Full setup / change nameservers](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Cloudflare — Transfer your domain to Cloudflare](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/)
- [Cloudflare — Custom Domains for Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare Registrar — Supported TLDs (.dev/.app)](https://developers.cloudflare.com/registrar/top-level-domains/)
- [Vercel — Transfer your domain out (get auth code)](https://examples.vercel.com/kb/guide/how-do-i-transfer-my-domain-out-of-vercel)
