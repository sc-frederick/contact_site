import { bindings, defineConfig } from 'cf/config';

/** Cloudflare CLI bindings and account; Alchemy manages production resources. */
export default defineConfig({
  accountId: '838798e8498ddea23910e8e812f26c17',
  worker: {
    name: 'contact-site',
    compatibilityDate: '2026-08-11',
    compatibilityFlags: ['nodejs_compat'],
    entrypoint: './.svelte-kit/cloudflare/_worker.js',
    workersDev: false,
    previewUrls: false,
    observability: {
      enabled: true,
      logs: {
        enabled: true,
        headSamplingRate: 0.1,
      },
      traces: {
        enabled: true,
        headSamplingRate: 0.01,
      },
    },
    domains: ['sfrederick.dev', 'www.sfrederick.dev'],
    env: {
      CONTACT_FROM_EMAIL: bindings.text('contact@sfrederick.dev'),
      CONTACT_FROM_NAME: bindings.text('sfrederick.dev contact form'),
      CONTACT_TO_EMAIL: bindings.text('sfred.mail@gmail.com'),
      TURNSTILE_SITE_KEY: bindings.text('0x4AAAAAADnzUOVvXoGJmmGf'),
      TURNSTILE_SECRET_KEY: bindings.secret(),
      DB: bindings.d1({
        name: 'contact-site-db',
        id: 'f3fb4f29-7bd9-468d-a716-13da94ef2718',
      }),
      SEND_EMAIL: bindings.sendEmail({
        allowedDestinationAddresses: ['sfred.mail@gmail.com'],
        allowedSenderAddresses: ['contact@sfrederick.dev'],
      }),
      CONTACT_RATE_LIMITER: bindings.rateLimit({
        namespace: '41001',
        simple: {
          limit: 5,
          period: 60,
        },
      }),
      ANALYTICS_RATE_LIMITER: bindings.rateLimit({
        namespace: '41002',
        simple: {
          limit: 120,
          period: 60,
        },
      }),
      ASSETS: bindings.assets(),
    },
  },
});
