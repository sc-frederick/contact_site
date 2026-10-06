import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-cloudflare';
import { convertToWranglerConfig, InputConfigSchema } from '@cloudflare/config';
import { runCfWranglerBuild } from 'wrangler';
import { Effect, Schema } from 'effect';
import type { Adapter } from '@sveltejs/kit';
import cloudflareConfig from '../cloudflare.config.ts';
import { assetsDirectory } from '../wrangler.config.ts';

class CloudflareAdapterFailed extends Schema.TaggedError<CloudflareAdapterFailed>()(
  'CloudflareAdapterFailed',
  { message: Schema.String },
) {}

/** Derive SvelteKit's adapter configuration from cf's binding configuration. */
export const prepareCloudflareAdapter = Effect.fn('prepareCloudflareAdapter')(
  function* () {
    const config = yield* Effect.try({
      try: () =>
        convertToWranglerConfig(InputConfigSchema.parse(cloudflareConfig)),
      catch: () =>
        new CloudflareAdapterFailed({
          message: 'Invalid Cloudflare configuration.',
        }),
    });

    const directory = resolve('.cloudflare/adapter');
    const configPath = resolve(directory, 'wrangler.json');

    // The native adapter currently reads Wrangler JSON. This ignored bridge contains
    // binding declarations only; secret values stay in the local environment files.
    yield* Effect.tryPromise({
      try: async () => {
        await mkdir(directory, { recursive: true });
        await writeFile(
          configPath,
          JSON.stringify({
            ...config,
            // Local credentials come only from .dev.vars. cf loads the production
            // .env into its own process; do not forward those secrets to the proxy.
            secrets: undefined,
            main: resolve(cloudflareConfig.worker.entrypoint),
            assets: {
              ...config.assets,
              directory: resolve(assetsDirectory),
            },
          }),
        );
      },
      catch: () =>
        new CloudflareAdapterFailed({
          message: 'Could not write the adapter configuration.',
        }),
    });

    const nativeAdapter = adapter({
      config: configPath,
      platformProxy: {
        // cf adds v3 to --persist-to; the native proxy takes the full path.
        persist: { path: resolve('.cloudflare/state/v3') },
        envFiles: [resolve('.dev.vars')],
        remoteBindings: false,
      },
    });

    // cf's current SvelteKit integration does not emit Build Output itself.
    // Run its installed bundler after Kit finishes writing the Worker and assets.
    const cfAdapter: Adapter = {
      ...nativeAdapter,
      async adapt(builder) {
        await nativeAdapter.adapt(builder);
        await Effect.runPromise(
          Effect.tryPromise({
            try: () => runCfWranglerBuild({}),
            catch: () =>
              new CloudflareAdapterFailed({
                message: 'Cloudflare Worker bundling failed.',
              }),
          }).pipe(
            Effect.flatMap((status) =>
              status === 0
                ? Effect.void
                : Effect.fail(
                    new CloudflareAdapterFailed({
                      message: 'Cloudflare Worker bundling failed.',
                    }),
                  ),
            ),
          ),
        );
      },
    };

    return cfAdapter;
  },
);
