import { defineWranglerConfig } from 'wrangler/experimental-config';

/** Native SvelteKit assets consumed by cf's installed bundler. */
export const assetsDirectory = './.svelte-kit/cloudflare';

export default defineWranglerConfig({
  types: {
    generate: false,
  },
  assetsDirectory,
});
