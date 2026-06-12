// D1/KV Database helper functions
// These are mock implementations since D1 bindings aren't fully set up yet

import type { PortfolioItem, BlogPost, ContactSubmission, AnalyticsEvent } from '~/types';

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
    title: 'Echocaster',
    description: 'Document-to-podcast generator that turns uploaded text into narrated audio episodes. A TanStack web client pairs with a Cloudflare Workers API that ingests documents, orchestrates background text-to-speech jobs through Cloudflare Queues, assembles multi-chunk audio, and streams playable episodes with per-episode playback state.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TanStack Start', 'React', 'TypeScript', 'Hono', 'Cloudflare Workers', 'D1', 'R2', 'Cloudflare Queues', 'Workers AI'],
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
    title: 'BricsCAD MCP Server',
    description: 'MCP server that gives AI assistants COM-based access to BricsCAD drafting operations. Supports drawing lines, circles, arcs, polylines, and rectangles, opening DWG files, and publishing layouts to PDF.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Go', 'MCP SDK', 'COM Automation', 'BricsCAD API'],
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
    id: 10,
    title: 'AEC Agent Consensus',
    description: 'Chat interface that queries several LLMs in parallel and reconciles their answers into a single consensus response, so engineers get a cross-checked answer instead of trusting any one model. Built on a fast Bun + React stack.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Bun', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    featured: false,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
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
  {
    id: 20,
    title: 'AEC Marketing Skills',
    description: 'Library of agent skill packages and CLI scripts that automate internal AEC marketing operations — local SEO, Google Business Profile management, keyword research, content drafting, and social planning — as markdown skills plus Bun/TypeScript tooling.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Bun', 'TypeScript', 'Markdown', 'OpenCode', 'GA4 / GSC'],
    featured: false,
    display_order: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 21,
    title: 'GeoAddressMap LSP',
    description: 'BricsCAD AutoLISP routine that geocodes street addresses via OpenStreetMap Nominatim and sets the drawing\'s geographic location with the FL83-WF coordinate system.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['AutoLISP', 'Nominatim API', 'ESRI ArcGIS', 'BricsCAD'],
    featured: false,
    display_order: 21,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 22,
    title: 'TEXTALLCAPS',
    description: 'BricsCAD AutoLISP plugin that automatically converts TEXT, MTEXT, and MULTILEADER content to uppercase using command and database reactors.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['AutoLISP', 'VLR Reactors', 'COM Automation', 'BricsCAD'],
    featured: false,
    display_order: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 23,
    title: 'Civil Perplexity Space',
    description: 'Knowledge base and conversation analysis tool for civil engineering with curated AI system instructions for Florida codes, standards, stormwater, and materials.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Python', 'JSON', 'HTML', 'Florida Building Codes'],
    featured: false,
    display_order: 23,
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

export async function createContactSubmissionInDB(
  data: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>
): Promise<ContactSubmission> {
  // TODO: Replace with actual D1 query when bindings are configured
  const newSubmission: ContactSubmission = {
    ...data,
    id: Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  console.log('Created contact submission:', newSubmission);
  return newSubmission;
}

export async function createAnalyticsEventInDB(
  data: Omit<AnalyticsEvent, 'id' | 'created_at'>
): Promise<AnalyticsEvent> {
  // TODO: Replace with actual D1 query when bindings are configured
  const newEvent: AnalyticsEvent = {
    ...data,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };

  console.log('Created analytics event:', newEvent);
  return newEvent;
}

// Helper to get platform environment (for use when D1 is configured)
// This function will work with Cloudflare Workers/Pages environment
export function getPlatformEnv(): { DB?: D1Database; KV?: KVNamespace } {
  // In a real Cloudflare environment, this would be available via the request context
  // For now, return empty object since we're using mock data
  return {};
}

// D1Database type stub (for when bindings are configured)
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T>(): Promise<T | null>;
  run<T>(): Promise<D1Result<T>>;
  all<T>(): Promise<D1Result<T>>;
  raw<T>(): Promise<T[]>;
}

export interface D1Result<T> {
  results: T[];
  success: boolean;
  error?: string;
  meta?: {
    duration: number;
    last_row_id: number;
    changes: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// KVNamespace type stub (for when bindings are configured)
export interface KVNamespace {
  get(key: string, options?: { cacheTtl?: number; type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<string | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expiration?: number; expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; expiration?: number }[]; list_complete: boolean; cursor?: string }>;
}
