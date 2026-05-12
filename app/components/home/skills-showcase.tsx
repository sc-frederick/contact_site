import { resumeData } from "~/lib/resume-data";
import { cn } from "~/lib/utils";

interface SkillsShowcaseProps {
  className?: string;
}

export function SkillsShowcase({ className }: SkillsShowcaseProps) {
  // Pick key categories from resume data
  const categories = resumeData.skills;

  return (
    <section className={cn("py-24 md:py-32 border-t border-border/50", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-sm text-accent uppercase tracking-wider block mb-4">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-6">
            Tools & Technologies
          </h2>
          <p className="font-body text-lg text-text-secondary">
            The stack I use to bridge engineering workflows and modern software.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="font-mono text-sm text-accent uppercase tracking-wider mb-6">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-body",
                      "bg-bg-surface border border-border/50 text-text-secondary",
                      "hover:border-accent/30 hover:text-text-primary",
                      "transition-colors duration-300"
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
