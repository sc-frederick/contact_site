import { createRootRoute, Outlet, ScrollRestoration, Scripts } from "@tanstack/react-router";
import appStyles from "~/styles.css?url";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { NoiseOverlay } from "~/components/ui/noise-overlay";

export const Route = createRootRoute({
  component: RootComponent,
  links: () => [
    { rel: "stylesheet", href: appStyles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
    },
  ],
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Stephen Frederick</title>
      </head>
      <body className="bg-bg-primary text-text-primary font-body">
        <NoiseOverlay />
        <Navbar />
        <main className="min-h-screen pt-[72px]">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
