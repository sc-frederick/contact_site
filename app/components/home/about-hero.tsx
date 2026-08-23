import { Github, Linkedin, Mail } from "lucide-react";
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
        "relative flex flex-1 items-center",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Name */}
            <h1 className="mb-6 whitespace-nowrap font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none tracking-tight text-text-primary">
              Stephen Frederick
            </h1>

            {/* Role */}
            <p className="font-mono text-sm md:text-base text-accent tracking-wide mb-8">
              MEP Engineer / IT Manager / Developer
            </p>

            {/* About Statement */}
            <div className="max-w-xl">
              <p className="font-body text-lg md:text-xl text-text-secondary leading-relaxed mb-4">
                At{" "}
                <span className="text-text-primary">
                  Advanced Engineering Consultants
                </span>, I design MEP systems and manage the company&apos;s IT. I also
                build internal software that cuts down the repetitive work around
                drawings and project delivery.
              </p>
              <p className="font-body text-base text-text-tertiary leading-relaxed">
                Outside work, I build web apps and test practical uses for AI. I
                use this site to share the projects that survive those experiments.
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
                href={`mailto:${contactData.emails[0].address}`}
                className="flex items-center gap-2 font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="h-64 w-64 overflow-hidden rounded-2xl sm:h-80 sm:w-80 md:h-96 md:w-96">
              <img
                src={profilePhoto}
                alt={contactData.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
