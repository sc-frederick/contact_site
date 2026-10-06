import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { MotionControl } from "~/components/effects/motion-provider";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface px-6 py-8">
      <div className="mx-auto grid max-w-[1240px] items-center gap-6 text-center md:grid-cols-3 md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="mp-meta">&copy; {new Date().getFullYear()} {contactData.name}</p>
          <MotionControl />
        </div>

        <Link
          to="/contact"
          className="mp-btn mp-btn--accent justify-self-center"
        >
          <Mail className="mp-icon" />
          Get in touch
        </Link>

        <div className="flex items-center justify-center gap-4 md:justify-self-end">
          <a
            href={contactData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mp-btn mp-btn--ghost mp-btn--icon"
            aria-label="GitHub"
          >
            <Github className="mp-icon" />
          </a>
          <a
            href={contactData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mp-btn mp-btn--ghost mp-btn--icon"
            aria-label="LinkedIn"
          >
            <Linkedin className="mp-icon" />
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Brooksville%2C+FL"
            target="_blank"
            rel="noopener noreferrer"
            className="mp-meta hover:text-accent"
          >
            Brooksville, FL
          </a>
        </div>
      </div>
    </footer>
  );
}
