import { env } from 'cloudflare:workers';
import type { ContactFormData, ContactSubmission } from '~/types';

interface InsertedContactSubmission {
  id: number;
  created_at: string;
}

export async function createContactSubmission(
  data: ContactFormData,
): Promise<ContactSubmission> {
  const inserted = await env.DB.prepare(
    `INSERT INTO contact_submissions (name, email, subject, message)
     VALUES (?1, ?2, ?3, ?4)
     RETURNING id, created_at`,
  )
    .bind(data.name, data.email, data.subject, data.message)
    .first<InsertedContactSubmission>();

  if (!inserted) {
    throw new Error('Contact submission insert returned no row');
  }

  return {
    ...data,
    id: inserted.id,
    ip_address: null,
    user_agent: null,
    status: 'pending',
    created_at: inserted.created_at,
  };
}
