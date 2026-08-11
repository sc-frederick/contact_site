import { describe, expect, it } from 'vitest';
import { isExpectedTurnstileResponse } from './turnstile-validation';

const validResponse = {
  success: true,
  hostname: 'sfrederick.dev',
  action: 'contact',
  challenge_ts: '2026-08-11T12:00:00.000Z',
  'error-codes': [],
};

describe('isExpectedTurnstileResponse', () => {
  it('accepts only the expected hostname and action', () => {
    expect(isExpectedTurnstileResponse(validResponse, 'sfrederick.dev', 'contact')).toBe(true);
  });

  it('rejects hostname and action mismatches', () => {
    expect(isExpectedTurnstileResponse(validResponse, 'www.sfrederick.dev', 'contact')).toBe(false);
    expect(isExpectedTurnstileResponse(validResponse, 'sfrederick.dev', 'login')).toBe(false);
  });

  it('rejects malformed and unsuccessful responses', () => {
    expect(isExpectedTurnstileResponse({ ...validResponse, success: false }, 'sfrederick.dev', 'contact')).toBe(false);
    expect(isExpectedTurnstileResponse('invalid', 'sfrederick.dev', 'contact')).toBe(false);
  });
});
