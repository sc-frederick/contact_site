import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";

const routes = [
  { path: "/", label: "Home" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/resume", label: "Resume" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl text-text-primary tracking-wide">
          SF
        </Link>
        <div className="flex items-center gap-8">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "relative font-body text-sm tracking-wide transition-colors duration-300",
                currentPath === route.path
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {route.label}
              {currentPath === route.path && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
