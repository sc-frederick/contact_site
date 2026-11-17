/** A named piece of work inside a role, with the stack that built it. */
export interface RoleProject {
  name: string;
  detail: string;
  stack: string[];
}

/** A role in the work history. */
export interface Experience {
  id: number;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  /** Optional heading and entries for software built within the role. */
  projectsHeading?: string;
  projects?: RoleProject[];
  technologies?: string[];
}

/** An education record displayed on the resume. */
export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
}

/** A named group of resume skills. */
export interface SkillCategory {
  name: string;
  skills: string[];
}

/** The content rendered by the resume page. */
export interface ResumeData {
  name: string;
  title: string;
  /** Where and how the person is open to work. */
  availability: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

/**
 * Resume content, kept in step with Stephen_Frederick_Resume (the PDF served
 * from /Stephen_Frederick_Resume.pdf).
 */
export const resumeData: ResumeData = {
  name: 'Stephen Frederick',
  title: 'MEP Designer and Software Developer',
  availability:
    'Open to remote or hybrid work in Florida, or on-site work in San Francisco or New York.',
  summary:
    'I am an MEP designer with more than five years at Advanced Engineering Consultants in Tampa, where I design building systems, run IT, and build the firm’s internal software by directing AI coding agents. All eight people in the office use that software on live projects to review permit drawing sets, track permits, and manage projects. I also built MCP servers that let AI agents draft in live BricsCAD and AutoCAD sessions. On my own time I run Surfside Software, where I build tsdraft (CAD drawings in TypeScript) and Forewit (electrical calculations for buildings). I am looking for work that combines the AEC industry with AI agents.',
  experience: [
    {
      id: 1,
      company: 'Advanced Engineering Consultants LLC',
      title: 'Engineering Staff, MEP',
      location: 'Tampa, FL',
      startDate: 'Aug 2021',
      endDate: null,
      description: [
        'Design mechanical, electrical, and plumbing systems for commercial, residential, and institutional projects. Run the calculations and load analyses and produce the construction documents in AutoCAD, BricsCAD, and Revit.',
        'Review designs for code compliance and handle construction administration, including site inspections and field reports. Cross-trained in structural and civil engineering.',
        'Mentor junior engineers and interns on firm standards and tools.',
      ],
      projectsHeading: 'Internal software, built by directing AI coding agents',
      projects: [
        {
          name: 'BricsCAD and AutoCAD MCP servers',
          detail:
            'Let AI agents draft in a live CAD session. The BricsCAD server queues jobs through Windows COM, runs PyRx code that the agent writes, and rolls back the transaction if a job fails.',
          stack: ['Python', 'FastMCP', 'PyRx'],
        },
        {
          name: 'Moke',
          detail:
            'Reviews permit drawing sets for quality control. A lead agent hands each discipline to its own subagent, and the result is an HTML report with the coverage, sources, and evidence behind each finding and a checkbox for each correction. Since June 2026 it has reviewed drawing sets for 19 of the firm’s projects. It runs as a desktop app, a CLI, and a hosted SvelteKit app on Cloudflare.',
          stack: [
            'TypeScript',
            'Electron',
            'Svelte 5',
            'Effect',
            'OpenCode',
            'SQLite',
            'Cloudflare D1 and R2',
          ],
        },
        {
          name: 'Project Lighthouse',
          detail:
            'The firm’s project management app, rebuilt as a multi-tenant app on Cloudflare at aeccloud.io. Each organization’s data lives in a separate Durable Object database, and changes reach members in real time. It supports passkey sign-in, checks permit status on public county portals, and has an MCP endpoint that lets an AI agent make any change its user could make, within that user’s role.',
          stack: [
            'SvelteKit',
            'Effect',
            'Cloudflare Workers',
            'Durable Objects',
            'D1',
            'R2',
            'Playwright',
          ],
        },
        {
          name: 'Permit Monitor',
          detail:
            'A Windows and macOS desktop app that tracks building permits on Florida county and city portals and all five water management districts. It checks each portal on a schedule, records the status, and sends a notice when it changes.',
          stack: ['Electron', 'TypeScript', 'Playwright', 'Zod', 'SQLite'],
        },
        {
          name: 'Other tools',
          detail:
            'A desktop search for project drawings and reviewed details, a Chrome extension that clips and searches building, fire, and electrical code citations, a COMcheck energy report generator, a phishing checker for staff, and a shared library of agent skills for engineering work.',
          stack: [],
        },
      ],
    },
    {
      id: 2,
      company: 'Advanced Engineering Consultants LLC',
      title: 'IT Manager',
      location: 'Tampa, FL',
      startDate: 'Aug 2021',
      endDate: null,
      description: [
        'Run office IT: workstation and software support, PC provisioning and onboarding, software licensing, and Microsoft 365.',
        'Administer the office network and firewall, including access policies and security settings.',
        'Since Nov 2025, maintain the firm’s WordPress website and its on-page and technical SEO using Google Search Console and Analytics.',
      ],
    },
    {
      id: 3,
      company: 'Surfside Software',
      title: 'Founder and Developer',
      startDate: '2026',
      endDate: null,
      description: [],
      projects: [
        {
          name: 'tsdraft',
          detail:
            'A TypeScript library, MIT and on npm, for writing 2D CAD drawings as code. It writes DXF, SVG, and PDF, with layers, blocks with attributes, DWG xrefs, dimensions, and plotted layouts with title blocks, and reads DXF back. Its unreleased DWG writer produces files that AutoCAD opens and plots, using no Autodesk or ODA libraries, and will run behind a planned paid hosted API. Its examples include a 15-sheet residential permit set built from one house model, written as DXF and SVG.',
          stack: [],
        },
        {
          name: 'Forewit',
          detail:
            'Electrical calculations for buildings: panel schedules, riser diagrams, voltage drop, available fault current, and NEC Article 220 loads. The public demo runs them in a web app, and agents connect through MCP to the same project data. Voltage drop, fault current, and load results stay flagged until their table values are checked against the code book. Next is a source-available library and CLI that turns a project into its schedules, diagrams, and reports as files.',
          stack: [
            'TypeScript',
            'SvelteKit',
            'Effect',
            'Cloudflare Workers',
            'D1',
            'Alchemy',
            'MCP',
          ],
        },
        {
          name: 'Second Set',
          detail:
            'A desktop app, in development, that reviews a drawing set before submittal. It checks each sheet for completeness, Florida code requirements, coordination between disciplines, and responses to prior comments, and cites the code section behind each finding. It uses Meta’s SAM 3.1 model to find and count devices and fixtures. Built the first version during the Meta AI Developer Hackathon sprint.',
          stack: [],
        },
      ],
    },
    {
      id: 4,
      company: 'Corexis',
      title: 'Software Contributor',
      startDate: 'Sep 2026',
      endDate: null,
      description: [
        'Build Intelligent Irrigation, which designs irrigation layouts with the goal of cutting water use and cost. Moving the app from Rails to SvelteKit on Cloudflare, with a Python and Rust hydraulics engine built on EPANET.',
      ],
      technologies: [
        'TypeScript',
        'SvelteKit',
        'Effect',
        'Cloudflare Workers',
        'Python',
        'Rust',
        'EPANET',
      ],
    },
  ],
  education: [
    {
      id: 1,
      institution: 'University of South Florida',
      degree: 'Bachelor of Science',
      field: 'Industrial Engineering',
      location: 'Tampa, FL',
      startDate: '2018',
      endDate: '2025',
    },
  ],
  skills: [
    {
      name: 'Engineering',
      skills: [
        'MEP design',
        'Electrical load calculations and panel schedules',
        'Code compliance review',
        'Construction documents',
        'Construction administration',
        'Structural and civil cross-training',
      ],
    },
    {
      name: 'Engineering software',
      skills: [
        'AutoCAD',
        'BricsCAD',
        'Revit',
        'RightSuite Universal',
        'COMcheck',
        'AutoLISP',
      ],
    },
    {
      name: 'AI tooling',
      skills: [
        'T3 Code',
        'Claude',
        'Codex',
        'Grok',
        'MCP servers',
        'Agent skills',
        'AI SDK',
        'OpenRouter',
        'Multi-model review pipelines',
      ],
    },
    {
      name: 'Languages and frameworks',
      skills: [
        'TypeScript',
        'Python',
        'Rust',
        'Go',
        'Ruby on Rails',
        'PHP and Laravel',
        'React 19',
        'SvelteKit',
        'Svelte 5',
        'TanStack Start',
        'Next.js',
        'Effect-TS',
        'Electron',
        'Tailwind CSS',
      ],
    },
    {
      name: 'Data and infrastructure',
      skills: [
        'Cloudflare Workers',
        'Durable Objects',
        'D1',
        'R2',
        'Alchemy',
        'PostgreSQL',
        'PostGIS',
        'SQLite',
        'Convex',
        'Drizzle',
        'Docker',
        'Bun',
        'Node.js',
      ],
    },
    {
      name: 'IT',
      skills: [
        'Network and firewall administration',
        'Windows',
        'Microsoft 365',
        'WordPress',
        'SEO',
      ],
    },
  ],
};
