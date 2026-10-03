// Read helpers for repository-backed portfolio and blog content.

import type { PortfolioItem, BlogPost } from '~/types';

// Mock data based on the seed.sql file
const mockPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Forewit',
    description: 'Engineering software for people and AI agents. Starting with MEP tools that replace scattered Excel workflows with shared project data and agent-usable calculation logic.',
    image_url: '',
    project_url: 'https://surfside-software.com',
    github_url: '',
    technologies: ['TypeScript', 'TanStack Start', 'Effect', 'Cloudflare Workers', 'D1', 'MCP'],
    featured: true,
    highlighted: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Intelligent Irrigation',
    description: 'Irrigation design software for Corexis that generates more efficient designs to save water and money.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Ruby on Rails', 'PostgreSQL', 'PostGIS', 'Python', 'EPANET', 'Stimulus'],
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Permit Monitor',
    description: 'Local desktop app for Windows and macOS that tracks public building permits across Florida counties, cities, and water management districts, with Jev, a decisions/system model, built in.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Electron', 'TypeScript', 'Playwright', 'Zod'],
    featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Moke Agent',
    description: 'AI-powered AEC drawing QC review pipeline. Locates project drawings, splits PDFs by engineering discipline, runs discipline-specific AI review with Synthetic AI / Kimi K2.5 and an OpenRouter fallback, and generates formatted review reports.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TypeScript', 'Bun', 'Effect-TS', 'OpenRouter AI', 'Zod', 'pdf-lib'],
    featured: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'AEC Project Lighthouse',
    description: 'Project management SaaS for architecture, engineering, and construction teams. Features real-time collaboration, Gantt charts, markdown editing, email notifications, and automated tests. Live at aeccloud.io.',
    image_url: '',
    project_url: 'https://www.aeccloud.io',
    github_url: '',
    technologies: ['React 19', 'TypeScript', 'Convex', 'Vite', 'Tailwind CSS', 'Vitest', 'Playwright'],
    featured: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'General AI Tooling for AEC Engineers',
    description: 'A kit for using general-purpose AI in architecture, engineering, and construction work. It combines reusable agent skills, repeatable workflows, executable Python workbooks, and feedback loops that turn one-off experiments into repeatable engineering processes.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Agent Skills', 'Reusable Workflows', 'Python Workbooks', 'Feedback Loops'],
    featured: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'Moke Script',
    description: 'AI-powered planset review and comparison tool for construction drawings. Ships as a desktop CLI for Windows, macOS, and Linux that reviews or diffs PDF plansets into an HTML report, plus a hosted SvelteKit web app on Cloudflare with review jobs, auth, and D1/R2 storage.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['SvelteKit', 'TypeScript', 'Cloudflare Workers', 'D1', 'R2', 'Codex CLI', 'pdf-to-img'],
    featured: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    title: 'ScoutWork',
    description: 'AI-powered job search and recruiting platform with chat-based matching and a dark "Night Desk" theme. Aggregates listings via SerpApi, runs chat on Cloudflare Workers AI, stores data in D1 with résumé uploads in R2, and gates access with magic-link email auth.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['TanStack Start', 'React', 'TypeScript', 'Cloudflare Workers', 'D1', 'R2', 'Workers AI', 'SerpApi'],
    featured: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 9,
    title: 'BricsCAD / AutoCAD MCP Server',
    description: 'Code-mode MCP integration for AI-assisted drafting in BricsCAD alongside an isolated AutoCAD connector. A Python stdio server attaches to the running CAD session over Windows COM, serializes spool jobs, executes generated PyRx code inside BricsCAD, and returns structured results with transaction rollback.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Python 3.12', 'FastMCP', 'PyRx', 'Windows COM', 'JSON-RPC'],
    featured: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 10,
    title: 'Snip-it',
    description: 'Chrome Manifest V3 extension for capturing excerpts from building, fire, and electrical codes during code research. Clips and organizes citations, indexes them with fuzzy search, and syncs to Dropbox so references can be re-found later.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['WXT', 'Svelte 5', 'TypeScript', 'MiniSearch', 'Dexie', 'Dropbox SDK'],
    featured: false,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 11,
    title: 'Link Converter Utilities',
    description: 'Two web services that convert shared links. One rewrites Apple Maps links in incoming SMS/RCS messages to Google Maps links. The other converts Apple Music links to Spotify using the Odesli API with a Spotify search fallback.',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: ['Go', 'TypeScript', 'React 19', 'SQLite', 'Spotify API', 'Docker'],
    featured: false,
    display_order: 11,
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
