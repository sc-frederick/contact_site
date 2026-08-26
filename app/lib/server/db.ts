// Read helpers for repository-backed portfolio and blog content.

import type { PortfolioItem, BlogPost } from '~/types';

// Mock data based on the seed.sql file
const mockPortfolioItems: PortfolioItem[] = [
  // ---------- Featured ----------
  {
    id: 1,
    title: 'Moke Agent',
    description: 'AI-powered AEC drawing QC review pipeline. Automatically locates project drawings, splits PDFs by engineering discipline, runs discipline-specific AI review (Synthetic AI / Kimi K2.5 with an OpenRouter fallback), and generates formatted review reports.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TypeScript', 'Bun', 'Effect-TS', 'OpenRouter AI', 'Zod', 'pdf-lib'],
    featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'AEC Project Lighthouse',
    description: 'Full-featured project management SaaS for architecture, engineering, and construction teams. Real-time collaboration, Gantt charts, markdown editing, email notifications, and comprehensive test coverage. Live at aeccloud.io.',
    image_url: '',
    project_url: 'https://www.aeccloud.io',
    github_url: '',
    technologies: ['React 19', 'TypeScript', 'Convex', 'Vite', 'Tailwind CSS', 'Vitest', 'Playwright'],
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'General AI Tooling for AEC Engineers',
    description: 'A practical field kit for bringing general-purpose AI into architecture, engineering, and construction work. Combines reusable agent skills, repeatable workflows, executable Python workbooks, and feedback loops that turn one-off experiments into dependable engineering processes.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Agent Skills', 'Reusable Workflows', 'Python Workbooks', 'Feedback Loops'],
    featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Sheaf',
    description: 'Cross-platform Markdown note-taking app built for fast, formatted-writing-first capture with multi-device sync and note-level sharing (Viewer/Editor). Runs entirely on Cloudflare primitives — Workers, D1, and a Durable Object for coordination — with web and Android clients, offline-capable sync, and self-hostable open infrastructure.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Cloudflare Workers', 'D1', 'Durable Objects', 'Better Auth'],
    featured: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Moke Script',
    description: 'AI-powered planset review and comparison tool for construction drawings. Ships as a cross-platform desktop CLI (Windows/macOS/Linux) that reviews or diffs PDF plansets into an HTML report, plus a hosted SvelteKit web app on Cloudflare with review jobs, auth, and D1/R2 storage.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['SvelteKit', 'TypeScript', 'Cloudflare Workers', 'D1', 'R2', 'Codex CLI', 'pdf-to-img'],
    featured: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Kalshi Sniper Bot',
    description: 'Algorithmic trading bot that snipes Kalshi binary event contracts in the final 10–60 seconds before expiration, targeting outcomes that are near-certain but not yet priced in. Features a supervised Effect-TS runtime with SQLite (WAL) persistence, WebSocket market data with gap repair, startup reconciliation, and a ledger-derived accounting system.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TypeScript', 'Bun', 'Effect-TS', 'WebSocket', 'SQLite'],
    featured: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'ScoutWork',
    description: 'AI-powered job search and recruiting platform with intelligent search and conversational matching, wrapped in a warm "Night Desk" dark aesthetic. Aggregates listings via SerpApi, runs chat on Cloudflare Workers AI, stores data in D1 with résumé uploads in R2, and gates access with magic-link email auth.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TanStack Start', 'React', 'TypeScript', 'Cloudflare Workers', 'D1', 'R2', 'Workers AI', 'SerpApi'],
    featured: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    title: 'BricsCAD / AutoCAD MCP Server',
    description: 'Code-mode MCP integration for AI-assisted drafting in BricsCAD alongside an isolated AutoCAD connector. A Python stdio server attaches to the running CAD session over Windows COM, serializes spool jobs, executes generated PyRx code inside BricsCAD, and returns structured results with transaction rollback.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Python 3.12', 'FastMCP', 'PyRx', 'Windows COM', 'JSON-RPC'],
    featured: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    title: 'AEC Property Hunter',
    description: 'Internal property research workspace for parcel review, zoning context collection, AI-assisted viability analysis, and PDF report generation. Supports multi-county parcel data seeding.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['React 19', 'TanStack Start', 'Drizzle ORM', 'Turso', 'OpenRouter AI', 'Jina AI', 'Tailwind CSS'],
    featured: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ---------- Project Index ----------
  {
    id: 11,
    title: 'CardStore',
    description: 'Full-stack sports card e-commerce store with a public catalog, cart, and Stripe checkout, plus an admin dashboard for inventory management, CSV import, image galleries, and sales charts. Built on TanStack Start and Cloudflare.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TanStack Start', 'React', 'TypeScript', 'Cloudflare Workers', 'Drizzle ORM', 'Better Auth', 'Stripe', 'Resend', 'Tailwind CSS'],
    featured: false,
    display_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 12,
    title: 'Snip-it',
    description: 'Chrome (Manifest V3) extension for capturing excerpts from building, fire, and electrical codes during code research. Clips and organizes citations, indexes them with fuzzy search, and syncs to Dropbox so references can be re-found later.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['WXT', 'Svelte 5', 'TypeScript', 'MiniSearch', 'Dexie', 'Dropbox SDK'],
    featured: false,
    display_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 13,
    title: 'CafeFit',
    description: 'Fitness tracking Progressive Web App for calorie tracking, weight management, and workout logging with offline support. Built with TanStack Start on Cloudflare Workers with a D1 SQLite database.',
    image_url: '',
    project_url: 'https://cafefit.xyz',
    github_url: '',
    technologies: ['TanStack Start', 'React 19', 'TypeScript', 'Drizzle ORM', 'Cloudflare D1', 'Better Auth', 'Tailwind CSS v4', 'Chart.js', 'PWA'],
    featured: false,
    display_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 14,
    title: 'Apple Maps to Google Maps Converter',
    description: 'Web service that automatically converts Apple Maps links in incoming SMS/RCS messages to Google Maps links. Features encrypted key storage, rate limiting, audit logging, and idempotency tracking.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Go', 'TypeScript', 'React 19', 'SQLite', 'Docker'],
    featured: false,
    display_order: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 15,
    title: 'Apple Music to Spotify',
    description: 'Web service that converts Apple Music links to Spotify equivalents using the Odesli API as the primary resolver with a Spotify search fallback. Caches results in SQLite.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Go', 'TypeScript', 'React 19', 'SQLite', 'Spotify API', 'Docker'],
    featured: false,
    display_order: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 16,
    title: 'Accredited Home Repair',
    description: 'Marketing site for a home-repair contractor with service pages and programmatically generated per-city service-area landing pages for local SEO. Built with SvelteKit and backed by Cloudflare D1 via Drizzle.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Drizzle ORM', 'Cloudflare D1', 'Tailwind CSS'],
    featured: false,
    display_order: 16,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 17,
    title: 'LightSpeed Music',
    description: 'High-performance artist website with an interactive starfield/warp-speed canvas animation, Spotify player embeds, and links to all major streaming platforms.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
    featured: false,
    display_order: 17,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 18,
    title: 'Advanced Website',
    description: 'Ground-up redesign and reimplementation of the original WordPress site for Advanced Engineering Consultants. Re-architected with Laravel and React (Inertia.js) including service pages, gallery, contact forms, and a careers portal; currently in development.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Laravel', 'React 19', 'Inertia.js', 'TypeScript', 'Tailwind CSS', 'PHP 8'],
    featured: false,
    display_order: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 19,
    title: 'BlueForge',
    description: 'Custom immutable Linux desktop OS image built on Universal Blue\'s Bluefin. A multi-stage Containerfile bakes in a Ghostty-first terminal, security tooling (1Password, Mullvad), and a curated Homebrew/Flatpak app set for a reproducible daily-driver dev environment.',
    image_url: '',
    project_url: '',
    github_url: 'https://github.com/sc-frederick/BlueForge',
    technologies: ['Containerfile', 'Bash', 'Just', 'Universal Blue', 'Homebrew', 'Flatpak', 'Podman'],
    featured: false,
    display_order: 19,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Hello World',
    slug: 'hello-world',
    content: '<h1>Hello World</h1><p>I\'m Stephen Frederick, and I wear a few hats at Advanced Engineering Consultants: MEP Staff Engineer, IT Manager, and developer. Over the years, my work has shifted from only delivering engineering drawings to also building the internal systems and software that help projects move faster and with less friction.</p><p>I started this blog as a place to document that overlap between engineering, IT, and software. Most posts here will be practical: what I built, why I built it that way, what broke, and what I would improve next time.</p><h2>What you can expect here</h2><p>I plan to share project write-ups, implementation notes, and lessons learned from real work. Topics will usually include automation for engineering workflows, web tooling, AI-assisted processes, and day-to-day technical decisions that support business operations.</p><p>If you are building in a similar space, my goal is for these posts to be useful enough that you can apply something immediately.</p><h2>Thanks for stopping by</h2><p>This is the first post, but there is more on the way. I appreciate you reading, and I hope what I share here helps you build better systems in your own work.</p>',
    excerpt: 'A personal introduction to my background and what this blog will cover across engineering operations, IT, and software development.',
    cover_image: null,
    tags: ['Introduction', 'Engineering', 'Development'],
    published: true,
    published_at: '2026-04-09T12:00:00.000Z',
    created_at: '2026-04-09T12:00:00.000Z',
    updated_at: '2026-04-09T12:00:00.000Z',
  },
];

