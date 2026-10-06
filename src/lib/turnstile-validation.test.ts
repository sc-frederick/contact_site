import { describe, expect, it } from 'vitest';
import {
  decodeTurnstileResponse,
  verifyTurnstileResponse,
} from './turnstile-validation';

const valid = {
  success: true,
  hostname: 'sfrederick.dev',
  action: 'contact',
  'error-codes': [],
};

describe('Turnstile verification boundary', () => {
  it('accepts only this hostname and contact action', () => {
    expect(
      verifyTurnstileResponse(
        decodeTurnstileResponse(valid),
        'sfrederick.dev',
        'contact',
      ),
    ).toBe(true);
    expect(
      verifyTurnstileResponse(
        decodeTurnstileResponse(valid),
        'www.sfrederick.dev',
        'contact',
      ),
    ).toBe(false);
    expect(
      verifyTurnstileResponse(
        decodeTurnstileResponse(valid),
        'sfrederick.dev',
        'login',
      ),
    ).toBe(false);
  });
  it('rejects malformed, incomplete, and unsuccessful responses', () => {
    for (const input of [
      'invalid',
      { ...valid, success: false },
      { success: true },
      { ...valid, success: 'true' },
    ]) {
      expect(
        verifyTurnstileResponse(
          decodeTurnstileResponse(input),
          'sfrederick.dev',
          'contact',
        ),
      ).toBe(false);
    }
  });
});
