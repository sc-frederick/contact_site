import { cn } from "~/lib/utils";
import type { Experience } from "~/lib/resume-data";
import { useEffect, useRef } from "react";
import { useMotionPreferences } from "~/components/effects/motion-provider";

interface TimelineProps {
  items: Experience[];
  className?: string;
}

// A bare four-digit year ("2026") means the month is not stated.
function isYearOnly(dateStr: string | null): boolean {
  return Boolean(dateStr && /^\d{4}$/.test(dateStr));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  if (isYearOnly(dateStr)) return dateStr;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getDuration(startDate: string, endDate: string | null): string {
  if (isYearOnly(startDate) || isYearOnly(endDate)) return "";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  const totalMonths = years * 12 + months;
  const displayYears = Math.floor(totalMonths / 12);
  const displayMonths = totalMonths % 12;

  if (displayYears === 0) {
    return `${displayMonths} mo${displayMonths !== 1 ? "s" : ""}`;
  } else if (displayMonths === 0) {
    return `${displayYears} yr${displayYears !== 1 ? "s" : ""}`;
  } else {
    return `${displayYears} yr${displayYears !== 1 ? "s" : ""} ${displayMonths} mo${displayMonths !== 1 ? "s" : ""}`;
  }
}

/** Show work history with a scroll-following marker in the date gutter. */
export function Timeline({ items, className }: TimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const { motionAllowed } = useMotionPreferences();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const entries = Array.from(root.querySelectorAll<HTMLElement>(".timeline-entry"));
    let frame = 0;
    function update() {
      frame = 0;
      const target = window.innerHeight * 0.38;
      const positions = entries.map((entry) => ({ entry, bounds: entry.getBoundingClientRect() }));
      const covering = positions.find(({ bounds }) => bounds.top <= target && bounds.bottom >= target);
      const closest = positions.reduce<(typeof positions)[number] | undefined>((nearest, position) => {
        return !nearest || Math.abs(position.bounds.top - target) < Math.abs(nearest.bounds.top - target) ? position : nearest;
      }, undefined);
      const active = (covering ?? closest)?.entry;
      for (const entry of entries) entry.dataset.active = String(entry === active);
      const node = active?.querySelector<HTMLElement>(".timeline-node");
      const tracker = trackerRef.current;
      if (node && tracker && root) {
        const bounds = root.getBoundingClientRect();
        const marker = node.getBoundingClientRect();
        tracker.style.setProperty("--timeline-x", `${marker.left - bounds.left + marker.width / 2 - 2}px`);
        tracker.style.setProperty("--timeline-y", `${marker.top - bounds.top - 12}px`);
        if (!tracker.dataset.positioned) {
          // Commit the first position without sweeping across the date column.
          tracker.getBoundingClientRect();
          tracker.dataset.positioned = "true";
        }
      }
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(update); }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <div ref={rootRef} className={cn("timeline", className)} data-motion={motionAllowed}>
      <div ref={trackerRef} className="timeline-tracker" aria-hidden="true" />
      {items.map((item) => (
        <div
          key={item.id}
          className="timeline-entry grid grid-cols-1 md:grid-cols-[auto_1rem_1fr] md:gap-x-4"
        >
          {/* Date column - desktop */}
          <div className="hidden md:flex flex-col items-end text-right pt-1">
            <div className="mp-meta whitespace-nowrap tabular-nums">
              {formatDate(item.startDate)}
            </div>
            <div className="mp-meta whitespace-nowrap tabular-nums">
              {formatDate(item.endDate)}
            </div>
            {getDuration(item.startDate, item.endDate) && (
              <div className="mp-meta mt-1 whitespace-nowrap text-accent tabular-nums">
                {getDuration(item.startDate, item.endDate)}
              </div>
            )}
          </div>

          {/* Timeline indicator - desktop */}
          <div className="hidden md:flex flex-col items-center">
            <div className="timeline-node mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent ring-2 ring-[var(--color-paper)]" />
            <div className="w-px flex-1 bg-border" />
          </div>

          {/* Content */}
          <div className="min-w-0 border-b border-border pb-8 last:border-b-0 last:pb-0">
            {/* Mobile date */}
            <div className="md:hidden mb-2">
              <span className="mp-meta tabular-nums">
                {formatDate(item.startDate)} — {formatDate(item.endDate)}
              </span>
              {getDuration(item.startDate, item.endDate) && (
                <span className="mp-meta ml-2 text-accent tabular-nums">
                  ({getDuration(item.startDate, item.endDate)})
                </span>
              )}
            </div>

            <h3 className="mp-title mb-1">
              {item.title}
            </h3>
            <div className={cn("mp-body text-accent", item.location ? "mb-1" : "mb-3")}>
              {item.company}
            </div>
            {item.location && (
              <div className="mp-meta mb-3">{item.location}</div>
            )}

            <ul className="experience-list">
              {item.description.map((desc, i) => (
                <li key={i} className="mp-body">
                  {desc}
                </li>
              ))}
            </ul>

            {item.technologies && item.technologies.length > 0 && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
