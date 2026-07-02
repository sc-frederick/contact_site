// Server functions for contact form operations

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { createContactSubmissionInDB } from './db';
import { sendContactNotification } from './email';
import { verifyTurnstileToken } from './turnstile';
import type { ContactFormData, ContactSubmission, ApiResponse } from '~/types';

// What the client actually sends to submitContactForm: the form fields plus a
// Turnstile token. Request metadata (IP, user agent) is derived server-side from
// trusted headers — never accepted from the client, where it would be spoofable.
type ContactSubmitPayload = ContactFormData & {
  turnstileToken?: string;
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;

function validateContactForm(data: ContactFormData): string | null {
  if (!data.name || data.name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }

  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    return 'Please provide a valid email address';
  }

  if (!data.message || data.message.trim().length < 10) {
    return 'Message must be at least 10 characters long';
  }

  if (data.subject && data.subject.length > 200) {
    return 'Subject must be less than 200 characters';
  }

  if (data.message.length > 5000) {
    return 'Message must be less than 5000 characters';
  }

  return null;
}

// Fixed-window rate limit backed by KV, keyed on the visitor's real IP. KV is
// eventually consistent, so a burst can slightly exceed the cap — acceptable here
// since Turnstile already gates every submission.
async function checkRateLimit(identifier: string): Promise<boolean> {
  const key = `ratelimit:contact:${identifier}`;
  const now = Date.now();

  let count = 0;
  let windowStart = now;
  const raw = await env.CACHE.get(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { count: number; windowStart: number };
      if (now - parsed.windowStart < RATE_LIMIT_WINDOW_MS) {
        count = parsed.count;
        windowStart = parsed.windowStart;
      }
    } catch {
      // Corrupt entry; treat as a fresh window.
    }
  }

  if (count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // KV enforces a minimum TTL of 60s; that's also exactly our window.
  const ttlSeconds = Math.max(60, Math.ceil((windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000));
  await env.CACHE.put(key, JSON.stringify({ count: count + 1, windowStart }), {
    expirationTtl: ttlSeconds,
  });
  return true;
}

function sanitizeInput(input: string): string {
  // Basic sanitization to prevent XSS
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export const submitContactForm = createServerFn({ method: 'POST' })
  .inputValidator((data: ContactSubmitPayload) => data)
  .handler(async (ctx): Promise<ApiResponse<{ id: number }>> => {
    try {
      const data = ctx.data;

      if (!data) {
        return {
          success: false,
          error: 'No form data provided',
        };
      }

      // Request metadata from trusted sources only: CF-Connecting-IP is set by
      // Cloudflare's edge and cannot be forged by the visitor.
      const request = getRequest();
      const ipAddress = request.headers.get('cf-connecting-ip');
      const userAgent = request.headers.get('user-agent');

      // Bot check: confirm the Turnstile token with Cloudflare before doing any work.
      const turnstileOk = await verifyTurnstileToken(data.turnstileToken, ipAddress);
      if (!turnstileOk) {
        return {
          success: false,
          error: 'Bot verification failed. Please complete the challenge and try again.',
        };
      }

      // Validate form data
      const validationError = validateContactForm(data);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // Check rate limit (per IP; 'unknown' only ever applies in local dev where
      // there is no Cloudflare edge in front of the Worker)
      if (!(await checkRateLimit(ipAddress ?? 'unknown'))) {
        return {
          success: false,
          error: 'Too many requests. Please try again in a minute.',
        };
      }

      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email).toLowerCase(),
        subject: data.subject ? sanitizeInput(data.subject) : '',
        message: sanitizeInput(data.message),
      };

      // Create submission in database
      const submission: ContactSubmission = await createContactSubmissionInDB({
        ...sanitizedData,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      // Notify the site owner. Email is the delivery mechanism for the message, so
      // if it fails we tell the user honestly rather than pretending it went through.
      try {
        await sendContactNotification({
          ...sanitizedData,
          ip_address: ipAddress,
          user_agent: userAgent,
          submittedAt: submission.created_at,
        });
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
        return {
          success: false,
          error:
            "Sorry — your message couldn't be delivered right now. Please try again in a moment, or email me directly at sfred.mail@gmail.com.",
        };
      }

      return {
        success: true,
        data: { id: submission.id },
      };
    } catch (error) {
      // Log the detail server-side; never echo internal error messages to the client.
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        error: 'Failed to submit contact form. Please try again later.',
      };
    }
  });

// Exposes the public Turnstile sitekey to the client (rendered by the contact route
// loader). The sitekey is public by design; the secret never leaves the server.
export const getTurnstileSiteKey = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string> => env.TURNSTILE_SITE_KEY,
);

// Server function to check if contact form is available
export const getContactFormStatus = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ApiResponse<{ enabled: boolean; message?: string }>> => {
    try {
      // In the future, this could check maintenance mode or other settings
      return {
        success: true,
        data: {
          enabled: true,
        },
      };
    } catch (error) {
      console.error('Error checking contact form status:', error);
      return {
        success: false,
        error: 'Failed to check contact form status',
      };
    }
  });
