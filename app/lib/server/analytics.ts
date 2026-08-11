import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { parseAnalyticsPayload, type AnalyticsPayload } from '~/lib/analytics-validation';
import { createAnalyticsEvent } from './analytics-storage';
import type { ApiResponse } from '~/types';

type TrackResult = ApiResponse<{ tracked: boolean; sessionId: string }>;

async function recordEvent(data: AnalyticsPayload): Promise<TrackResult> {
  const request = getRequest();
  const rateLimit = await env.ANALYTICS_RATE_LIMITER.limit({
    key: request.headers.get('cf-connecting-ip') ?? 'local-development',
  });

  if (!rateLimit.success) {
    return { success: false, error: 'Analytics rate limit exceeded' };
  }

  const sessionId = data.sessionId ?? `sess_${crypto.randomUUID()}`;
  await createAnalyticsEvent({
    event_type: data.eventType,
    page_path: data.pagePath,
    referrer: data.referrer ?? null,
    session_id: sessionId,
    // Deliberately avoid retaining visitor IP addresses and raw user-agent strings.
    ip_address: null,
    user_agent: null,
    metadata: data.metadata ?? {},
  });

  return { success: true, data: { tracked: true, sessionId } };
}

export const trackEvent = createServerFn({ method: 'POST' })
  .validator(parseAnalyticsPayload)
  .handler(async (ctx): Promise<TrackResult> => {
    try {
      return await recordEvent(ctx.data);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'Failed to track analytics event',
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
      return { success: false, error: 'Failed to track event' };
    }
  });

export const trackPageView = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const value = data && typeof data === 'object' ? data : {};
    return parseAnalyticsPayload({ ...value, eventType: 'pageview' });
  })
  .handler(async (ctx): Promise<TrackResult> => {
    try {
      return await recordEvent(ctx.data);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'Failed to track page view',
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
      return { success: false, error: 'Failed to track page view' };
    }
  });
