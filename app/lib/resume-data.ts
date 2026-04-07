// Resume data structure and content

export interface Experience {
  id: number;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  technologies?: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
}

export const resumeData: ResumeData = {
  name: "Stephen Frederick",
  title: "Staff Engineer & Fullstack Developer",
  summary:
    "Experienced Staff Engineer with 10+ years in civil, structural, and MEP engineering. Passionate about bridging the gap between traditional engineering and modern software development. Specializing in building developer tools, automation systems, and digital products for the engineering industry.",
  experience: [
    {
      id: 1,
      company: "Advanced Engineering Consultants",
      title: "Staff Engineer",
      location: "Tampa, FL",
      startDate: "2019-01",
      endDate: null,
      description: [
        "Lead engineering projects from concept to completion across civil, structural, and MEP disciplines",
        "Develop internal automation tools that reduced project delivery time by 30%",
        "Mentor junior engineers and establish engineering standards and best practices",
        "Collaborate with cross-functional teams to deliver complex building design projects",
      ],
      technologies: ["AutoCAD", "Revit", "Python", "BIM 360"],
    },
    {
      id: 2,
      company: "Structural Solutions Inc.",
      title: "Senior Structural Engineer",
      location: "Miami, FL",
      startDate: "2015-06",
      endDate: "2018-12",
      description: [
        "Designed structural systems for commercial and residential buildings up to 20 stories",
        "Performed seismic and wind load analysis for high-rise structures",
        "Managed project budgets and timelines for multi-million dollar developments",
        "Implemented new CAD workflows that improved drafting efficiency by 25%",
      ],
      technologies: ["ETABS", "SAP2000", "AutoCAD", "Mathcad"],
    },
    {
      id: 3,
      company: "Metropolitan Engineering Group",
      title: "Project Engineer",
      location: "Orlando, FL",
      startDate: "2012-08",
      endDate: "2015-05",
      description: [
        "Coordinated MEP designs for healthcare and educational facilities",
        "Conducted field inspections and prepared technical reports",
        "Developed construction documentation and specifications",
        "Collaborated with architects and contractors during construction administration",
      ],
      technologies: ["AutoCAD", "Navisworks", "Bluebeam"],
    },
    {
      id: 4,
      company: "Florida Department of Transportation",
      title: "Engineering Intern",
      location: "Tallahassee, FL",
      startDate: "2011-05",
      endDate: "2012-07",
      description: [
        "Assisted in highway design and drainage analysis projects",
        "Prepared technical drawings and engineering calculations",
        "Participated in site surveys and data collection",
        "Gained exposure to public infrastructure project workflows",
      ],
      technologies: ["MicroStation", "InRoads", "Excel"],
    },
  ],
  education: [
    {
      id: 1,
      institution: "University of Florida",
      degree: "Master of Science",
      field: "Civil Engineering",
      location: "Gainesville, FL",
      startDate: "2010",
      endDate: "2012",
    },
    {
      id: 2,
      institution: "Florida State University",
      degree: "Bachelor of Science",
      field: "Civil Engineering",
      location: "Tallahassee, FL",
      startDate: "2006",
      endDate: "2010",
    },
  ],
  skills: [
    {
      name: "Engineering",
      skills: [
        "Structural Engineering",
        "Civil Engineering",
        "MEP Engineering",
        "Fire Protection",
        "Building Design",
        "Construction Documents",
        "Engineering Inspections",
        "Seismic Analysis",
        "Project Management",
      ],
    },
    {
      name: "Development",
      skills: [
        "Fullstack Web Development",
        "Developer Tools",
        "JavaScript/TypeScript",
        "React",
        "Node.js",
        "Python",
        "Cloud Services",
        "API Design",
        "Database Systems",
      ],
    },
    {
      name: "Other",
      skills: [
        "SEO / Digital Marketing",
        "Product Design",
        "AutoCAD",
        "Revit",
        "ETABS",
        "BIM 360",
        "Technical Writing",
        "Team Leadership",
      ],
    },
  ],
};
