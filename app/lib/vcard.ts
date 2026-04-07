import type { ContactInfo } from "./contact-data";

export function generateVCard(contact: ContactInfo): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.name}`,
    `N:${contact.name.split(" ").reverse().join(";")};;;`,
    `ORG:${contact.company}`,
    `TITLE:${contact.title}`,
    `ADR:;;${contact.location};;;;`,
  ];

  // Add emails
  contact.emails.forEach((email) => {
    lines.push(`EMAIL;TYPE=${email.label.toLowerCase()}:${email.address}`);
  });

  // Add phone
  lines.push(`TEL;TYPE=${contact.phone.label.toLowerCase()}:${contact.phone.number}`);

  // Add websites
  contact.websites.forEach((site) => {
    lines.push(`URL;TYPE=${site.label.toLowerCase()}:${site.url}`);
  });

  // Add GitHub
  lines.push(`URL;TYPE=github:${contact.github}`);

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(contact: ContactInfo): void {
  const vcardContent = generateVCard(contact);
  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${contact.name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
