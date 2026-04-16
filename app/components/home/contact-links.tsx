import { Mail, Phone, Globe, Github, MapPin } from "lucide-react";
import { contactData } from "~/lib/contact-data";
import { cn } from "~/lib/utils";

interface ContactLinksProps {
  className?: string;
  mode?: "full" | "developer";
}

interface ContactLinkItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactLinkItem({ icon, label, value, href, external }: ContactLinkItemProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/50 border border-border hover:border-accent/50 hover:bg-bg-surface transition-all duration-300 group"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="text-accent group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-text-tertiary uppercase tracking-wider">
          {label}
        </p>
        <p className="font-body text-sm text-text-primary truncate">
          {value}
          {external && <span className="sr-only"> (opens in new tab)</span>}
        </p>
      </div>
    </a>
  );
}

export function ContactLinks({ className, mode = "full" }: ContactLinksProps) {
  const personalEmail = contactData.emails.find(
    (email) => email.label.toLowerCase() === "personal"
  );
  const portfolioSite = contactData.websites.find(
    (site) => site.label.toLowerCase() === "portfolio"
  );

  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="font-display text-lg text-text-secondary mb-4 text-center">
        Contact
      </h2>

      {mode === "developer" ? (
        <>
          {/* Personal Email */}
          {personalEmail && (
            <ContactLinkItem
              icon={<Mail className="w-4 h-4" />}
              label={personalEmail.label}
              value={personalEmail.address}
              href={`mailto:${personalEmail.address}`}
            />
          )}

          {/* Portfolio */}
          {portfolioSite && (
            <ContactLinkItem
              icon={<Globe className="w-4 h-4" />}
              label={portfolioSite.label}
              value={portfolioSite.url.replace("https://", "")}
              href={portfolioSite.url}
              external
            />
          )}

          {/* GitHub */}
          <ContactLinkItem
            icon={<Github className="w-4 h-4" />}
            label="GitHub"
            value={contactData.github.replace("https://", "")}
            href={contactData.github}
            external
          />
        </>
      ) : (
        <>
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
              external
            />
          ))}

          {/* GitHub */}
          <ContactLinkItem
            icon={<Github className="w-4 h-4" />}
            label="GitHub"
            value={contactData.github.replace("https://", "")}
            href={contactData.github}
            external
          />

          {/* Location */}
          <a
            href="https://maps.app.goo.gl/8BNGpYQypndip3L39"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/50 border border-border hover:border-accent/50 hover:bg-bg-surface transition-all duration-300 group"
          >
            <span className="text-accent group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="font-body text-xs text-text-tertiary uppercase tracking-wider">
                Location
              </p>
              <p className="font-body text-sm text-text-primary">
                {contactData.location}
                <span className="sr-only"> (opens in new tab)</span>
              </p>
            </div>
          </a>
        </>
      )}
    </div>
  );
}
