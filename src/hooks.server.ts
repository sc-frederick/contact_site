import type { Handle } from '@sveltejs/kit/hooks';

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  'frame-src https://challenges.cloudflare.com',
  "connect-src 'self' https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

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
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  return response;
};
