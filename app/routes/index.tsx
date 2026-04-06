import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <div><h1>Stephen Frederick</h1><p>Coming soon</p></div>;
}
