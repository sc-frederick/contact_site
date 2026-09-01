import { createFileRoute } from "@tanstack/react-router";
import { resumeData } from "~/lib/resume-data";
import { Timeline } from "~/components/resume/timeline";
import { SkillsSection } from "~/components/resume/skills-section";

export const Route = createFileRoute("/resume")({
  component: Resume,
});

function Resume() {
  return (
    <div className="min-h-screen">
      <div className="mp-shell max-w-5xl">
        <header className="mp-grid--mosaic mb-12">
          <div className="mp-card mp-card--ink mp-on-ink mp-span-7 justify-between">
            <p className="mp-eyebrow">Resume</p>
            <h1 className="mp-display mp-on-ink">Stephen <span className="mp-italic">Frederick</span></h1>
          </div>
          <div className="mp-card mp-card--accent mp-on-violet mp-span-5 justify-end">
            <p className="mp-title text-[var(--color-on-violet)]">{resumeData.name}</p>
            <p className="mp-body">
            {resumeData.title}
            </p>
          </div>
        </header>

        {/* Summary */}
        <div className="mp-card mb-12">
          <p className="mp-eyebrow">Profile</p>
          <h2 className="mp-title mb-2">
            Professional Summary
          </h2>
          <p className="mp-body mp-body--lg max-w-3xl">
            {resumeData.summary}
          </p>
        </div>

        {/* Experience Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="mp-headline">
              Experience
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Timeline items={resumeData.experience} />
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="mp-headline">
              Education
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-6">
            {resumeData.education.map((edu) => (
              <div
                key={edu.id}
                className="mp-card mp-card--compact"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <h3 className="mp-title mb-1">
                      {edu.institution}
                    </h3>
                    <div className="mp-body text-accent">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="mp-meta">
                      {edu.location}
                    </div>
                  </div>
                  <div className="mp-meta tabular-nums md:text-right">
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
            <h2 className="mp-headline">
              Skills
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mp-card">
            <SkillsSection categories={resumeData.skills} />
          </div>
        </section>
      </div>
    </div>
  );
}
