/** A role in the existing work history. */
export interface Experience {
  id: number;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  description: string[];
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
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

/** Existing resume content, preserved through the framework port. */
export const resumeData: ResumeData = {
  name: 'Stephen Frederick',
  title: 'MEP engineer · builds engineering software',
  summary:
    'MEP engineer at Advanced Engineering Consultants with over 5 years of experience in MEP design, cross-trained in structural and civil work. Also run the firm’s IT and website, and build software that automates engineering calculations, drawing review, and permit tracking, increasingly by directing AI coding agents.',
  experience: [
    {
      id: 6,
      company: 'Surfside Software',
      title: 'Founder',
      startDate: '2026',
      endDate: null,
      description: [
        'Building engineering software for people and AI agents. Forewit keeps electrical panel schedules and feeder calculations in shared project data that engineers and their agents use through a remote MCP server.',
        'Shipping open-source tools: Second Set, a desktop app for reviewing engineering drawing sets before submittal, and tsdraft, a TypeScript library for writing 2D CAD drawings that export to DXF and SVG.',
      ],
      technologies: [
        'TypeScript',
        'SvelteKit',
        'Effect',
        'Electron',
        'Cloudflare Workers',
        'D1',
        'MCP',
      ],
    },
    {
      id: 5,
      company: 'Corexis',
      title: 'Software Contributor',
      startDate: 'Sep 2026',
      endDate: null,
      description: [
        'Building the Intelligent Irrigation MVP, irrigation design software that generates more efficient designs to save water and money.',
        'Porting the app from Rails to SvelteKit on Cloudflare and rebuilding the engine around a hydraulics-to-layout feedback loop.',
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
    {
      id: 3,
      company: 'Advanced Engineering Consultants LLC',
      title: 'Engineering Staff',
      location: 'Tampa, FL',
      startDate: 'Aug 2021',
      endDate: null,
      description: [
        'Design MEP systems for commercial, residential, and institutional projects',
        'Cross-trained in structural and civil engineering disciplines',
        'Perform engineering calculations, load analyses, and code compliance reviews',
        'Prepare construction documents and engineering drawings using AutoCAD and Revit',
        'Mentor junior engineers and interns on technical standards and software tools',
        'Build internal software, often by directing AI coding agents, that automates engineering calculations, drawing review, and permit tracking',
      ],
      technologies: [
        'AutoCAD',
        'Revit',
        'RightSuite Universal',
        'Python',
        'TypeScript',
        'BricsCAD',
      ],
    },
    {
      id: 1,
      company: 'Advanced Engineering Consultants LLC',
      title: 'IT Manager',
      location: 'Tampa, FL',
      startDate: 'Aug 2021',
      endDate: null,
      description: [
        'Administer network infrastructure and firewall configuration, including access policies and security hardening',
        'Provision, standardize, and support workstations, software licenses, and user access across the office',
      ],
    },
    {
      id: 2,
      company: 'Advanced Engineering Consultants LLC',
      title: 'Website SEO & Maintenance',
      location: 'Tampa, FL',
      startDate: 'Nov 2025',
      endDate: null,
      description: [
        'Run on-page and technical SEO for the company website, including metadata, content structure, performance, and accessibility',
        'Maintain site content for recruiting, project showcases, and services, and iterate based on search and analytics data',
      ],
    },
    {
      id: 4,
      company: 'Advanced Engineering Consultants LLC',
      title: 'Engineering Intern',
      location: 'Tampa, FL',
      startDate: 'Feb 2021',
      endDate: 'Aug 2021',
      description: [
        'Assisted with MEP design and drafting for commercial and residential projects',
        'Performed site inspections and prepared field reports',
        'Created technical drawings and assisted with engineering calculations',
      ],
      technologies: ['AutoCAD', 'Revit', 'Excel'],
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
        'MEP Engineering',
        'Structural Engineering',
        'Civil Engineering',
        'Project Management',
        'Engineering Drawings',
        'Civil Engineering Drafting',
        'Report Writing',
        'AutoCAD',
        'Revit',
        'RightSuite Universal',
      ],
    },
    {
      name: 'Development',
      skills: [
        'TypeScript',
        'React 19',
        'SvelteKit',
        'Svelte 5',
        'TanStack (Start/Router)',
        'Effect-TS',
        'Bun',
        'Node.js',
        'Go',
        'Python',
        'AutoLISP',
        'Laravel/PHP',
        'Tailwind CSS',
        'Drizzle ORM',
        'PostgreSQL',
        'SQLite',
        'Convex',
        'Docker',
        'Cloudflare Workers',
        'Durable Objects',
        'Alchemy',
        'Hono',
        'Electron',
        'Rust',
        'AI SDK',
        'MCP Protocol',
        'AI Agents',
      ],
    },
    {
      name: 'Other',
      skills: ['Network Administration', 'Network Security', 'Adobe Photoshop'],
    },
  ],
};
