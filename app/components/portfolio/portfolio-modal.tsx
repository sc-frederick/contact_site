import { useEffect, useRef } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import type { PortfolioItem } from "~/types";

interface PortfolioModalProps {
  item: PortfolioItem;
  onClose: () => void;
}

export function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/70 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} project details`}
        onClick={(event) => event.stopPropagation()}
        className="mp-card max-h-[90vh] w-full max-w-3xl overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="mp-headline">{item.title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="mp-btn mp-btn--secondary mp-btn--icon"
            aria-label="Close project details"
          >
            <X className="mp-icon" />
          </button>
        </div>

        <p className="mp-body mb-6">
          {item.description}
        </p>

        <div className="mb-8">
          <h3 className="mp-title mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="mp-chip"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mp-card__footer border-t border-border pt-4">
          {item.project_url && (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mp-btn mp-btn--secondary mp-btn--sm"
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
              className="mp-btn mp-btn--secondary mp-btn--sm"
            >
              <Github className="mp-icon mp-icon--sm" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
