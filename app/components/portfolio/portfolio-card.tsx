import { ExternalLink, Github } from "lucide-react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { ProjectArtwork } from "~/components/effects/print-artwork";
import type { ProjectPattern } from "~/components/effects/effect-types";

const projectPatterns: Readonly<Record<number, ProjectPattern>> = {
  1: "network", 2: "flow", 3: "orbits", 4: "scan", 5: "network", 6: "wave",
  7: "scan", 8: "orbits", 9: "grid", 10: "grid", 11: "wave",
};

interface PortfolioCardProps {
  item: PortfolioItem;
  onOpen?: (item: PortfolioItem) => void;
  className?: string;
}

/** Display a project with a procedural illustration that responds to hover and keyboard focus. */
export function PortfolioCard({ item, onOpen, className }: PortfolioCardProps) {
  const hasLinks = Boolean(item.project_url || item.github_url);
  const onInk = Boolean(item.highlighted);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <article
      className={cn(
        "mp-card mp-span-4 project-card",
        onInk && "mp-card--ink mp-on-ink",
        className
      )}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <ProjectArtwork pattern={projectPatterns[item.id] ?? "grid"} seed={item.id} active={hovered || focused} />
      <h3 className="mp-title mb-1">
        <button
          type="button"
          onClick={() => onOpen?.(item)}
          className={cn(
            "text-left",
            onInk ? "text-[var(--text-inverted)] hover:text-[var(--color-green)]" : "hover:text-accent",
          )}
        >
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
        <div
          className={cn(
            "mp-card__footer border-t pt-4",
            onInk ? "border-white/15" : "border-border",
          )}
        >
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mp-btn mp-btn--sm",
                onInk ? "mp-btn--secondary" : "mp-btn--ghost"
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
                "mp-btn mp-btn--sm",
                onInk ? "mp-btn--secondary" : "mp-btn--ghost"
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
