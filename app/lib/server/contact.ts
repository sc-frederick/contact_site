// Server functions for contact form operations

import { createServerFn } from '@tanstack/react-start';
import { createContactSubmissionInDB } from './db';
import type { ContactFormData, ContactSubmission, ApiResponse } from '~/types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting store (in production, this should use KV or Redis)
const rateLimitStore = new Map<string, number>();
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

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitStore.get(identifier);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return false;
  }

  rateLimitStore.set(identifier, now);
  return true;
}

function sanitizeInput(input: string): string {
  // Basic sanitization to prevent XSS
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export const submitContactForm = createServerFn({ method: 'POST' })
  .inputValidator((data: ContactFormData) => data)
  .handler(async (ctx): Promise<ApiResponse<{ id: number }>> => {
    try {
      const data = ctx.data as ContactFormData & { 
        sessionId?: string;
        ipAddress?: string;
        userAgent?: string;
      };

      if (!data) {
        return {
          success: false,
          error: 'No form data provided',
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

      // Check rate limit
      const identifier = data.sessionId || data.ipAddress || 'anonymous';
      if (!checkRateLimit(identifier)) {
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
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
      });

      // TODO: Send notification email (integrate with email service)
      console.log('Contact form submitted:', {
        id: submission.id,
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
      });

      return {
        success: true,
        data: { id: submission.id },
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit contact form',
      };
    }
  });

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
        error: error instanceof Error ? error.message : 'Failed to check contact form status',
      };
    }
  });
