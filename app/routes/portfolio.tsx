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
        <h1 className="sr-only">Projects</h1>

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
        <p className="type-body text-text-secondary">
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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <PortfolioSkeletonCard key={i} />
      ))}
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
