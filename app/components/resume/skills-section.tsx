import { cn } from "~/lib/utils";
import type { SkillCategory } from "~/lib/resume-data";

interface SkillsSectionProps {
  categories: SkillCategory[];
  className?: string;
}

export function SkillsSection({ categories, className }: SkillsSectionProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {categories.map((category) => (
        <div key={category.name}>
          <h3 className="font-display text-lg text-text-primary mb-4">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-bg-surface border border-border text-text-secondary font-body text-sm hover:border-accent/50 hover:text-accent transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
