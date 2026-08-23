import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "~/components/contact/contact-form";
import { getTurnstileSiteKey } from "~/lib/server/contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
  loader: () => getTurnstileSiteKey(),
});

function Contact() {
  const turnstileSiteKey = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="type-page-title text-text-primary mb-4">
            Get in Touch
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="type-lead text-text-secondary max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Send me a message or reach out directly.
          </p>
        </div>

        {/* Contact Form (two-column: info left, form right) */}
        <ContactForm siteKey={turnstileSiteKey} />
      </div>
    </div>
  );
}
