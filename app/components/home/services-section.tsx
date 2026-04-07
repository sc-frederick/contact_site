import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface ServicesSectionProps {
  className?: string;
}

export function ServicesSection({ className }: ServicesSectionProps) {
  return (
    <div className={cn("", className)}>
      <h2 className="font-display text-lg text-text-secondary mb-4 text-center">
        Services
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {contactData.services.map((service) => (
          <span
            key={service}
            className="px-3 py-1.5 rounded-full bg-bg-surface border border-border text-text-secondary font-body text-xs md:text-sm hover:border-accent/50 hover:text-accent transition-colors duration-300"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
