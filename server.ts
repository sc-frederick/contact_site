// Custom Worker entry: wraps the TanStack Start handler to enforce HTTPS and attach
// security headers to every response.
//
// The HTTPS redirect is a code-level backstop — the zone-level "Always Use HTTPS"
// setting is the primary control, but this keeps the site safe even if that zone
// config drifts. Local dev (localhost/127.0.0.1) is exempt so `vite dev` keeps working.

import handler from '@tanstack/react-start/server-entry';

// Allowances: Turnstile (script + iframe + api calls from challenges.cloudflare.com)
// and Google Fonts (stylesheet from fonts.googleapis.com, font files from
// fonts.gstatic.com). 'unsafe-inline' script is required by TanStack Start's inline
// hydration payload; no user-generated content is ever rendered as HTML.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "frame-src https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function isLocalDev(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

export default {
  async fetch(request: Request, ...rest: unknown[]): Promise<Response> {
    const url = new URL(request.url);

    if (url.protocol === 'http:' && !isLocalDev(url.hostname)) {
      url.protocol = 'https:';
      return Response.redirect(url.href, 301);
    }

    const response = await (
      handler.fetch as (request: Request, ...rest: unknown[]) => Promise<Response>
    )(request, ...rest);

    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
