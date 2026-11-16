import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import cloudflareConfig from '../../cloudflare.config.ts';

/**
 * Bindings the Worker reads at runtime. Workers Builds deploys from
 * cloudflare.config.ts and Alchemy deploys from alchemy.run.ts, so both must
 * declare every one of these; a missing binding ships a broken contact form.
 */
const runtimeBindings = [
  'CONTACT_FROM_EMAIL',
  'CONTACT_FROM_NAME',
  'CONTACT_RATE_LIMITER',
  'CONTACT_TO_EMAIL',
  'DB',
  'SEND_EMAIL',
  'TURNSTILE_SECRET_KEY',
  'TURNSTILE_SITE_KEY',
];

/** Reads the keys of the Worker's `env: { ... }` block in alchemy.run.ts. */
async function alchemyBindingNames(): Promise<string[]> {
  const source = await readFile(
    new URL('../../alchemy.run.ts', import.meta.url),
    'utf8',
  );

  const start = source.indexOf('env: {');
  const block = source.slice(start, source.indexOf('\n      },\n', start));

  return [...block.matchAll(/^ {8}([A-Z][A-Z0-9_]*):/gm)].flatMap((match) =>
    match[1] ? [match[1]] : [],
  );
}

describe('deploy configuration', () => {
  it('declares every runtime binding for Workers Builds', () => {
    const declared = Object.keys(cloudflareConfig.worker.env);

    expect(declared).toEqual(expect.arrayContaining(runtimeBindings));
  });

  it('declares the same app bindings for Alchemy', async () => {
    const declared = await alchemyBindingNames();

    const cliDeclared = Object.keys(cloudflareConfig.worker.env).filter(
      (name) => name !== 'ASSETS',
    );

    expect(declared.toSorted()).toEqual(cliDeclared.toSorted());
    expect(declared).toEqual(expect.arrayContaining(runtimeBindings));
  });
});
