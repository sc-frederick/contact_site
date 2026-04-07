export interface ContactInfo {
  name: string;
  title: string;
  company: string;
  location: string;
  emails: { label: string; address: string }[];
  phone: { label: string; number: string };
  websites: { label: string; url: string }[];
  github: string;
  services: string[];
}

export const contactData: ContactInfo = {
  name: "Stephen Frederick",
  title: "Staff Engineer",
  company: "Advanced Engineering Consultants",
  location: "Tampa, FL",
  emails: [
    { label: "Work", address: "stephen.frederick@aec-engineers.com" },
    { label: "Personal", address: "hello@stephenfrederick.com" },
  ],
  phone: { label: "Mobile", number: "+1 (555) 123-4567" },
  websites: [
    { label: "Portfolio", url: "https://stephenfrederick.com" },
    { label: "Company", url: "https://aec-engineers.com" },
  ],
  github: "https://github.com/stephenfrederick",
  services: [
    "Civil Engineering",
    "Structural Engineering",
    "MEP Engineering",
    "Fire Protection",
    "Building Design",
    "Construction Documents",
    "Engineering Inspections",
    "Fullstack Web Development",
    "Developer Tools",
    "SEO / Digital Marketing",
    "Product Design",
  ],
};
