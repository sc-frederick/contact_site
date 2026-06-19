// Server-only: verifies a Cloudflare Turnstile token via the siteverify API.
//
// The widget on the contact form produces a single-use token; this confirms with
// Cloudflare that the token is genuine before we do any work. Client-side presence of
// a token is never sufficient — verification MUST happen here.

import { env } from 'cloudflare:workers';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/**
 * Returns true only if Cloudflare confirms the token is valid. Any failure
 * (missing token, network error, malformed response, rejection) returns false.
 * Optionally pass the visitor's IP (CF-Connecting-IP) for an extra check.
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteip?: string | null,
): Promise<boolean> {
  if (!token) return false;

  try {
    const body: Record<string, string> = {
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    };
    if (remoteip) body.remoteip = remoteip;

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as SiteverifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}
