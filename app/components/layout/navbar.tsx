import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { useState, useEffect, useRef } from "react";

const routes = [
  { path: "/", label: "Home" },
  { path: "/portfolio", label: "Developer Portfolio" },
  { path: "/resume", label: "Resume" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl text-text-primary tracking-wide">
          SF
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-text-primary hover:text-accent transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            // Close icon (X)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {/* Backdrop */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-[65px] bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "md:hidden fixed top-[65px] right-0 w-64 h-[calc(100vh-65px)] bg-bg-primary border-l border-border/50 z-50 shadow-2xl",
          "transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 gap-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "font-body text-base tracking-wide transition-colors duration-300 py-2",
                currentPath === route.path
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {route.label}
              {currentPath === route.path && (
                <span className="block h-px w-8 bg-accent mt-2" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
