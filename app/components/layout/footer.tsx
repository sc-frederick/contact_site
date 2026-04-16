import { Github, Linkedin } from "lucide-react";
import { contactData } from "~/lib/contact-data";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} {contactData.name}
        </p>

        <div className="flex items-center gap-4">
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
