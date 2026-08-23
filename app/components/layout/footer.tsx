import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { contactData } from "~/lib/contact-data";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto grid max-w-7xl items-center gap-6 text-center md:grid-cols-3 md:text-left">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} {contactData.name}
        </p>

        <Link
          to="/contact"
          className="inline-flex items-center justify-self-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-body text-sm font-medium text-bg-primary transition-colors duration-300 hover:bg-accent-muted"
        >
          <Mail className="h-4 w-4" />
          Get in touch
        </Link>

        <div className="flex items-center justify-center gap-4 md:justify-self-end">
          <a
            href={contactData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-accent transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={contactData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-accent transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <span className="text-border">|</span>
          <a
            href="https://maps.app.goo.gl/8BNGpYQypndip3L39"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
          >
            Tampa, FL
          </a>
        </div>
      </div>
    </footer>
  );
}
