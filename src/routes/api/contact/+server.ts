import { env } from 'cloudflare:workers';
import { cloudflareContactLayer } from '#lib/server/cloudflare-contact.ts';
import { handleContactRequest } from '#lib/server/contact-handler.ts';
import type { RequestHandler } from './$types';

/** Deliver a verified contact submission using the Cloudflare request bindings. */
export const POST: RequestHandler = ({ request }) =>
  handleContactRequest(request, cloudflareContactLayer(env));
