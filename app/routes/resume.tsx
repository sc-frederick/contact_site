import { createFileRoute } from "@tanstack/react-router";
import { resumeData } from "~/lib/resume-data";
import { Timeline } from "~/components/resume/timeline";
import { SkillsSection } from "~/components/resume/skills-section";

export const Route = createFileRoute("/resume")({
  component: Resume,
});

function Resume() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Resume
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-display text-lg text-accent">{resumeData.name}</p>
          <p className="font-body text-text-secondary">
            {resumeData.title}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-bg-surface/50 rounded-xl border border-border p-6 md:p-8 mb-12">
          <h2 className="font-display text-xl text-text-primary mb-4">
            Professional Summary
          </h2>
          <p className="font-body text-text-secondary leading-relaxed">
            {resumeData.summary}
          </p>
        </div>

        {/* Experience Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl text-text-primary">
              Experience
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
          </div>
          <Timeline items={resumeData.experience} />
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl text-text-primary">
              Education
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
          </div>

          <div className="space-y-6">
            {resumeData.education.map((edu) => (
              <div
                key={edu.id}
                className="bg-bg-surface/50 rounded-xl border border-border p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl text-text-primary mb-1">
                      {edu.institution}
                    </h3>
                    <div className="font-body text-accent">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="font-body text-sm text-text-tertiary">
                      {edu.location}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-text-tertiary md:text-right">
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl text-text-primary">
              Skills
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
          </div>
          <div className="bg-bg-surface/50 rounded-xl border border-border p-6 md:p-8">
            <SkillsSection categories={resumeData.skills} />
          </div>
        </section>
      </div>
    </div>
  );
}
