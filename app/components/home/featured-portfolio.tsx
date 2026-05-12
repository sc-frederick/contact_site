import { ArrowRight, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";
import { PortfolioCard } from "~/components/portfolio/portfolio-card";
import { PortfolioModal } from "~/components/portfolio/portfolio-modal";
import { useState } from "react";

interface FeaturedPortfolioProps {
  items: PortfolioItem[];
  className?: string;
}

export function FeaturedPortfolio({ items, className }: FeaturedPortfolioProps) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-accent" />
            <span className="font-mono text-sm text-accent uppercase tracking-wider">
              Selected Work
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 max-w-3xl">
            Projects that solve real problems
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-2xl">
            A mix of internal engineering tools, full-stack applications, and
            experiments in automation and AI integration.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onOpen={(selectedItem) => setActiveItem(selectedItem)}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 font-body text-sm text-text-secondary hover:text-accent transition-colors duration-300"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Modal */}
      {activeItem && (
        <PortfolioModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </section>
  );
}
