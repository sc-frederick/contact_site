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
    <div className={cn("space-y-8", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-1 md:grid-cols-[auto_1rem_1fr] md:gap-x-4"
        >
          {/* Date column - desktop */}
          <div className="hidden md:flex flex-col items-end text-right pt-1">
            <div className="mp-meta whitespace-nowrap tabular-nums">
              {formatDate(item.startDate)}
            </div>
            <div className="mp-meta whitespace-nowrap tabular-nums">
              {formatDate(item.endDate)}
            </div>
            <div className="mp-meta mt-1 whitespace-nowrap text-accent tabular-nums">
              {getDuration(item.startDate, item.endDate)}
            </div>
          </div>

          {/* Timeline indicator - desktop */}
          <div className="hidden md:flex flex-col items-center">
            <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent ring-2 ring-[var(--color-paper)]" />
            <div className="w-px flex-1 bg-border" />
          </div>

          {/* Content */}
          <div className="min-w-0 border-b border-border pb-8 last:border-b-0 last:pb-0">
            {/* Mobile date */}
            <div className="md:hidden mb-2">
              <span className="mp-meta tabular-nums">
                {formatDate(item.startDate)} — {formatDate(item.endDate)}
              </span>
              <span className="mp-meta ml-2 text-accent tabular-nums">
                ({getDuration(item.startDate, item.endDate)})
              </span>
            </div>

            <h3 className="mp-title mb-1">
              {item.title}
            </h3>
            <div className="mp-body mb-1 text-accent">{item.company}</div>
            <div className="mp-meta mb-3">
              {item.location}
            </div>

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
