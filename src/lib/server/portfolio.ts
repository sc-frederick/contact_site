import { Effect } from 'effect';
import { portfolioItems } from './portfolio-data';

/** Load the same repository-backed portfolio list used by the previous UI. */
export const getPortfolioItems = Effect.fn('getPortfolioItems')(() =>
  Effect.succeed(
    [...portfolioItems].sort((a, b) => a.display_order - b.display_order),
  ),
);
