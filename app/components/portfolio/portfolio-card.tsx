import { ExternalLink, Github } from "lucide-react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";

interface PortfolioCardProps {
  item: PortfolioItem;
  onOpen?: (item: PortfolioItem) => void;
  className?: string;
}

export function PortfolioCard({ item, onOpen, className }: PortfolioCardProps) {
  const hasLinks = Boolean(item.project_url || item.github_url);

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
        "group relative flex h-full flex-col bg-bg-surface/80 backdrop-blur-sm rounded-lg border border-border p-5 cursor-pointer",
        "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      {/* Decorative accent line at top */}
      <div
        className="absolute top-0 left-1/2 h-0.5 w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent transition-all duration-300 group-hover:w-24 group-hover:via-accent"
      />

      {/* Title */}
      <h3 className="type-card-title mb-3 text-text-primary transition-colors duration-300 group-hover:text-accent">
        {item.title}
      </h3>

      {/* Description */}
      <p className="type-body mb-4 line-clamp-3 text-text-secondary">
        {item.description}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {item.technologies.map((tech) => (
          <span
            key={tech}
            className={cn(
              "type-meta px-2.5 py-1 rounded-full",
              "bg-bg-primary border border-border/50 text-text-tertiary",
              "group-hover:border-accent/30 group-hover:text-text-secondary",
              "transition-colors duration-300"
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {hasLinks && (
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border/50">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className={cn(
                "type-meta flex items-center gap-1.5",
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
                "type-meta flex items-center gap-1.5",
                "text-text-secondary hover:text-accent",
                "transition-colors duration-300"
              )}
            >
              <Github className="w-4 h-4" />
              <span>Source</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
