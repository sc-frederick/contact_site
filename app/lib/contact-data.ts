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
    { label: "Work", address: "sfrederick@advanced-engineers.com" },
    { label: "Personal", address: "sfred.mail@gmail.com" },
  ],
  phone: { label: "Mobile", number: "+1 (813) 406-0178" },
  websites: [
    { label: "Portfolio", url: "https://sfrederick.dev/portfolio" },
    { label: "Company", url: "https://advanced-engineers.com" },
  ],
  github: "https://github.com/sc-frederick",
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
