import { Stack, localState } from 'alchemy';
import * as Cloudflare from 'alchemy/Cloudflare';
import { Config, Effect } from 'effect';

/** Production infrastructure for the existing sfrederick.dev Worker and database. */
export default Stack(
  'contact-site',
  {
    providers: Cloudflare.providers(),
    state: localState(),
  },
  Effect.gen(function* () {
    const db = yield* Cloudflare.D1.Database('Database', {
      name: 'contact-site-db',
      migrations: './db/migrations',
    });

    const email = yield* Cloudflare.Email.SendEmail('SEND_EMAIL', {
      allowedDestinationAddresses: ['sfred.mail@gmail.com'],
      allowedSenderAddresses: ['contact@sfrederick.dev'],
    });

    const secret = yield* Config.Redacted('TURNSTILE_SECRET_KEY');

    const site = yield* Cloudflare.Worker('Website', {
      name: 'contact-site',
      main: './.svelte-kit/cloudflare/_worker.js',
      assets: { directory: './.svelte-kit/cloudflare', binding: 'ASSETS' },
      compatibility: { date: '2026-08-11', flags: ['nodejs_compat'] },
      workersDev: false,
      domain: {
        name: 'sfrederick.dev',
        aliases: ['www.sfrederick.dev'],
        previews: false,
      },
      observability: {
        enabled: true,
        logs: { enabled: true, invocationLogs: true, headSamplingRate: 0.1 },
        traces: { enabled: true, headSamplingRate: 0.01 },
      },
      env: {
        DB: db,
        SEND_EMAIL: email,
        CONTACT_RATE_LIMITER: Cloudflare.RateLimit('CONTACT_RATE_LIMITER', {
          namespaceId: '41001',
          simple: { limit: 5, period: 60 },
        }),
        ANALYTICS_RATE_LIMITER: Cloudflare.RateLimit('ANALYTICS_RATE_LIMITER', {
          namespaceId: '41002',
          simple: { limit: 120, period: 60 },
        }),
        CONTACT_FROM_EMAIL: 'contact@sfrederick.dev',
        CONTACT_FROM_NAME: 'sfrederick.dev contact form',
        CONTACT_TO_EMAIL: 'sfred.mail@gmail.com',
        TURNSTILE_SITE_KEY: '0x4AAAAAADnzUOVvXoGJmmGf',
        TURNSTILE_SECRET_KEY: secret,
      },
    });

    return { url: site.url, databaseId: db.databaseId };
  }),
);
