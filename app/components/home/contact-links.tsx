import { Mail, Phone, Globe, Github, MapPin } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface ContactLinksProps {
  className?: string;
}

interface ContactLinkItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

function ContactLinkItem({ icon, label, value, href }: ContactLinkItemProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/50 border border-border hover:border-accent/50 hover:bg-bg-surface transition-all duration-300 group"
    >
      <span className="text-accent group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-text-tertiary uppercase tracking-wider">
          {label}
        </p>
        <p className="font-body text-sm text-text-primary truncate">{value}</p>
      </div>
    </a>
  );
}

export function ContactLinks({ className }: ContactLinksProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="font-display text-lg text-text-secondary mb-4 text-center">
        Contact
      </h2>

      {/* Email */}
      {contactData.emails.map((email) => (
        <ContactLinkItem
          key={email.address}
          icon={<Mail className="w-4 h-4" />}
          label={email.label}
          value={email.address}
          href={`mailto:${email.address}`}
        />
      ))}

      {/* Phone */}
      <ContactLinkItem
        icon={<Phone className="w-4 h-4" />}
        label={contactData.phone.label}
        value={contactData.phone.number}
        href={`tel:${contactData.phone.number.replace(/\s/g, "")}`}
      />

      {/* Websites */}
      {contactData.websites.map((site) => (
        <ContactLinkItem
          key={site.url}
          icon={<Globe className="w-4 h-4" />}
          label={site.label}
          value={site.url.replace("https://", "")}
          href={site.url}
        />
      ))}

      {/* GitHub */}
      <ContactLinkItem
        icon={<Github className="w-4 h-4" />}
        label="GitHub"
        value={contactData.github.replace("https://", "")}
        href={contactData.github}
      />

      {/* Location */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/50 border border-border">
        <span className="text-accent">
          <MapPin className="w-4 h-4" />
        </span>
        <div>
          <p className="font-body text-xs text-text-tertiary uppercase tracking-wider">
            Location
          </p>
          <p className="font-body text-sm text-text-primary">
            {contactData.location}
          </p>
        </div>
      </div>
    </div>
  );
}
