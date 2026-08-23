import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "~/components/home/about-hero";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg-primary">
      {/* Hero / About Section */}
      <AboutHero />
    </div>
  );
}
