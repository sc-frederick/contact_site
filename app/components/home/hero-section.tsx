import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const initials = contactData.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full bg-bg-surface border-2 border-accent flex items-center justify-center">
          <span className="font-display text-4xl text-accent">{initials}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <span className="text-bg-primary text-lg">✓</span>
        </div>
      </div>

      {/* Name */}
      <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-2">
        {contactData.name}
      </h1>

      {/* Title */}
      <p className="font-body text-lg md:text-xl text-accent mb-1">
        {contactData.title}
      </p>

      {/* Company */}
      <p className="font-body text-sm md:text-base text-text-secondary">
        {contactData.company}
      </p>

      {/* Location */}
      <p className="font-body text-sm text-text-tertiary mt-2">
        {contactData.location}
      </p>
    </div>
  );
}
