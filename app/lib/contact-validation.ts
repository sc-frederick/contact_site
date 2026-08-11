import { z } from 'zod';

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
  turnstileToken: 2048,
} as const;

export const contactSubmitSchema = z.strictObject({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(CONTACT_LIMITS.name, `Name must be at most ${CONTACT_LIMITS.name} characters long`),
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .max(CONTACT_LIMITS.email, 'Email address is too long')
    .email('Please provide a valid email address')
    .transform((email) => email.toLowerCase()),
  subject: z
    .string({ error: 'Subject must be text' })
    .trim()
    .max(
      CONTACT_LIMITS.subject,
      `Subject must be at most ${CONTACT_LIMITS.subject} characters long`,
    ),
  message: z
    .string({ error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters long')
    .max(
      CONTACT_LIMITS.message,
      `Message must be at most ${CONTACT_LIMITS.message} characters long`,
    ),
  turnstileToken: z
    .string({ error: 'Bot verification is required' })
    .min(1, 'Bot verification is required')
    .max(CONTACT_LIMITS.turnstileToken, 'Bot verification token is invalid'),
});

export type ContactSubmitPayload = z.infer<typeof contactSubmitSchema>;
