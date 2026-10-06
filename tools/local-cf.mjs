import { CliExit, main } from 'cf';

// cf beta.12 leaves its local Miniflare session running after main resolves.
// Exit only after the command finishes and both output streams have flushed.
const status = await main().then(
  () => 0,
  (error) => (error instanceof CliExit ? error.code : 1),
);

await Promise.all([
  new Promise((done) => process.stdout.write('', done)),
  new Promise((done) => process.stderr.write('', done)),
]);

process.exit(status);
