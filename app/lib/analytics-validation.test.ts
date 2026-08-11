import { describe, expect, it } from 'vitest';
import { parseAnalyticsPayload } from './analytics-validation';

describe('parseAnalyticsPayload', () => {
  it('accepts a bounded event without client-controlled request metadata', () => {
    const parsed = parseAnalyticsPayload({
      eventType: 'pageview',
      pagePath: '/contact',
      sessionId: 'session-1',
      metadata: { depth: 75 },
    });

    expect(parsed.pagePath).toBe('/contact');
    expect(parsed.metadata).toEqual({ depth: 75 });
  });

  it('rejects spoofed IP and user-agent fields', () => {
    expect(() =>
      parseAnalyticsPayload({
        eventType: 'pageview',
        pagePath: '/',
        ipAddress: '203.0.113.7',
        userAgent: 'spoofed',
      }),
    ).toThrow();
  });

  it('rejects oversized metadata', () => {
    expect(() =>
      parseAnalyticsPayload({
        eventType: 'custom',
        pagePath: '/',
        metadata: Object.fromEntries(
          Array.from({ length: 30 }, (_, index) => [`key-${index}`, 'x'.repeat(500)]),
        ),
      }),
    ).toThrow();
  });
});
