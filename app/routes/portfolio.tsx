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
    <div className="min-h-screen">
      <div className="mp-shell">
        <header className="mp-card mp-card--ink mp-on-ink portfolio-header mb-8">
          <div>
            <p className="mp-eyebrow">Selected work</p>
            <h1 className="mp-display mp-on-ink">Developer <span className="mp-italic">portfolio.</span></h1>
          </div>
          <p className="mp-body max-w-md">Practical software, internal tools, and experiments built to solve real workflow problems.</p>
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
      <div className="mp-card text-center">
        <p className="mp-body">
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
    <div className="mp-grid">
      {[...Array(9)].map((_, i) => (
        <PortfolioSkeletonCard key={i} />
      ))}
    </div>
  );
}

function PortfolioSkeletonCard() {
  return (
    <div className="mp-card mp-span-4 animate-pulse">
      <div className="mp-skeleton mb-4 h-7 w-3/4 rounded" />
      <div className="mp-skeleton mb-2 h-4 w-full rounded" />
      <div className="mp-skeleton mb-2 h-4 w-full rounded" />
      <div className="mp-skeleton mb-4 h-4 w-2/3 rounded" />
      <div className="flex gap-2 mb-5">
        <div className="mp-skeleton h-6 w-16 rounded-full" />
        <div className="mp-skeleton h-6 w-20 rounded-full" />
        <div className="mp-skeleton h-6 w-14 rounded-full" />
      </div>
      <div className="mb-4 h-px bg-border" />
      <div className="flex gap-4">
        <div className="mp-skeleton h-4 w-20 rounded" />
        <div className="mp-skeleton h-4 w-20 rounded" />
      </div>
    </div>
  );
}
