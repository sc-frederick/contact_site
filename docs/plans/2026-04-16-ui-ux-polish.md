# UI/UX Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Address all UI/UX issues identified in the design review — fix z-index conflicts, integrate the unused contact form, standardize page headers, add a toast notification system, improve portfolio visual hierarchy, harden the resume timeline layout, enhance footer, and fix accessibility gaps.

**Architecture:** Each task is self-contained and modifies 1–3 files. Tasks are ordered so earlier tasks don't create merge conflicts with later ones. No new dependencies are added except where noted (e.g., a toast component). All changes are in `app/components/` and `app/routes/`.

**Tech Stack:** React 19, TanStack Start/Router, Tailwind CSS v4 (custom `@theme` tokens in `app/styles.css`), Lucide icons, `cn()` utility from `~/lib/utils`.

---

## Task 1: Fix Noise Overlay z-index

The `NoiseOverlay` component uses `z-50`, which is the same z-index as the portfolio modal backdrop. The overlay is `pointer-events-none` so it won't block clicks, but it renders visually on top of modal content. Lower it to a background layer.

**Files:**
- Modify: `app/components/ui/noise-overlay.tsx`

**Step 1: Update the z-index**

In `app/components/ui/noise-overlay.tsx`, change the className from `z-50` to `z-10`:

```tsx
export function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
```

**Step 2: Verify visually**

Run `npm run dev`, open any page. The noise texture should still be visible. Open a portfolio modal — the modal content should no longer have the noise texture layered on top.

**Step 3: Commit**

```bash
git add app/components/ui/noise-overlay.tsx
git commit -m "fix: lower noise overlay z-index to avoid rendering on top of modals"
```

---

## Task 2: Add a Toast Notification Component

The share button fallback uses `alert()`, which breaks the dark UI with a browser-native dialog. Create a minimal toast component to replace it. This component will also be reusable for future notifications (e.g., contact form submission).

**Files:**
- Create: `app/components/ui/toast.tsx`

**Step 1: Create the toast component**

Create `app/components/ui/toast.tsx`:

```tsx
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { cn } from "~/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-accent" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
        "bg-bg-surface border-border/50 backdrop-blur-sm",
        "animate-in slide-in-from-bottom-2 fade-in duration-300"
      )}
    >
      {icons[toast.type]}
      <p className="font-body text-sm text-text-primary flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

**Step 2: Wire ToastProvider into root layout**

In `app/routes/__root.tsx`, wrap the body content with `ToastProvider`:

```tsx
import { ToastProvider } from "~/components/ui/toast";

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
```

**Step 3: Replace `alert()` in ActionButtons**

In `app/components/home/action-buttons.tsx`, replace the `alert()` call with the toast:

```tsx
import { useToast } from "~/components/ui/toast";

