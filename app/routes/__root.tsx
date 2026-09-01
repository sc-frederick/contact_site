/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import appStyles from "~/styles.css?url";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
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
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <div className="mp-shell flex min-h-[calc(100vh-72px)] items-center justify-center">
      <div className="mp-card max-w-md text-center">
        <p className="mp-eyebrow">Error 404</p>
        <h1 className="mp-headline">
          Page not found
        </h1>
        <p className="mp-body">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mp-btn self-center"
        >
          <ArrowLeft className="mp-icon" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <ToastProvider>
          <Navbar />
          <main className="flex min-h-0 flex-1 flex-col pt-[73px]">
            {children}
          </main>
          <Footer />
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  );
}
