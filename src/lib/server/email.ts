import type { ContactFormData } from '../types';

/** Fixed sender and recipient configuration parsed by the Cloudflare adapter. */
export interface ContactMailConfiguration {
  readonly fromName: string;
  readonly fromEmail: string;
  readonly toEmail: string;
}

// Collapse CR/LF/tabs to single spaces for any value placed in a header (the Subject).
function oneLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

// Escape user content interpolated into the HTML body.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Build escaped notification content and fixed-recipient headers for the email binding. */
export function buildContactNotification(
  input: ContactFormData,
  submittedAt: string,
  config: ContactMailConfiguration,
) {
  const name = oneLine(input.name) || 'Anonymous';
  const email = input.email.trim();
  const subject = oneLine(input.subject || '') || '(no subject)';
  const message = input.message;

  const mailSubject = oneLine(
    `New contact form message from ${name} — ${subject}`,
  );

  const textBody = [
    'New message from the sfrederick.dev contact form',
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    `Time:    ${submittedAt}`,
    '',
    'Message:',
    message,
    '',
    `— Reply directly to this email to respond to ${name}.`,
  ].join('\n');

  const htmlBody = `<!doctype html>
<html>
  <body style="margin:0;background:#f5f5f5;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
      <div style="padding:20px 24px;background:#0f172a;color:#ffffff;">
        <h1 style="margin:0;font-size:16px;font-weight:600;">New contact form message</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">via sfrederick.dev</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:14px 24px 0;color:#64748b;width:80px;">Name</td><td style="padding:14px 24px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 24px 0;color:#64748b;">Email</td><td style="padding:8px 24px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 24px 0;color:#64748b;">Subject</td><td style="padding:8px 24px 0;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding:8px 24px 14px;color:#64748b;">Time</td><td style="padding:8px 24px 14px;color:#475569;">${escapeHtml(submittedAt)}</td></tr>
      </table>
      <div style="padding:0 24px 4px;color:#64748b;font-size:14px;">Message</div>
      <div style="margin:4px 24px 20px;padding:14px 16px;background:#f8fafc;border:1px solid #e5e5e5;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.5;">${escapeHtml(message)}</div>
      <div style="padding:14px 24px;border-top:1px solid #e5e5e5;color:#94a3b8;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(name)}.</div>
    </div>
  </body>
</html>`;

  return {
    from: { name: config.fromName, email: config.fromEmail },
    to: config.toEmail,
    replyTo: { name, email },
    subject: mailSubject,
    text: textBody,
    html: htmlBody,
  };
}