export function ActionButtons({ className }: ActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: `${contactData.name} | ${contactData.company}`,
      text: `Connect with ${contactData.name} - ${contactData.title} at ${contactData.company}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", "success");
    } catch (err) {
      console.log("Share cancelled", err);
    }
  };

  // ... rest unchanged
}
```

**Step 4: Verify**

Click the Share button on the home page. A styled toast should appear at bottom-right and auto-dismiss after 3 seconds. Confirm no `alert()` dialog appears.

**Step 5: Commit**

```bash
git add app/components/ui/toast.tsx app/routes/__root.tsx app/components/home/action-buttons.tsx
git commit -m "feat: add toast notification system, replace alert() in share fallback"
```

---

## Task 3: Integrate Contact Form into the Contact Page

The `contact-form.tsx` (404 lines) exists but is not imported anywhere. The `/contact` page only shows a collaboration bullet list and a subset of contact links. Integrate the form to make the page useful.

**Files:**
- Modify: `app/routes/contact.tsx`

**Step 1: Update contact.tsx to include the form**

Replace the current content section with a layout that shows the collaboration info plus the contact form:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "~/components/contact/contact-form";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Get in Touch
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-body text-text-secondary max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Send me a message or reach out directly.
          </p>
        </div>

        {/* Contact Form (two-column: info left, form right) */}
        <ContactForm />

        {/* Collaboration info */}
        <div className="mt-12 bg-bg-surface/50 rounded-xl border border-border p-6 md:p-8">
          <h2 className="font-display text-2xl text-text-primary mb-3">
            Open to Collaboration On
          </h2>
          <ul className="font-body text-text-secondary space-y-1.5">
            <li className="flex items-baseline gap-2">
              <span className="text-accent leading-none">•</span>
              <span>Fullstack web application development</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-accent leading-none">•</span>
              <span>Developer tools and internal product tooling</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-accent leading-none">•</span>
              <span>Automation workflows and integrations</span>
            </li>
            <li className="flex items-baseline gap-2">
              <span className="text-accent leading-none">•</span>
              <span>Website operations, performance, and SEO optimization</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Navigate to `/contact`. The page should now show:
1. Centered header with decorative divider
2. Two-column layout: direct contact info (email, phone, location) on the left, contact form on the right
3. Collaboration section below

Verify form validation works (submit empty, check error messages). Note: actual submission requires a working D1 database, so the submit action may fail in local dev — that's expected. The UI flow (validation, loading state, error display) should work.

**Step 3: Commit**

```bash
git add app/routes/contact.tsx
git commit -m "feat: integrate contact form into /contact page"
```

---

## Task 4: Standardize Blog Page Header

The blog page uses a different header pattern (left-aligned with PenLine icon + horizontal rule) than all other pages (centered with dot-line-dot decorative divider). Standardize it.

**Files:**
- Modify: `app/routes/blog/index.tsx`

**Step 1: Update the blog header**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getBlogPostsFromDB } from "~/lib/server/db";
import { PostList } from "~/components/blog/post-list";
import type { BlogPost } from "~/types";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  loader: async (): Promise<BlogPost[]> => {
    const posts = await getBlogPostsFromDB(true);
    return posts;
  },
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header — standardized centered layout */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Blog
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-border to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-24 bg-gradient-to-r from-border via-accent to-border" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-border to-border" />
          </div>

          <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto">
            Thoughts on software development, design patterns, and building
            products that matter.
          </p>
        </div>

        {/* Post listing */}
        <PostList posts={posts} />
      </div>
    </div>
  );
}
```

**Step 2: Verify**

Navigate to `/blog`. Confirm the header now matches the Portfolio/Resume/Contact centered style with the dot-line-dot divider. The PenLine icon is removed.

**Step 3: Commit**

```bash
git add app/routes/blog/index.tsx
git commit -m "fix: standardize blog page header to match other pages"
```

---

## Task 5: Add Featured Project Treatment to Portfolio

All portfolio cards look identical — no visual hierarchy. The `PortfolioItem` type already has a `featured` field and an `image_url` field that are unused. Add visual treatment for featured projects (larger cards spanning 2 columns on desktop).

**Files:**
- Modify: `app/components/portfolio/portfolio-grid.tsx`
- Modify: `app/components/portfolio/portfolio-card.tsx`

**Step 1: Update PortfolioGrid to sort featured items first**

```tsx
import { useState } from "react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioModal } from "./portfolio-modal";

interface PortfolioGridProps {
  items: PortfolioItem[];
  className?: string;
}

export function PortfolioGrid({ items, className }: PortfolioGridProps) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  if (items.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="font-body text-text-secondary">
          No portfolio items available yet.
        </p>
      </div>
    );
  }

  // Sort: featured items first, then by display_order
  const sorted = [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.display_order - b.display_order;
  });

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {sorted.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onOpen={(selectedItem) => setActiveItem(selectedItem)}
          />
        ))}
      </div>

      {activeItem && (
        <PortfolioModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  );
}
```

**Step 2: Update PortfolioCard with featured styling**

In `app/components/portfolio/portfolio-card.tsx`, add span-2 for featured cards and a "Featured" badge:

```tsx
import { ExternalLink, Github, Star } from "lucide-react";
import type { PortfolioItem } from "~/types";
import { cn } from "~/lib/utils";

interface PortfolioCardProps {
  item: PortfolioItem;
  onOpen?: (item: PortfolioItem) => void;
  className?: string;
}

