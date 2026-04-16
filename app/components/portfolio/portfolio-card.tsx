import { ExternalLink, Github, Star } from "lucide-react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";

interface PortfolioCardProps {
  item: PortfolioItem;
  onOpen?: (item: PortfolioItem) => void;
  className?: string;
}

export function PortfolioCard({ item, onOpen, className }: PortfolioCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.(item);
        }
      }}
      className={cn(
        "group relative bg-bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 cursor-pointer",
        "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        "transition-all duration-300 ease-out",
        item.featured && "md:col-span-2 lg:col-span-2 border-accent/20",
        className
      )}
    >
      {/* Decorative accent line at top */}
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent group-hover:via-accent transition-all duration-300",
          item.featured
            ? "w-24 group-hover:w-32 via-accent"
            : "w-16 group-hover:w-24"
        )}
      />

      {/* Featured badge */}
      {item.featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="font-body text-xs text-accent uppercase tracking-wider">
            Featured Project
          </span>
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          "font-display text-text-primary mb-3 group-hover:text-accent transition-colors duration-300",
          item.featured ? "text-2xl" : "text-xl"
        )}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "font-body text-sm text-text-secondary mb-4",
          item.featured ? "line-clamp-4" : "line-clamp-3"
        )}
      >
        {item.description}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {item.technologies.map((tech) => (
          <span
            key={tech}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-body",
              "bg-bg-primary border border-border/50 text-text-tertiary",
              "group-hover:border-accent/30 group-hover:text-text-secondary",
              "transition-colors duration-300"
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        {item.project_url && (
          <a
            href={item.project_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "flex items-center gap-1.5 text-sm font-body",
              "text-text-secondary hover:text-accent",
              "transition-colors duration-300"
            )}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Live Demo</span>
          </a>
        )}

        {item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "flex items-center gap-1.5 text-sm font-body",
              "text-text-secondary hover:text-accent",
              "transition-colors duration-300"
            )}
          >
            <Github className="w-4 h-4" />
            <span>Source</span>
          </a>
        )}
      </div>
    </div>
  );
}
