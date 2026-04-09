import type { ContactInfo } from "./contact-data";

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function generateVCard(contact: ContactInfo): string {
  const nameParts = contact.name.trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const firstAndMiddle = nameParts.slice(0, -1).join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(contact.name)}`,
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstAndMiddle)};;;`,
    `ORG:${escapeVCardValue(contact.company)}`,
    `TITLE:${escapeVCardValue(contact.title)}`,
    `ADR:;;${escapeVCardValue(contact.location)};;;;`,
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

export function createVCardBlob(contact: ContactInfo): Blob {
  const vcardContent = generateVCard(contact);
  return new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
}

export function downloadVCard(contact: ContactInfo): void {
  const blob = createVCardBlob(contact);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${contact.name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
