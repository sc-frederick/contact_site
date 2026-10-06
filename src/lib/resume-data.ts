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
  title: 'MEP Staff Engineer | IT Manager | Web & SEO Operations',
  summary:
    'Engineer at Advanced Engineering Consultants with over 4 years of experience in MEP design, IT operations, and website management. Lead engineering design and documentation, manage internal technology infrastructure and support, and oversee WordPress-based website maintenance and SEO improvements.',
  experience: [
    {
      id: 5,
      company: 'Corexis',
      title: 'Software Contributor',
      startDate: '2026',
      endDate: null,
      description: [
        'Building the Intelligent Irrigation MVP, irrigation design software that generates more efficient designs to save water and money. Currently rebuilding the engine around a hydraulics-to-layout feedback loop.',
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
        'Provide day-to-day troubleshooting and technical support for workstations, software, and network-connected devices',
        'Manage software licensing, user access, and renewals to maintain compliance and reduce downtime',
        'Handle PC provisioning, onboarding setup, hardware upgrades, and system standardization across the office',
        'Administer network infrastructure and firewall configurations, including access policies and security hardening',
        'Support internal IT operations planning, vendor coordination, and documentation of technical procedures',
      ],
      technologies: [
        'IT Support',
        'Network Administration',
        'Firewall Management',
        'PC Provisioning',
        'Software License Management',
        'Windows',
        'Microsoft 365',
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
        'Manage on-page SEO strategy for the company website, including metadata, content structure, and technical SEO best practices',
        'Maintain and update website content, pages, and assets to ensure accuracy, performance, and consistent branding',
        'Monitor search visibility and traffic trends, then implement iterative improvements based on analytics and user behavior',
        'Optimize site performance, mobile responsiveness, and accessibility to improve user experience and search ranking signals',
        'Coordinate website updates with internal teams to support recruiting, project showcases, and service offerings',
      ],
      technologies: [
        'WordPress',
        'Beaver Builder',
        'Yoast SEO',
        'Google Search Console',
        'Google Analytics',
        'On-Page SEO',
        'Technical SEO',
        'Website Maintenance',
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
        'Develop internal automation tools and CAD plugins for engineering workflows',
        'Perform engineering calculations, load analyses, and code compliance reviews',
        'Prepare construction documents and engineering drawings using AutoCAD and Revit',
        'Mentor junior engineers and interns on technical standards and software tools',
        'Building internal software tools that automate engineering calculations and permit tracking',
        'Directing AI coding agents to ship full-stack apps used in real engineering workflows',
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
        'Critical Thinking',
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
        'Next.js',
        'Effect-TS',
        'Bun',
        'Node.js',
        'Go',
        'Python',
        'AutoLISP',
        'Laravel/PHP',
        'Tailwind CSS',
        'Drizzle ORM',
        'Prisma',
        'PostgreSQL',
        'SQLite',
        'Turso',
        'Convex',
        'Docker',
        'Cloudflare Workers',
        'AI SDK',
        'MCP Protocol',
        'AI Agents',
      ],
    },
    {
      name: 'Other',
      skills: [
        'Network Administration',
        'Network Security',
        'IT',
        'Peer Mentoring',
        'Adobe Photoshop',
      ],
    },
  ],
};
