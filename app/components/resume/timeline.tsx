import { cn } from "~/lib/utils";
import type { Experience } from "~/lib/resume-data";

interface TimelineProps {
  items: Experience[];
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getDuration(startDate: string, endDate: string | null): string {
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

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical line — left offset matches date column width so labels aren’t clipped under overflow-x-hidden */}
      <div className="absolute left-[11.5rem] top-0 bottom-0 w-px bg-border hidden md:block" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex gap-6 md:gap-8">
            {/* Date column - desktop */}
            <div className="hidden md:flex w-[11.5rem] shrink-0 flex-col items-end text-right pt-1 pl-2 pr-4">
              <div className="font-mono text-xs text-text-tertiary whitespace-nowrap">
                {formatDate(item.startDate)}
              </div>
              <div className="font-mono text-xs text-text-tertiary whitespace-nowrap">
                {formatDate(item.endDate)}
              </div>
              <div className="font-mono text-[10px] text-accent mt-1 whitespace-nowrap">
                {getDuration(item.startDate, item.endDate)}
              </div>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-[11.5rem] top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-bg-primary hidden md:block" />

            {/* Content */}
            <div className="flex-1 min-w-0 pb-8 border-b border-border/50 last:border-b-0 last:pb-0">
              {/* Mobile date */}
              <div className="md:hidden mb-2">
                <span className="font-mono text-xs text-text-tertiary">
                  {formatDate(item.startDate)} — {formatDate(item.endDate)}
                </span>
                <span className="font-mono text-[10px] text-accent ml-2">
                  ({getDuration(item.startDate, item.endDate)})
                </span>
              </div>

              <h3 className="font-display text-xl text-text-primary mb-1">
                {item.title}
              </h3>
              <div className="font-body text-accent mb-1">{item.company}</div>
              <div className="font-body text-sm text-text-tertiary mb-3">
                {item.location}
              </div>

              <ul className="space-y-2 mb-4">
                {item.description.map((desc, i) => (
                  <li
                    key={i}
                    className="font-body text-sm text-text-secondary leading-relaxed flex gap-2"
                  >
                    <span className="text-accent mt-1.5">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded bg-bg-elevated text-text-tertiary font-mono text-xs"
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
    </div>
  );
}
