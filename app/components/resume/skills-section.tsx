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
          <h3 className="mp-title mb-4">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="mp-chip"
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
