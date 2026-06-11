import { useState } from "react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioModal } from "./portfolio-modal";

interface PortfolioGridProps {
  items: PortfolioItem[];
  className?: string;
}

export function PortfolioGrid({ items, className }: PortfolioGridProps) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  if (items.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="font-body text-text-secondary">
          No portfolio items available yet.
        </p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    return a.display_order - b.display_order;
  });
  const featuredItems = sorted.filter((item) => item.featured);
  const standardItems = sorted.filter((item) => !item.featured);

  return (
    <>
      <div
        className={cn(
          "space-y-12",
          className
        )}
      >
        {featuredItems.length > 0 && (
          <section aria-labelledby="featured-projects">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent">
                  Selected Work
                </p>
                <h2
                  id="featured-projects"
                  className="mt-1 font-display text-2xl text-text-primary"
                >
                  Featured Projects
                </h2>
              </div>
              <span className="font-mono text-xs text-text-tertiary">
                {featuredItems.length} projects
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {featuredItems.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onOpen={(selectedItem) => setActiveItem(selectedItem)}
                />
              ))}
            </div>
          </section>
        )}

        {standardItems.length > 0 && (
          <section aria-labelledby="more-projects">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-accent">
                  Project Index
                </p>
                <h2
                  id="more-projects"
                  className="mt-1 font-display text-2xl text-text-primary"
                >
                  More Projects
                </h2>
              </div>
              <span className="font-mono text-xs text-text-tertiary">
                {standardItems.length} projects
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {standardItems.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onOpen={(selectedItem) => setActiveItem(selectedItem)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {activeItem && (
        <PortfolioModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}
