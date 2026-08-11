// Server functions for contact form operations

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { contactSubmitSchema } from '~/lib/contact-validation';
import { createContactSubmission } from './contact-storage';
import { sendContactNotification } from './email';
import { verifyTurnstileToken } from './turnstile';
import type { ContactSubmission, ApiResponse } from '~/types';

export const submitContactForm = createServerFn({ method: 'POST' })
  .validator((data: unknown) => contactSubmitSchema.parse(data))
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

      // Apply the native edge limiter before making the external Siteverify request.
      // The contact form has no authenticated user identifier, so the edge-provided
      // connecting IP is the best available abuse key; Turnstile remains the second gate.
      const rateLimit = await env.CONTACT_RATE_LIMITER.limit({
        key: ipAddress ?? 'local-development',
      });
      if (!rateLimit.success) {
        return {
          success: false,
          error: 'Too many requests. Please try again in a minute.',
        };
      }

      // Bind the token to this form and the hostname on which it was rendered.
      const turnstileOk = await verifyTurnstileToken({
        token: data.turnstileToken,
        remoteip: ipAddress,
        expectedHostname: new URL(request.url).hostname,
        expectedAction: 'contact',
      });
      if (!turnstileOk) {
        return {
          success: false,
          error: 'Bot verification failed. Please complete the challenge and try again.',
        };
      }

      const sanitizedData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      };

      // Persist through a parameterized D1 statement. IP address and user agent are
      // deliberately not retained because they are not needed to reply to the message.
      const submission: ContactSubmission = await createContactSubmission(sanitizedData);

      // Notify the site owner. Email is the delivery mechanism for the message, so
      // if it fails we tell the user honestly rather than pretending it went through.
      try {
        await sendContactNotification({
          ...sanitizedData,
          submittedAt: submission.created_at,
        });
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
        return {
          success: false,
          error:
            "Sorry — your message couldn't be delivered right now. Please try again in a moment, or email me directly at contact@sfrederick.dev.",
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
