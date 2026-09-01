import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const routes = [
  { path: "/", label: "Home" },
  { path: "/portfolio", label: "Developer Portfolio" },
  { path: "/resume", label: "Resume" },
  { path: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav className="site-header fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-3" aria-label="Stephen Frederick, home">
          <span className="mp-card__monogram">SF</span>
          <span className="hidden font-display text-xl sm:block">Stephen Frederick</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="mp-tabs site-desktop-nav" aria-label="Primary navigation">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "site-nav-link",
              )}
              aria-current={currentPath === route.path ? "page" : undefined}
            >
              {route.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={mobileMenuButtonRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mp-btn mp-btn--secondary mp-btn--icon site-mobile-menu-button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="mp-icon" /> : <Menu className="mp-icon" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[73px] z-40 bg-[#101010]/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            className="fixed right-0 top-[73px] z-50 h-[calc(100vh-73px)] w-72 border-l border-border bg-bg-surface md:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="site-nav-link text-base"
                  aria-current={currentPath === route.path ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
