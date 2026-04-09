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
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Developer Portfolio
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
            A collection of software projects showcasing my development work
            across web platforms, automation, and technical tooling.
          </p>
        </div>

        {/* Portfolio Grid */}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-bg-surface/50 rounded-xl border border-border/50 p-6 animate-pulse"
        >
          <div className="h-6 bg-border/50 rounded w-3/4 mb-4" />
          <div className="h-4 bg-border/50 rounded w-full mb-2" />
          <div className="h-4 bg-border/50 rounded w-full mb-2" />
          <div className="h-4 bg-border/50 rounded w-2/3 mb-4" />
          <div className="flex gap-2 mb-4">
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
      ))}
    </div>
  );
}
