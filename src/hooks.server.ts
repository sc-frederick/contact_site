import type { Handle } from '@sveltejs/kit/hooks';

// Cloudflare injects the Web Analytics beacon from static.cloudflareinsights.com
// and it reports to cloudflareinsights.com.
const contentSecurityPolicyDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  'frame-src https://challenges.cloudflare.com',
  "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

/** Production upgrades subresources to HTTPS; local HTTP servers can't. */
const contentSecurityPolicy = [
  ...contentSecurityPolicyDirectives,
  'upgrade-insecure-requests',
].join('; ');

// WebKit applies upgrade-insecure-requests to localhost too, which breaks
// local testing in Safari over plain HTTP.
const localContentSecurityPolicy = contentSecurityPolicyDirectives.join('; ');

/** Preserve the previous HTTPS redirect and response security headers. */
export const handle: Handle = async ({ event, resolve }) => {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(
    event.url.hostname,
  );

  if (event.url.protocol === 'http:' && !local) {
    const destination = new URL(event.url);
    destination.protocol = 'https:';

    return Response.redirect(destination.href, 301);
  }

  const response = await resolve(event);
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  response.headers.set(
    'Content-Security-Policy',
    local ? localContentSecurityPolicy : contentSecurityPolicy,
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  return response;
};
