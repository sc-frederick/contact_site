import { createFileRoute } from "@tanstack/react-router";
import { ContactLinks } from "~/components/home/contact-links";
import { ActionButtons } from "~/components/home/action-buttons";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Collaborate
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-body text-text-secondary max-w-2xl mx-auto">
            Open to collaborating on thoughtful, developer-focused projects.
          </p>
        </div>

        <div className="bg-bg-surface/50 rounded-xl border border-border p-6 md:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl text-text-primary mb-3">
              Open to Collaboration On
            </h2>
            <ul className="font-body text-text-secondary space-y-1.5">
              <li className="flex items-baseline gap-2">
                <span className="text-accent leading-none">•</span>
                <span>Fullstack web application development</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-accent leading-none">•</span>
                <span>Developer tools and internal product tooling</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-accent leading-none">•</span>
                <span>Automation workflows and integrations</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="text-accent leading-none">•</span>
                <span>Website operations, performance, and SEO optimization</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-border/50 mb-6" />

          <ContactLinks className="mb-8" mode="developer" />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
