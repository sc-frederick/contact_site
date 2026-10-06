import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { Effect, Schema } from 'effect';
import cloudflareConfig from '../cloudflare.config.ts';

class LocalSeedFailed extends Schema.TaggedError<LocalSeedFailed>()(
  'LocalSeedFailed',
  {
    message: Schema.String,
  },
) {}

const seed = Effect.gen(function* () {
  const databaseId = cloudflareConfig.worker.env.DB.id;

  if (!databaseId) {
    return yield* new LocalSeedFailed({
      message: 'The local D1 database ID is missing.',
    });
  }

  const sql = yield* Effect.tryPromise({
    try: () => readFile(new URL('../db/seed.sql', import.meta.url), 'utf8'),
    catch: () =>
      new LocalSeedFailed({ message: 'Could not read the local seed SQL.' }),
  });

  const result = spawnSync(
    process.execPath,
    [
      new URL('./local-cf.mjs', import.meta.url).pathname,
      'd1',
      'raw',
      databaseId,
      '--local',
      '--persist-to',
      '.cloudflare/state',
      `--sql=${sql}`,
    ],
    { stdio: 'inherit' },
  );

  if (result.error || result.status !== 0) {
    return yield* new LocalSeedFailed({
      message: 'cf could not seed the local database.',
    });
  }
});

await Effect.runPromise(
  seed.pipe(
    Effect.catch((error) =>
      Effect.sync(() => {
        console.error(error.message);
        process.exitCode = 1;
      }),
    ),
  ),
);
