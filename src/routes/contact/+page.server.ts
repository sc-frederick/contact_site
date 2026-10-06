import { env } from 'cloudflare:workers';
import type { PageServerLoad } from './$types';

/** Expose only the public Turnstile key to the contact page. */
export const load: PageServerLoad = () => ({ siteKey: env.TURNSTILE_SITE_KEY });
