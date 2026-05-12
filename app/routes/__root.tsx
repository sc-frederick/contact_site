/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import appStyles from "~/styles.css?url";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { NoiseOverlay } from "~/components/ui/noise-overlay";
import { ToastProvider } from "~/components/ui/toast";
import { ArrowLeft } from "lucide-react";
import * as React from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stephen Frederick" },
    ],
    links: [
      { rel: "stylesheet", href: appStyles },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="font-mono text-sm text-accent uppercase tracking-wider block mb-4">
          404
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
          Page not found
        </h1>
        <p className="font-body text-text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-surface border border-border text-text-primary font-body text-sm hover:border-accent hover:text-accent transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg-primary text-text-primary font-body overflow-x-hidden">
        <ToastProvider>
          <NoiseOverlay />
          <Navbar />
          <main className="min-h-screen pt-[72px]">
            {children}
          </main>
          <Footer />
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  );
}
