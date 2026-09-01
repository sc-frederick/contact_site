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
    <div className="min-h-screen">
      <div className="mp-shell">
        <header className="mb-12 max-w-3xl">
          <p className="mp-eyebrow mp-eyebrow--marker">Contact</p>
          <h1 className="mp-display mb-4">Let&apos;s make something <span className="mp-italic">useful.</span></h1>
          <p className="mp-body mp-body--lg max-w-2xl">
            Have a project in mind or want to collaborate? Send me a message or reach out directly.
          </p>
        </header>

        <ContactForm siteKey={turnstileSiteKey} />
      </div>
    </div>
  );
}
