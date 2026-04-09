import { useEffect } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import type { PortfolioItem } from "~/types";

interface PortfolioModalProps {
  item: PortfolioItem;
  onClose: () => void;
}

export function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  useEffect(() => {
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} project details`}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-bg-surface p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="font-display text-3xl text-text-primary">{item.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-text-secondary hover:text-accent hover:border-accent/50 transition-colors duration-300"
            aria-label="Close project details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-body text-text-secondary leading-relaxed mb-6">
          {item.description}
        </p>

        <div className="mb-8">
          <h3 className="font-display text-lg text-text-primary mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-body bg-bg-primary border border-border/50 text-text-tertiary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-body text-text-secondary hover:text-accent transition-colors duration-300"
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
              className="inline-flex items-center gap-2 text-sm font-body text-text-secondary hover:text-accent transition-colors duration-300"
            >
              <Github className="w-4 h-4" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
