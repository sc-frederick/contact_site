// Server functions for analytics operations

import { createServerFn } from '@tanstack/react-start';
import { createAnalyticsEventInDB } from './db';
import type { AnalyticsEvent, ApiResponse } from '~/types';

type EventType = 'pageview' | 'click' | 'scroll' | 'custom';

interface TrackEventData {
  eventType: EventType;
  pagePath: string;
  referrer?: string;
  sessionId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// Generate a session ID if not provided
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate event data
function validateEventData(data: TrackEventData): string | null {
  if (!data.eventType) {
    return 'Event type is required';
  }

  const validEventTypes: EventType[] = ['pageview', 'click', 'scroll', 'custom'];
  if (!validEventTypes.includes(data.eventType)) {
    return `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`;
  }

  if (!data.pagePath) {
    return 'Page path is required';
  }

  if (!data.sessionId) {
    return 'Session ID is required';
  }

  // Validate metadata if provided
  if (data.metadata && typeof data.metadata !== 'object') {
    return 'Metadata must be an object';
  }

  return null;
}

// Sanitize metadata to ensure it's JSON-serializable
function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Skip functions and other non-serializable types
    if (typeof value === 'function' || typeof value === 'symbol') {
      continue;
    }
    
    // Limit key length
    const safeKey = key.slice(0, 100);
    
    // Handle different value types
    if (typeof value === 'string') {
      sanitized[safeKey] = value.slice(0, 1000); // Limit string length
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[safeKey] = value;
    } else if (value === null) {
      sanitized[safeKey] = null;
    } else if (Array.isArray(value)) {
      sanitized[safeKey] = value.slice(0, 100).map((v) => 
        typeof v === 'string' ? v.slice(0, 100) : v
      );
    } else if (typeof value === 'object') {
      sanitized[safeKey] = sanitizeMetadata(value as Record<string, unknown>);
    }
    // Other types are ignored
  }
  
  return sanitized;
}

export const trackEvent = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<ApiResponse<{ tracked: boolean; sessionId: string }>> => {
    try {
      const data = ctx.data as unknown as TrackEventData;

      if (!data) {
        return {
          success: false,
          error: 'No event data provided',
        };
      }

      // Generate session ID if not provided
      const sessionId = data.sessionId || generateSessionId();

      // Validate event data
      const validationError = validateEventData({ ...data, sessionId });
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // Sanitize metadata
      const sanitizedMetadata = data.metadata 
        ? sanitizeMetadata(data.metadata)
        : {};

      // Create analytics event in database
      const event: AnalyticsEvent = await createAnalyticsEventInDB({
        event_type: data.eventType,
        page_path: data.pagePath,
        referrer: data.referrer || null,
        session_id: sessionId,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
        metadata: sanitizedMetadata,
      });

      return {
        success: true,
        data: {
          tracked: true,
          sessionId,
        },
      };
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track event',
      };
    }
  });

// Server function to track page views
export const trackPageView = createServerFn({ method: 'POST' })
  .handler(async (ctx): Promise<ApiResponse<{ tracked: boolean; sessionId: string }>> => {
    try {
      const data = ctx.data as unknown as Omit<TrackEventData, 'eventType'> & { 
        pagePath: string;
        sessionId?: string;
      };

      if (!data) {
        return {
          success: false,
          error: 'No page view data provided',
        };
      }

      const sessionId = data.sessionId || generateSessionId();

      // Validate
      if (!data.pagePath) {
        return {
          success: false,
          error: 'Page path is required',
        };
      }

      // Create page view event
      const event: AnalyticsEvent = await createAnalyticsEventInDB({
        event_type: 'pageview',
        page_path: data.pagePath,
        referrer: data.referrer || null,
        session_id: sessionId,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
        metadata: data.metadata ? sanitizeMetadata(data.metadata) : {},
      });

      return {
        success: true,
        data: {
          tracked: true,
          sessionId,
        },
      };
    } catch (error) {
      console.error('Error tracking page view:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track page view',
      };
    }
  });

// Server function to get analytics summary (for admin use)
export const getAnalyticsSummary = createServerFn({ method: 'GET' })
  .handler(async (ctx): Promise<ApiResponse<{
    totalEvents: number;
    pageViews: number;
    uniqueSessions: number;
    topPages: { path: string; count: number }[];
  }>> => {
    try {
      const { days = 7 } = (ctx.data as unknown as { days?: number }) || {};

      // TODO: Replace with actual D1 aggregation queries when bindings are configured
      // For now, return mock summary data
      
      const summary = {
        totalEvents: 1523,
        pageViews: 892,
        uniqueSessions: 456,
        topPages: [
          { path: '/', count: 342 },
          { path: '/portfolio', count: 186 },
          { path: '/blog', count: 124 },
          { path: '/contact', count: 89 },
          { path: '/blog/getting-started-react-server-components', count: 67 },
        ],
      };

      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics summary',
      };
    }
  });
