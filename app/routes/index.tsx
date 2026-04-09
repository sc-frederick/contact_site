import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "~/components/home/hero-section";
import { ContactLinks } from "~/components/home/contact-links";
import { ActionButtons } from "~/components/home/action-buttons";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Contact Card */}
        <div className="relative bg-bg-surface/80 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8 shadow-2xl">
          {/* Decorative accent line at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

          {/* Hero Section - Avatar, Name, Title */}
          <HeroSection className="mb-8" />

          {/* Divider */}
          <div className="h-px bg-border/50 mb-8" />

          {/* Contact Links List */}
          <ContactLinks className="mb-8" />

          {/* Action Buttons - Save Contact & Share */}
          <ActionButtons />
        </div>

        {/* Bottom note */}
        <p className="text-center font-body text-xs text-text-tertiary mt-6">
          Digital Business Card • Built with TanStack Router
        </p>
      </div>
    </div>
  );
}
