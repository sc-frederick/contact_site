import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { getFeaturedPortfolioItems } from "~/lib/server/portfolio";
import { AboutHero } from "~/components/home/about-hero";
import { FeaturedPortfolio } from "~/components/home/featured-portfolio";
import { SkillsShowcase } from "~/components/home/skills-showcase";
import { ConnectCTA } from "~/components/home/connect-cta";
import type { PortfolioItem } from "~/types";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const response = await getFeaturedPortfolioItems();
    return response;
  },
});

function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero / About Section */}
      <AboutHero />

      {/* Featured Portfolio Projects */}
      <Suspense fallback={<PortfolioSectionLoading />}>
        <FeaturedPortfolioContent />
      </Suspense>

      {/* Skills Showcase */}
      <SkillsShowcase />

      {/* Connect CTA */}
      <ConnectCTA />
    </div>
  );
}

function FeaturedPortfolioContent() {
  const loaderData = Route.useLoaderData();

  if (!loaderData.success) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-text-secondary">
            Failed to load portfolio items. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const items: PortfolioItem[] = loaderData.data || [];

  if (items.length === 0) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-text-secondary">
            No featured projects available yet.
          </p>
        </div>
      </section>
    );
  }

  return <FeaturedPortfolio items={items} />;
}

function PortfolioSectionLoading() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="h-5 bg-bg-surface rounded w-32 mb-4 animate-pulse" />
          <div className="h-12 md:h-16 bg-bg-surface rounded w-3/4 mb-6 animate-pulse" />
          <div className="h-6 bg-bg-surface rounded w-1/2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