// Helper functions for working with the database
// These will be replaced with actual D1 queries when bindings are configured

export async function getPortfolioItemsFromDB(
  featured?: boolean
): Promise<PortfolioItem[]> {
  // TODO: Replace with actual D1 query when bindings are configured
  // const db = getPlatformEnv().DB;
  // const stmt = db.prepare('SELECT * FROM portfolio_items WHERE featured = ? ORDER BY display_order');
  // return stmt.all(featured ? 1 : 0);

  if (featured !== undefined) {
    return mockPortfolioItems
      .filter((item) => item.featured === featured)
      .sort((a, b) => a.display_order - b.display_order);
  }

  return [...mockPortfolioItems].sort((a, b) => a.display_order - b.display_order);
}

export async function getBlogPostsFromDB(
  published?: boolean
): Promise<BlogPost[]> {
  // TODO: Replace with actual D1 query when bindings are configured

  if (published !== undefined) {
    return mockBlogPosts
      .filter((post) => post.published === published)
      .sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
  }

  return [...mockBlogPosts].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getBlogPostBySlugFromDB(
  slug: string
): Promise<BlogPost | null> {
  // TODO: Replace with actual D1 query when bindings are configured
  const post = mockBlogPosts.find((p) => p.slug === slug);
  return post || null;
}
