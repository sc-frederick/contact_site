import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <h1 className="font-display text-4xl text-accent">Stephen Frederick</h1>
    </div>
  );
}
