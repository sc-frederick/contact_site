// Server-only: verifies a Cloudflare Turnstile token via the siteverify API.
//
// The widget on the contact form produces a single-use token; this confirms with
// Cloudflare that the token is genuine before we do any work. Client-side presence of
// a token is never sufficient — verification MUST happen here.

import { env } from 'cloudflare:workers';
import { isExpectedTurnstileResponse } from '~/lib/turnstile-validation';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface VerifyTurnstileOptions {
  token: string;
  remoteip?: string | null;
  expectedHostname: string;
  expectedAction: string;
}

/**
 * Returns true only if Cloudflare confirms the token is valid. Any failure
 * (missing token, network error, malformed response, rejection) returns false.
 * Optionally pass the visitor's IP (CF-Connecting-IP) for an extra check.
 */
export async function verifyTurnstileToken(
  options: VerifyTurnstileOptions,
): Promise<boolean> {
  try {
    const body: Record<string, string> = {
      secret: env.TURNSTILE_SECRET_KEY,
      response: options.token,
    };
    if (options.remoteip) body.remoteip = options.remoteip;

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return false;

    const data: unknown = await res.json();
    return isExpectedTurnstileResponse(
      data,
      options.expectedHostname,
      options.expectedAction,
    );
  } catch {
    return false;
  }
}
