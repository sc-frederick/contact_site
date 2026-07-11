/// <reference types="vite/client" />

// Secrets are set with `wrangler secret put` and are not present in wrangler.jsonc
// vars, so wrangler types does not emit them. Augment Env here.
declare namespace Cloudflare {
  interface Env {
    TURNSTILE_SECRET_KEY: string;
  }
}
