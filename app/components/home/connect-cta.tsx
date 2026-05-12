import { ArrowRight, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface ConnectCTAProps {
  className?: string;
}

export function ConnectCTA({ className }: ConnectCTAProps) {
  const personalEmail = contactData.emails.find(
    (email) => email.label.toLowerCase() === "personal"
  );

  return (
    <section className={cn("py-24 md:py-32 border-t border-border/50", className)}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-sm text-accent uppercase tracking-wider block mb-4">
            Contact
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
            Let&apos;s build something together
          </h2>
          <p className="font-body text-lg text-text-secondary mb-10 max-w-xl">
            Whether you want to discuss engineering automation, collaborate on a
            project, or just connect, I&apos;m always open to interesting conversations.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg-primary font-body text-sm font-medium hover:bg-accent-muted transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>Get in touch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {personalEmail && (
              <a
                href={`mailto:${personalEmail.address}`}
                className="font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
              >
                {personalEmail.address}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