export function PortfolioCard({ item, onOpen, className }: PortfolioCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.(item);
        }
      }}
      className={cn(
        "group relative bg-bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-6 cursor-pointer",
        "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        "transition-all duration-300 ease-out",
        item.featured && "md:col-span-2 lg:col-span-2 border-accent/20",
        className
      )}
    >
      {/* Decorative accent line at top */}
      <div
        className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent group-hover:via-accent transition-all duration-300",
          item.featured
            ? "w-24 group-hover:w-32 via-accent"
            : "w-16 group-hover:w-24"
        )}
      />

      {/* Featured badge */}
      {item.featured && (
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="font-body text-xs text-accent uppercase tracking-wider">
            Featured Project
          </span>
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          "font-display text-text-primary mb-3 group-hover:text-accent transition-colors duration-300",
          item.featured ? "text-2xl" : "text-xl"
        )}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "font-body text-sm text-text-secondary mb-4",
          item.featured ? "line-clamp-4" : "line-clamp-3"
        )}
      >
        {item.description}
      </p>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {item.technologies.map((tech) => (
          <span
            key={tech}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-body",
              "bg-bg-primary border border-border/50 text-text-tertiary",
              "group-hover:border-accent/30 group-hover:text-text-secondary",
              "transition-colors duration-300"
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        {item.project_url && (
          <a
            href={item.project_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "flex items-center gap-1.5 text-sm font-body",
              "text-text-secondary hover:text-accent",
              "transition-colors duration-300"
            )}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Live Demo</span>
          </a>
        )}

        {item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "flex items-center gap-1.5 text-sm font-body",
              "text-text-secondary hover:text-accent",
              "transition-colors duration-300"
            )}
          >
            <Github className="w-4 h-4" />
            <span>Source</span>
          </a>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Verify**

Navigate to `/portfolio`. Any items marked `featured: true` in the database should now:
- Appear first in the grid
- Span 2 columns on `md` and `lg` breakpoints
- Show a gold "Featured Project" badge with a filled star
- Have a slightly larger title and accent border

If no items are `featured` yet, the grid should look identical to before.

**Step 4: Commit**

```bash
git add app/components/portfolio/portfolio-grid.tsx app/components/portfolio/portfolio-card.tsx
git commit -m "feat: add featured project visual treatment to portfolio cards"
```

---

## Task 6: Refactor Resume Timeline to Use CSS Grid

The timeline uses hardcoded `left-[11.5rem]` for the vertical line and dot positioning, which is fragile. Refactor to CSS Grid so the date column width is determined by content.

**Files:**
- Modify: `app/components/resume/timeline.tsx`

**Step 1: Rewrite timeline with CSS Grid**

```tsx
import { cn } from "~/lib/utils";
import type { Experience } from "~/lib/resume-data";

interface TimelineProps {
  items: Experience[];
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  const totalMonths = years * 12 + months;
  const displayYears = Math.floor(totalMonths / 12);
  const displayMonths = totalMonths % 12;

  if (displayYears === 0) {
    return `${displayMonths} mo${displayMonths !== 1 ? "s" : ""}`;
  } else if (displayMonths === 0) {
    return `${displayYears} yr${displayYears !== 1 ? "s" : ""}`;
  } else {
    return `${displayYears} yr${displayYears !== 1 ? "s" : ""} ${displayMonths} mo${displayMonths !== 1 ? "s" : ""}`;
  }
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-1 md:grid-cols-[auto_1rem_1fr] md:gap-x-4"
        >
          {/* Date column - desktop */}
          <div className="hidden md:flex flex-col items-end text-right pt-1">
            <div className="font-mono text-xs text-text-tertiary whitespace-nowrap">
              {formatDate(item.startDate)}
            </div>
            <div className="font-mono text-xs text-text-tertiary whitespace-nowrap">
              {formatDate(item.endDate)}
            </div>
            <div className="font-mono text-[10px] text-accent mt-1 whitespace-nowrap">
              {getDuration(item.startDate, item.endDate)}
            </div>
          </div>

          {/* Timeline indicator - desktop */}
          <div className="hidden md:flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-accent border-2 border-bg-primary mt-1.5 shrink-0" />
            <div className="w-px flex-1 bg-border" />
          </div>

          {/* Content */}
          <div className="min-w-0 pb-8 border-b border-border/50 last:border-b-0 last:pb-0">
            {/* Mobile date */}
            <div className="md:hidden mb-2">
              <span className="font-mono text-xs text-text-tertiary">
                {formatDate(item.startDate)} — {formatDate(item.endDate)}
              </span>
              <span className="font-mono text-[10px] text-accent ml-2">
                ({getDuration(item.startDate, item.endDate)})
              </span>
            </div>

            <h3 className="font-display text-xl text-text-primary mb-1">
              {item.title}
            </h3>
            <div className="font-body text-accent mb-1">{item.company}</div>
            <div className="font-body text-sm text-text-tertiary mb-3">
              {item.location}
            </div>

            <ul className="space-y-2 mb-4">
              {item.description.map((desc, i) => (
                <li
                  key={i}
                  className="font-body text-sm text-text-secondary leading-relaxed flex gap-2"
                >
                  <span className="text-accent mt-1.5">•</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded bg-bg-elevated text-text-tertiary font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Key changes:
- Replaced `relative` + `absolute left-[11.5rem]` positioning with `grid grid-cols-[auto_1rem_1fr]`
- The date column is `auto`-width (sized to content), the indicator column is `1rem`, and the content column is `1fr`
- The vertical line is now a `flex-1 w-px bg-border` div that grows to fill the indicator column
- The dot is in the same column, centered
- Removed `overflow-x-hidden` workaround from `app/routes/resume.tsx`

**Step 2: Clean up resume.tsx overflow workaround**

In `app/routes/resume.tsx`, the root div has `overflow-x-hidden` which was a workaround for the absolute positioning. Remove it:

Change line 12 from:
```tsx
<div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
```
to:
```tsx
<div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
```

**Step 3: Verify**

Navigate to `/resume`. The timeline should look visually identical to before, but inspect with DevTools to confirm the grid layout is being used. Test on mobile — should still show inline dates without the timeline indicator.

**Step 4: Commit**

```bash
git add app/components/resume/timeline.tsx app/routes/resume.tsx
git commit -m "refactor: replace fragile absolute positioning with CSS Grid in resume timeline"
```

---

## Task 7: Enhance Footer with Social Links

The footer only shows copyright and location. Add GitHub and LinkedIn links to make it more useful as a site-wide navigation element.

**Files:**
- Modify: `app/components/layout/footer.tsx`

**Step 1: Update the footer**

```tsx
import { Github, Linkedin } from "lucide-react";
import { contactData } from "~/lib/contact-data";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg-primary px-6 py-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} {contactData.name}
        </p>

        <div className="flex items-center gap-4">
          <a
            href={contactData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-accent transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/stephenfrederick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-accent transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <span className="text-border">|</span>
          <a
            href="https://maps.app.goo.gl/8BNGpYQypndip3L39"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-text-tertiary hover:text-accent transition-colors duration-300"
          >
            Tampa, FL
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**Note:** The LinkedIn URL above (`linkedin.com/in/stephenfrederick`) is a placeholder. Check `contact-data.ts` for the actual URL — if it doesn't exist there yet, add it or use the correct URL. If `contactData` doesn't include a LinkedIn field, hardcode the correct URL or skip the LinkedIn link.

**Step 2: Verify**

Check the footer on any page. It should show copyright on the left, social icons + location on the right. On mobile (`sm:` breakpoint), it should stack vertically centered.

**Step 3: Commit**

```bash
git add app/components/layout/footer.tsx
git commit -m "feat: enhance footer with GitHub and LinkedIn social links"
```

---

## Task 8: Fix Accessibility — Avatar Checkmark Badge

The `✓` checkmark badge on the avatar has no accessible label. Screen readers will read the raw checkmark character, which is meaningless.

**Files:**
- Modify: `app/components/home/hero-section.tsx`

**Step 1: Add aria-label and hide decorative text**

In `hero-section.tsx`, update the checkmark badge (around line 21-23):

From:
```tsx
<div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
  <span className="text-bg-primary text-lg">✓</span>
</div>
```

To:
```tsx
<div
  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
  role="img"
  aria-label="Verified profile"
>
  <span className="text-bg-primary text-lg" aria-hidden="true">✓</span>
</div>
```

**Step 2: Commit**

```bash
git add app/components/home/hero-section.tsx
git commit -m "fix: add accessible label to avatar verification badge"
```

---

## Task 9: Add Mobile Nav Close Animation

The mobile menu slides in from the right on open (`animate-in slide-in-from-right`) but disappears instantly on close. Add a smooth exit.

**Files:**
- Modify: `app/components/layout/navbar.tsx`

**Step 1: Replace conditional rendering with CSS-driven visibility**

The current approach conditionally renders the menu (`{isMobileMenuOpen && ...}`), which makes exit animations impossible without a library. Switch to keeping the element mounted and using CSS transforms:

Replace the mobile menu section (lines 119-152) with:

```tsx
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
```

Also update the body scroll lock effect to handle the always-mounted menu:

The existing `useEffect` for click outside (lines 25-45) handles body overflow. Since the menu is now always mounted, the click-outside logic remains the same but the backdrop now handles clicks via its own `onClick`, so the `handleClickOutside` logic in the ref can be simplified or kept as-is for robustness.

**Step 2: Verify**

On mobile viewport, open the hamburger menu — it should slide in from the right. Close it (tap backdrop, tap a link, or tap X) — it should slide back out to the right smoothly over 300ms.

**Step 3: Commit**

```bash
git add app/components/layout/navbar.tsx
git commit -m "feat: add smooth close animation to mobile navigation menu"
```

---

## Task 10: Add External Link Indicators for Accessibility

Contact links that open in new tabs/windows should indicate this to screen readers. The `ContactLinkItem` component renders links without `target` or `rel` attributes, and the location link in `contact-links.tsx` has `target="_blank"` but no screen reader indicator.

**Files:**
- Modify: `app/components/home/contact-links.tsx`

**Step 1: Add external link attributes and sr-only indicator to ContactLinkItem**

Add a prop to indicate external links, and append a screen-reader-only label:

Update the `ContactLinkItem` component:

```tsx
interface ContactLinkItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactLinkItem({ icon, label, value, href, external }: ContactLinkItemProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/50 border border-border hover:border-accent/50 hover:bg-bg-surface transition-all duration-300 group"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="text-accent group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs text-text-tertiary uppercase tracking-wider">
          {label}
        </p>
        <p className="font-body text-sm text-text-primary truncate">
          {value}
          {external && <span className="sr-only"> (opens in new tab)</span>}
        </p>
      </div>
    </a>
  );
}
```

Then mark external links with `external` prop in the `ContactLinks` component:

- Website links: add `external`
- GitHub link: add `external`
- Location link: already has `target="_blank"` — add `sr-only` text

**Step 2: Commit**

```bash
git add app/components/home/contact-links.tsx
git commit -m "fix: add external link indicators for screen readers on contact links"
```

---

## Summary of Tasks

| # | Task | Priority | Files Modified | Type |
|---|------|----------|----------------|------|
| 1 | Fix noise overlay z-index | Low | 1 | Bug fix |
| 2 | Add toast notifications | Low | 3 (1 new) | Feature |
| 3 | Integrate contact form | High | 1 | Feature |
| 4 | Standardize blog header | Medium | 1 | Consistency |
| 5 | Featured portfolio cards | Medium | 2 | Feature |
| 6 | Refactor timeline to Grid | Medium | 2 | Refactor |
| 7 | Enhance footer | Low | 1 | Feature |
| 8 | Avatar badge a11y | Low | 1 | Accessibility |
| 9 | Mobile nav close animation | Low | 1 | UX polish |
| 10 | External link a11y | Low | 1 | Accessibility |

**Estimated total: ~10 focused tasks, each completable in 5–15 minutes.**
