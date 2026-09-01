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
    <article
      className={cn(
        "mp-card mp-span-4",
        className
      )}
    >
      <h3 className="mp-title mb-1">
        <button type="button" onClick={() => onOpen?.(item)} className="text-left hover:text-accent">
          {item.title}
        </button>
      </h3>

      {/* Description */}
      <p className="mp-body mb-2 line-clamp-3">
        {item.description}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {item.technologies.map((tech) => (
          <span
            key={tech}
            className={cn(
              "mp-chip"
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {hasLinks && (
        <div className="mp-card__footer border-t border-border pt-4">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mp-btn mp-btn--ghost mp-btn--sm"
              )}
            >
              <ExternalLink className="mp-icon mp-icon--sm" />
              <span>Live Demo</span>
            </a>
          )}

          {item.github_url && (
            <a
              href={item.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mp-btn mp-btn--ghost mp-btn--sm"
              )}
            >
              <Github className="mp-icon mp-icon--sm" />
              <span>Source</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
