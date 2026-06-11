import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { getPortfolioItems } from "~/lib/server/portfolio";
import type { PortfolioItem } from "~/types";
import { PortfolioGrid } from "~/components/portfolio/portfolio-grid";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  loader: async () => {
    const response = await getPortfolioItems();
    return response;
  },
});

function Portfolio() {
  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-border/70 pb-8">
          <p className="font-mono text-sm uppercase tracking-wider text-accent">
            Software Work
          </p>
          <div className="mt-4 max-w-3xl">
            <h1 className="font-display text-4xl text-text-primary md:text-5xl">
              Developer Portfolio
            </h1>
            <p className="mt-4 font-body text-base leading-7 text-text-secondary md:text-lg">
              A focused index of web platforms, automation systems, AI tools,
              and engineering workflow software.
            </p>
          </div>
        </header>

        <Suspense fallback={<PortfolioLoading />}>
          <PortfolioContent />
        </Suspense>
      </div>
    </div>
  );
}

function PortfolioContent() {
  const loaderData = Route.useLoaderData();
  
  // Check if the response was successful
  if (!loaderData.success) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-text-secondary">
          Failed to load portfolio items. Please try again later.
        </p>
      </div>
    );
  }

  // Extract items from successful response
  const items: PortfolioItem[] = loaderData.data?.items || [];

  return <PortfolioGrid items={items} />;
}

function PortfolioLoading() {
  return (
    <div className="space-y-12">
      <div>
        <div className="mb-5 h-14 border-b border-border/60 pb-3">
          <div className="h-3 w-28 rounded bg-border/50" />
          <div className="mt-3 h-7 w-48 rounded bg-border/50" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <PortfolioSkeletonCard key={i} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-5 h-14 border-b border-border/60 pb-3">
          <div className="h-3 w-28 rounded bg-border/50" />
          <div className="mt-3 h-7 w-40 rounded bg-border/50" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PortfolioSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioSkeletonCard() {
  return (
    <div className="rounded-lg border border-border/50 bg-bg-surface/50 p-5 animate-pulse">
      <div className="h-5 bg-border/50 rounded w-3/4 mb-4" />
      <div className="h-4 bg-border/50 rounded w-full mb-2" />
      <div className="h-4 bg-border/50 rounded w-full mb-2" />
      <div className="h-4 bg-border/50 rounded w-2/3 mb-4" />
      <div className="flex gap-2 mb-5">
        <div className="h-6 bg-border/50 rounded-full w-16" />
        <div className="h-6 bg-border/50 rounded-full w-20" />
        <div className="h-6 bg-border/50 rounded-full w-14" />
      </div>
      <div className="h-px bg-border/50 mb-4" />
      <div className="flex gap-4">
        <div className="h-4 bg-border/50 rounded w-20" />
        <div className="h-4 bg-border/50 rounded w-20" />
      </div>
    </div>
  );
}
