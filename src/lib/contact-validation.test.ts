import { describe, expect, it } from 'vitest';
import { Result, Schema } from 'effect';
import { CONTACT_LIMITS, ContactSubmit } from './contact-validation';

const validSubmission = {
  name: ' Stephen Frederick ',
  email: 'Stephen@Example.com',
  subject: ' Hello ',
  message: 'This is a valid contact message.',
  turnstileToken: 'turnstile-token',
};

const decode = Schema.decodeUnknownResult(ContactSubmit, {
  onExcessProperty: 'error',
});

describe('contact boundary', () => {
  it('normalizes bounded contact data', () => {
    const parsed = Schema.decodeUnknownSync(ContactSubmit)(validSubmission);
    expect(parsed.email).toBe('stephen@example.com');
    expect(parsed.name).toBe('Stephen Frederick');
    expect(parsed.subject).toBe('Hello');
  });
  it('rejects client-controlled request metadata', () => {
    expect(
      Result.isFailure(
        decode({ ...validSubmission, ip_address: '203.0.113.7' }),
      ),
    ).toBe(true);
  });
  it('rejects oversized fields and non-string input', () => {
    for (const input of [
      { ...validSubmission, name: 'a'.repeat(CONTACT_LIMITS.name + 1) },
      {
        ...validSubmission,
        turnstileToken: 'a'.repeat(CONTACT_LIMITS.turnstileToken + 1),
      },
      { ...validSubmission, name: false },
      { ...validSubmission, message: 'short' },
    ])
      expect(Result.isFailure(decode(input))).toBe(true);
  });
  it('preserves the original server email acceptance rules', () => {
    for (const email of [
      'a..b@example.com',
      '.a@example.com',
      'a@example.c',
      'a@localhost',
    ]) {
      expect(Result.isFailure(decode({ ...validSubmission, email }))).toBe(
        true,
      );
    }
  });
});
