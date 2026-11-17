import type { PortfolioItem } from '#lib/types.ts';
import forewitPanel from '#lib/assets/projects/forewit-panel.webp';
import forewitPanelSmall from '#lib/assets/projects/forewit-panel-720.webp';
import permitMonitor from '#lib/assets/projects/permit-monitor.webp';
import permitMonitorSmall from '#lib/assets/projects/permit-monitor-720.webp';
import secondSet from '#lib/assets/projects/second-set-workbench.webp';
import secondSetSmall from '#lib/assets/projects/second-set-workbench-720.webp';
import tsdraftDrawing from '#lib/assets/projects/tsdraft-a101.webp';
import tsdraftDrawingSmall from '#lib/assets/projects/tsdraft-a101-720.webp';

/**
 * Repository-backed portfolio content, independent of the contact database.
 * Stacks and status were last checked against each project's repository on
 * 2026-11-16.
 */
export const portfolioItems: readonly PortfolioItem[] = [
  {
    id: 13,
    title: 'tsdraft',
    summary:
      '2D CAD drawings as TypeScript, free on npm. Writes DXF, SVG, and PDF with layers, blocks, dimensions, and title blocks.',
    description:
      'A TypeScript library for writing 2D CAD drawings as code. The MIT library on npm writes DXF, SVG, and PDF, with layers, blocks with attributes, DWG xrefs, dimensions, and plotted layouts with title blocks, and reads DXF back. Its DWG writer produces files that AutoCAD opens and plots, using no Autodesk or ODA libraries. It is unreleased and will run behind a planned paid hosted API that reads, writes, and edits DWG. Its examples include a 15-sheet residential permit set built from one house model, written as DXF and SVG.',
    image: {
      src: tsdraftDrawing,
      srcSmall: tsdraftDrawingSmall,
      width: 1400,
      height: 933,
      alt: 'tsdraft example: sheet A-101, a first floor plan with dimensions, notes, and a title block',
    },
    status: 'Live',
    owner: 'Surfside Software',
    project_url: 'https://www.npmjs.com/package/tsdraft',
    github_url: 'https://github.com/Surfside-Software/tsdraft',
    technologies: ['TypeScript', 'DXF', 'SVG', 'Node.js'],
    display_order: 1,
  },
  {
    id: 1,
    title: 'Forewit',
    summary:
      'Electrical calculations for buildings: panel schedules, riser diagrams, voltage drop, fault current, and Article 220 loads. Live as a demo, with an MCP server for agents.',
    description:
      'Electrical calculations for buildings: panel schedules, riser diagrams, voltage drop, available fault current, and NEC Article 220 loads. The public demo runs them in a web app, and agents connect through MCP to the same project data. Voltage drop, fault current, and load results stay flagged until their table values are checked against the code book. Next is a source-available library and CLI that turns a project into its schedules, diagrams, and reports as files. A paid hosted API is planned.',
    image: {
      src: forewitPanel,
      srcSmall: forewitPanelSmall,
      width: 1400,
      height: 875,
      alt: 'Forewit demo: panel schedule H-1 with circuits, breaker sizes, voltage drop, and an issues sidebar',
    },
    status: 'In development',
    owner: 'Surfside Software',
    project_url: 'https://surfside-software.com/forewit',
    github_url: null,
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
    display_order: 2,
  },
  {
    id: 12,
    title: 'Second Set',
    summary:
      'A desktop app that gives a drawing set a second review before submittal, with code citations on every finding.',
    description:
      "A desktop app, in development, that reviews a drawing set before submittal. It checks each sheet for completeness, Florida code requirements, coordination between disciplines, and responses to prior comments, and cites the code section behind each finding. It uses Meta's SAM 3.1 model to find and count devices and fixtures on the drawings. The first version was built during the Meta AI Developer Hackathon sprint.",
    image: {
      src: secondSet,
      srcSmall: secondSetSmall,
      width: 1400,
      height: 788,
      alt: 'Second Set workbench: a finished review of a five-sheet grading set with its list of findings',
    },
    status: 'In development',
    owner: 'Surfside Software',
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
    display_order: 3,
  },
  {
    id: 3,
    title: 'Permit Monitor',
    summary:
      'Watches Florida permit portals on a schedule and flags every status change.',
    description:
      'Desktop app for Windows and macOS that tracks building permits on Florida county and city portals and all five water management districts. It checks each portal on a schedule, records the verified status, and notifies on changes. TypeSafe’s Jev model picks the next step when a portal page is ambiguous.',
    image: {
      src: permitMonitor,
      srcSmall: permitMonitorSmall,
      width: 1400,
      height: 916,
      alt: 'Permit Monitor: permits grouped by project with status, required action, and last verified check',
    },
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
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
    display_order: 4,
  },
  {
    id: 4,
    title: 'Moke',
    summary:
      "AI quality control for permit drawing sets. Since June 2026 it has reviewed sets for 19 of the firm's projects.",
    description:
      "Reviews permit drawing sets for quality control. A lead agent hands each discipline to its own subagent, and the result is an HTML report with the coverage, sources, and evidence behind each finding and a checkbox for each correction. Since June 2026 it has reviewed drawing sets for 19 of Advanced Engineering's projects. It runs as a desktop app, a CLI, and a hosted SvelteKit app on Cloudflare.",
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
    project_url: null,
    github_url: null,
    technologies: [
      'TypeScript',
      'Electron',
      'Svelte 5',
      'Effect',
      'OpenCode',
      'SQLite',
      'Cloudflare D1 and R2',
    ],
    display_order: 5,
  },
  {
    id: 5,
    title: 'AEC Project Lighthouse',
    summary:
      "The firm's project management app, rebuilt as a multi-tenant app on Cloudflare with real-time updates and an MCP endpoint.",
    description:
      "Advanced Engineering's project management app, rebuilt as a multi-tenant app on Cloudflare at aeccloud.io. Each organization's data lives in a separate Durable Object database, and changes reach members in real time. It supports passkey sign-in, checks permit status on public county portals, and has an MCP endpoint that lets an AI agent make any change its user could make, within that user's role.",
    status: 'Live',
    owner: 'Advanced Engineering Consultants',
    project_url: 'https://www.aeccloud.io',
    github_url: null,
    technologies: [
      'SvelteKit',
      'Effect',
      'Cloudflare Workers',
      'Durable Objects',
      'D1',
      'R2',
      'Playwright',
    ],
    display_order: 6,
  },
  {
    id: 14,
    title: 'AEC Plan Search',
    summary:
      'Search every project drawing for a construction detail and jump to the source page.',
    description:
      'Windows desktop search across a firm’s project drawings for construction details. It previews the matching page, opens the source PDF or the project’s Dropbox folder, and keeps the shared index in Cloudflare D1. Updates install from a signed release feed.',
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
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
    display_order: 7,
  },
  {
    id: 6,
    title: 'AI Tooling for AEC Engineers',
    summary:
      'Agent skills that draft inspection reports, research codes, and check energy compliance, taught to staff.',
    description:
      'Agent skills and workflows for an engineering firm: drafting inspection reports from field notes and photos, researching Florida building codes, generating COMcheck energy compliance inputs, and reviewing permit drawings. Taught to staff in an AI seminar with live demos of site visit reports, client intake, and email drafting.',
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
    project_url: null,
    github_url: null,
    technologies: ['Agent Skills', 'Claude Code', 'Codex', 'T3 Code', 'MCP'],
    display_order: 8,
  },
  {
    id: 9,
    title: 'BricsCAD / AutoCAD MCP Server',
    summary:
      'Lets an AI agent draft in a running BricsCAD session, with each job rolled back on failure.',
    description:
      'Code-mode MCP integration for AI-assisted drafting in BricsCAD alongside an isolated AutoCAD connector. A Python stdio server attaches to the running CAD session over Windows COM, serializes spool jobs, executes generated PyRx code inside BricsCAD, and returns structured results with transaction rollback.',
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
    project_url: null,
    github_url: null,
    technologies: ['Python 3.12', 'FastMCP', 'PyRx', 'Windows COM', 'BricsCAD'],
    display_order: 9,
  },
  {
    id: 10,
    title: 'Snip-it',
    summary:
      'A Chrome extension that clips and indexes building code excerpts during research.',
    description:
      'Chrome extension for capturing excerpts from building, fire, and electrical codes during code research. Clips and organizes citations, indexes them with fuzzy search, and syncs to Dropbox so references can be found again later.',
    status: 'Internal',
    owner: 'Advanced Engineering Consultants',
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
    display_order: 10,
  },
  {
    id: 2,
    title: 'Intelligent Irrigation',
    summary:
      'Irrigation design software for Corexis that generates layouts that use less water.',
    description:
      'Irrigation design software for Corexis that generates more efficient designs to save water and money. The app is moving from Rails to SvelteKit on Cloudflare, with a native Python and Rust hydraulics engine built on EPANET.',
    status: 'In development',
    owner: 'Other',
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
    display_order: 11,
  },
  {
    id: 8,
    title: 'ScoutWork',
    summary: 'Job search with chat-based matching across aggregated listings.',
    description:
      'AI-powered job search and recruiting platform with chat-based matching. Aggregates listings through SerpApi, runs chat on Cloudflare Workers AI, stores data in D1 with résumé uploads in R2, and gates access with magic-link email sign-in.',
    status: 'Live',
    owner: 'Other',
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
    display_order: 12,
  },
  {
    id: 11,
    title: 'Link Converter Utilities',
    summary:
      'Two Workers that turn Apple Maps and Apple Music links into Google Maps and Spotify links.',
    description:
      'Two Cloudflare Workers that fix links shared to an Android phone. One rewrites Apple Maps links in incoming texts as Google Maps links; the other turns Apple Music links into Spotify links through Odesli, with a Spotify search fallback and a D1 cache.',
    status: 'Internal',
    owner: 'Other',
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
    display_order: 13,
  },
];
