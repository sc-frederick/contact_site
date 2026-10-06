import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { Effect } from 'effect';
import { prepareCloudflareAdapter } from './tools/cloudflare-adapter.ts';

export default defineConfig(async () => ({
  server: { port: 3000 },
  optimizeDeps: { include: ['shaders/std'] },
  plugins: [
    tailwindcss(),
    sveltekit({ adapter: await Effect.runPromise(prepareCloudflareAdapter()) }),
  ],
}));
