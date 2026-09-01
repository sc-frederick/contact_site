import { Github, Linkedin, Mail } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";
import profilePhoto from "../../../docs/ProfilePhoto.webp";

interface AboutHeroProps {
  className?: string;
}

export function AboutHero({ className }: AboutHeroProps) {
  return (
    <section className={cn("flex flex-1 items-center", className)}>
      <div className="mp-shell">
        <div className="mp-grid--mosaic">
          <article className="mp-card mp-card--ink mp-on-ink mp-span-7 min-h-[440px] justify-between md:min-h-[520px]">
            <div>
              <p className="mp-eyebrow">MEP Engineer / IT Manager / Developer</p>
              <h1 className="home-hero-name mp-display mp-display--xl mp-on-ink">
                Stephen <span className="mp-italic">Frederick</span>
              </h1>
            </div>
            <div className="home-hero-copy mp-stack">
              <p className="mp-body mp-body--lg">
                At{" "}
                <strong className="mp-on-ink font-medium">
                  Advanced Engineering Consultants
                </strong>, I design MEP systems and manage the company&apos;s IT. I also
                build internal software that cuts down the repetitive work around
                drawings and project delivery.
              </p>
              <p className="mp-body">
                Outside work, I build web apps and test practical uses for AI. I
                use this site to share the projects that survive those experiments.
              </p>
            </div>

            <div className="mp-row mt-8">
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mp-btn mp-btn--secondary mp-btn--sm"
                aria-label="GitHub"
              >
                <Github className="mp-icon" /> GitHub
              </a>
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mp-btn mp-btn--secondary mp-btn--sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="mp-icon" /> LinkedIn
              </a>
              <a
                href={`mailto:${contactData.emails[0].address}`}
                className="mp-btn mp-btn--accent mp-btn--sm"
              >
                <Mail className="mp-icon" /> Email
              </a>
            </div>
          </article>

          <article className="mp-feature-tile mp-span-5 min-h-[520px]">
            <div className="home-hero-photo mp-card__media m-6 mb-0 min-h-0 flex-1 border border-white/20">
              <img
                src={profilePhoto}
                alt={contactData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mp-feature-tile__body">
              <p className="mp-eyebrow mp-on-violet">Tampa, Florida</p>
              <h2 className="mp-feature-tile__title">Engineering systems. Building useful software.</h2>
            </div>
            <div className="mp-feature-tile__gradient" aria-hidden="true" />
          </article>
        </div>
      </div>
    </section>
  );
}
