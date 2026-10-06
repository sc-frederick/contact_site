import { Effect } from 'effect';
import { getPortfolioItems } from '#lib/server/portfolio.ts';
import type { PageServerLoad } from './$types';

/** Render portfolio content on the server without a contact database dependency. */
export const load: PageServerLoad = async () => ({
  items: await Effect.runPromise(getPortfolioItems()),
});
