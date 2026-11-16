import type { PortfolioItem } from '#lib/types.ts';

/**
 * Repository-backed portfolio content, independent of the contact database.
 * Stacks and status were last checked against each project's repository on
 * 2026-11-16.
 */
export const portfolioItems: readonly PortfolioItem[] = [
  {
    id: 1,
    title: 'Surfside Software',
    summary:
      'Engineering software for people and AI agents, starting with Forewit for electrical panel schedules over MCP.',
    description:
      'Engineering software for people and AI agents. Forewit keeps electrical panel schedules and feeder calculations in shared project data that engineers and their agents use through a remote MCP server.',
    status: 'In development',
    project_url: 'https://surfside-software.com',
    github_url: 'https://github.com/Surfside-Software',
    technologies: [
      'TypeScript',
      'SvelteKit',
      'Svelte 5',
      'Effect',
      'Cloudflare Workers',
      'D1',
      'Alchemy',
      'MCP',
    ],
    highlighted: true,
    featured: true,
    display_order: 1,
  },
  {
    id: 12,
    title: 'Second Set',
    summary:
      'A desktop app that gives a drawing set a second review before submittal, with code citations on every finding.',
    description:
      'Desktop app that gives an engineering drawing set a second review before submittal. It runs completeness, code, coordination, and prior-comment passes on each sheet with Florida code citations, uses SAM 3.1 to count devices and zoom to each finding, and exports an HTML report.',
    status: 'Open source',
    project_url: null,
    github_url: 'https://github.com/Surfside-Software/second-set',
    technologies: [
      'Electron',
      'Svelte 5',
      'SvelteKit',
      'TypeScript',
      'Effect',
      'Bun',
      'SQLite',
      'pdf.js',
    ],
    featured: true,
    display_order: 2,
  },
  {
    id: 13,
    title: 'tsdraft',
    summary:
      'Write 2D CAD drawings in TypeScript and export DXF for CAD or SVG for previews.',
    description:
      'Write 2D CAD drawings in TypeScript and export DXF for CAD programs or SVG for previews. Includes sheet formats, title blocks from a drafting standard, plot styles, and a lint command that checks a drawing against its standard.',
    status: 'Open source',
    project_url: 'https://www.npmjs.com/package/tsdraft',
    github_url: 'https://github.com/Surfside-Software/tsdraft',
    technologies: ['TypeScript', 'DXF', 'SVG', 'Node.js'],
    featured: true,
    display_order: 3,
  },
  {
    id: 2,
    title: 'Intelligent Irrigation',
    summary:
      'Irrigation design software for Corexis that generates layouts that use less water.',
    description:
      'Irrigation design software for Corexis that generates more efficient designs to save water and money. The app is moving from Rails to SvelteKit on Cloudflare, with a native Python and Rust hydraulics engine built on EPANET.',
    status: 'In development',
    project_url: null,
    github_url: null,
    technologies: [
      'TypeScript',
      'SvelteKit',
      'Effect',
      'Cloudflare Workers',
      'D1',
      'R2',
      'Python',
      'Rust',
      'EPANET',
    ],
    display_order: 4,
  },
  {
    id: 5,
    title: 'AEC Project Lighthouse',
    summary:
      'The project management app Advanced Engineering runs on, live at aeccloud.io.',
    description:
      'Project management app for Advanced Engineering Consultants, with real-time project data, Gantt schedules, markdown notes, and email notifications. A rebuild on SvelteKit, Effect, and Cloudflare D1 is under way.',
    status: 'Live',
    project_url: 'https://www.aeccloud.io',
    github_url: null,
    technologies: [
      'React 19',
      'TanStack Start',
      'TypeScript',
      'Convex',
      'Cloudflare Workers',
      'Tailwind CSS 4',
      'Vitest',
      'Playwright',
    ],
    display_order: 5,
  },
  {
    id: 3,
    title: 'Permit Monitor',
    summary:
      'Watches Florida permit portals on a schedule and flags every status change.',
    description:
      'Desktop app for Windows and macOS that tracks building permits on Florida county and city portals and all five water management districts. It checks each portal on a schedule, records the verified status, and notifies on changes. TypeSafe’s Jev model picks the next step when a portal page is ambiguous.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'Electron',
      'TypeScript',
      'Playwright',
      'Zod',
      'SQLite',
      'TypeSafe AI',
    ],
    display_order: 6,
  },
  {
    id: 4,
    title: 'Moke Agent',
    summary:
      'Discipline-specific AI agents review permit drawings and write an evidence-backed report.',
    description:
      'Desktop app for reviewing PDF permit drawings. A lead agent coordinates discipline subagents on OpenCode to review each sheet, then produces an offline HTML report with coverage, sources, and evidence.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'Electron',
      'Svelte 5',
      'SvelteKit',
      'TypeScript',
      'Effect',
      'OpenCode',
      'SQLite',
      'pdf.js',
    ],
    display_order: 7,
  },
  {
    id: 8,
    title: 'ScoutWork',
    summary: 'Job search with chat-based matching across aggregated listings.',
    description:
      'AI-powered job search and recruiting platform with chat-based matching. Aggregates listings through SerpApi, runs chat on Cloudflare Workers AI, stores data in D1 with résumé uploads in R2, and gates access with magic-link email sign-in.',
    status: 'Live',
    project_url: 'https://scoutwork.app',
    github_url: null,
    technologies: [
      'TanStack Start',
      'React',
      'TypeScript',
      'Cloudflare Workers',
      'D1',
      'R2',
      'Workers AI',
      'SerpApi',
    ],
    display_order: 8,
  },
  {
    id: 6,
    title: 'AI Tooling for AEC Engineers',
    summary:
      'Agent skills that draft inspection reports, research codes, and check energy compliance, taught to staff.',
    description:
      'Agent skills and workflows for an engineering firm: drafting inspection reports from field notes and photos, researching Florida building codes, generating COMcheck energy compliance inputs, and reviewing permit drawings. Taught to staff in an AI seminar with live demos of site visit reports, client intake, and email drafting.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: ['Agent Skills', 'Claude Code', 'Codex', 'T3 Code', 'MCP'],
    display_order: 9,
  },
  {
    id: 14,
    title: 'AEC Plan Search',
    summary:
      'Search every project drawing for a construction detail and jump to the source page.',
    description:
      'Windows desktop search across a firm’s project drawings for construction details. It previews the matching page, opens the source PDF or the project’s Dropbox folder, and keeps the shared index in Cloudflare D1. Updates install from a signed release feed.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'Electron',
      'Bun',
      'TypeScript',
      'Cloudflare Workers',
      'D1',
      'Dropbox',
    ],
    display_order: 10,
  },
  {
    id: 7,
    title: 'Moke Script',
    summary:
      'A CLI and web app that reviews or diffs PDF plansets into an HTML report.',
    description:
      'AI-powered planset review and comparison tool for construction drawings. Ships as a desktop CLI for Windows, macOS, and Linux that reviews or diffs PDF plansets into an HTML report, plus a hosted SvelteKit web app on Cloudflare with review jobs, auth, and D1/R2 storage.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'SvelteKit',
      'TypeScript',
      'Cloudflare Workers',
      'D1',
      'R2',
      'Codex CLI',
      'pdf-to-img',
    ],
    display_order: 11,
  },
  {
    id: 9,
    title: 'BricsCAD / AutoCAD MCP Server',
    summary:
      'Lets an AI agent draft in a running BricsCAD session, with each job rolled back on failure.',
    description:
      'Code-mode MCP integration for AI-assisted drafting in BricsCAD alongside an isolated AutoCAD connector. A Python stdio server attaches to the running CAD session over Windows COM, serializes spool jobs, executes generated PyRx code inside BricsCAD, and returns structured results with transaction rollback.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: ['Python 3.12', 'FastMCP', 'PyRx', 'Windows COM', 'BricsCAD'],
    display_order: 12,
  },
  {
    id: 10,
    title: 'Snip-it',
    summary:
      'A Chrome extension that clips and indexes building code excerpts during research.',
    description:
      'Chrome extension for capturing excerpts from building, fire, and electrical codes during code research. Clips and organizes citations, indexes them with fuzzy search, and syncs to Dropbox so references can be found again later.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'WXT',
      'Svelte 5',
      'TypeScript',
      'MiniSearch',
      'Dexie',
      'Dropbox SDK',
    ],
    display_order: 13,
  },
  {
    id: 11,
    title: 'Link Converter Utilities',
    summary:
      'Two Workers that turn Apple Maps and Apple Music links into Google Maps and Spotify links.',
    description:
      'Two Cloudflare Workers that fix links shared to an Android phone. One rewrites Apple Maps links in incoming texts as Google Maps links; the other turns Apple Music links into Spotify links through Odesli, with a Spotify search fallback and a D1 cache.',
    status: 'Internal',
    project_url: null,
    github_url: null,
    technologies: [
      'TypeScript',
      'Cloudflare Workers',
      'SvelteKit',
      'Effect',
      'Hono',
      'D1',
      'Durable Objects',
    ],
    display_order: 14,
  },
];
