import { describe, expect, it } from 'vitest';
import { Effect, Result, Schema } from 'effect';
import {
  AnalyticsInput,
  normalizeAnalyticsPayload,
} from './analytics-validation';

describe('analytics boundary', () => {
  it('accepts a bounded event and limits nested metadata', async () => {
    const input = Schema.decodeUnknownSync(AnalyticsInput)({
      eventType: 'pageview',
      pagePath: '/contact',
      metadata: {
        depth: 75,
        text: 'x'.repeat(600),
        nested: { one: { two: { three: true } } },
      },
    });

    const result = await Effect.runPromise(normalizeAnalyticsPayload(input));
    expect(result.metadata).toEqual({
      depth: 75,
      text: 'x'.repeat(500),
      nested: { one: {} },
    });
  });
  it('rejects spoofed request metadata', () => {
    const result = Schema.decodeUnknownResult(AnalyticsInput, {
      onExcessProperty: 'error',
    })({
      eventType: 'pageview',
      pagePath: '/',
      ipAddress: '203.0.113.7',
      userAgent: 'spoofed',
    });

    expect(Result.isFailure(result)).toBe(true);
  });
  it('rejects oversized encoded metadata', async () => {
    const input = Schema.decodeUnknownSync(AnalyticsInput)({
      eventType: 'custom',
      pagePath: '/',
      metadata: Object.fromEntries(
        Array.from({ length: 30 }, (_, index) => [
          `key-${index}`,
          'x'.repeat(500),
        ]),
      ),
    });

    const result = await Effect.runPromise(
      normalizeAnalyticsPayload(input).pipe(Effect.result),
    );

    expect(Result.isFailure(result)).toBe(true);
  });
});
