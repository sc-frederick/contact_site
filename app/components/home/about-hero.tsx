import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";
import profilePhoto from "../../../docs/ProfilePhoto.webp";

interface AboutHeroProps {
  className?: string;
}

export function AboutHero({ className }: AboutHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[calc(100vh-72px)] flex items-center",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Name */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[0.95] tracking-tight mb-6">
              Stephen
              <br />
              <span className="text-accent">Frederick</span>
            </h1>

            {/* Role */}
            <p className="font-mono text-sm md:text-base text-accent tracking-wide mb-8">
              MEP Engineer / IT Manager / Developer
            </p>

            {/* About Statement */}
            <div className="max-w-xl">
              <p className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-4">
                I work at the intersection of engineering operations and software
                development. At{" "}
                <span className="text-text-primary">Advanced Engineering Consultants</span>,
                I design MEP systems, manage IT infrastructure, and build internal
                tools that make complex workflows faster.
              </p>
              <p className="font-body text-base text-text-tertiary leading-relaxed">
                Outside of client work, I develop full-stack applications, explore
                AI-assisted automation, and experiment with new tooling. This site is
                where I share both the engineering and the code behind it.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 mt-10">
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href={`mailto:${contactData.emails.find((e) => e.label.toLowerCase() === "personal")?.address || contactData.emails[0].address}`}
                className="flex items-center gap-2 font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-accent/20 rounded-2xl" />
              <div className="absolute -inset-8 border border-border/50 rounded-3xl" />

              {/* Image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border bg-bg-surface">
                <img
                  src={profilePhoto}
                  alt={`${contactData.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-accent/40 rounded-br-2xl" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="font-body text-xs text-text-tertiary uppercase tracking-widest">
            Scroll
          </span>
          <ArrowDown className="w-4 h-4 text-text-tertiary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
