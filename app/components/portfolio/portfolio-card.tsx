import { ExternalLink, Github } from "lucide-react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

export function PortfolioCard({ item, className }: PortfolioCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6",
        "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        "transition-all duration-300 ease-out"
      )}
    >
      {/* Decorative accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent group-hover:via-accent group-hover:w-24 transition-all duration-300" />

      {/* Title */}
      <h3 className="font-display text-xl text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
        {item.title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
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
