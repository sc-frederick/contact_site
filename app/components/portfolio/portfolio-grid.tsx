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

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {items.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onOpen={(selectedItem) => setActiveItem(selectedItem)}
          />
        ))}
      </div>

      {activeItem && (
        <PortfolioModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}
