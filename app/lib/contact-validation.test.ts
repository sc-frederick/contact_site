import { describe, expect, it } from 'vitest';
import { CONTACT_LIMITS, contactSubmitSchema } from './contact-validation';

const validSubmission = {
  name: 'Stephen Frederick',
  email: 'Stephen@Example.com',
  subject: 'Hello',
  message: 'This is a valid contact message.',
  turnstileToken: 'turnstile-token',
};

describe('contactSubmitSchema', () => {
  it('normalizes bounded contact data', () => {
    const parsed = contactSubmitSchema.parse(validSubmission);
    expect(parsed.email).toBe('stephen@example.com');
    expect(parsed.name).toBe('Stephen Frederick');
  });

  it('rejects unknown client-controlled fields', () => {
    expect(() =>
      contactSubmitSchema.parse({ ...validSubmission, ip_address: '203.0.113.7' }),
    ).toThrow();
  });

  it('rejects oversized identity and verification fields', () => {
    expect(() =>
      contactSubmitSchema.parse({ ...validSubmission, name: 'a'.repeat(CONTACT_LIMITS.name + 1) }),
    ).toThrow();
    expect(() =>
      contactSubmitSchema.parse({
        ...validSubmission,
        turnstileToken: 'a'.repeat(CONTACT_LIMITS.turnstileToken + 1),
      }),
    ).toThrow();
  });

  it('rejects non-string values', () => {
    expect(() => contactSubmitSchema.parse({ ...validSubmission, name: false })).toThrow();
  });
});
