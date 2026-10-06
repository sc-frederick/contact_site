import { env } from 'cloudflare:workers';
import { Effect, Schema } from 'effect';
import {
  AnalyticsInput,
  normalizeAnalyticsPayload,
} from '#lib/analytics-validation.ts';
import type { RequestHandler } from './$types';

class AnalyticsProviderFailed extends Schema.TaggedError<AnalyticsProviderFailed>()(
  'AnalyticsProviderFailed',
  { cause: Schema.Defect() },
) {}

/** Preserve the optional analytics capability without adding visitor tracking to the UI. */
export const POST: RequestHandler = async ({ request }) => {
  const program = Effect.gen(function* () {
    const raw = yield* Effect.tryPromise({
      try: () => request.json(),
      catch: (cause) => new AnalyticsProviderFailed({ cause }),
    });

    const input = yield* Schema.decodeUnknownEffect(AnalyticsInput)(raw, {
      onExcessProperty: 'error',
    });

    const data = yield* normalizeAnalyticsPayload(input);

    const rate = yield* Effect.tryPromise({
      try: () =>
        env.ANALYTICS_RATE_LIMITER.limit({
          key: request.headers.get('cf-connecting-ip') ?? 'local-development',
        }),
      catch: (cause) => new AnalyticsProviderFailed({ cause }),
    });

    if (!rate.success)
      return {
        success: false as const,
        error: 'Analytics rate limit exceeded',
      };
    const sessionId = data.sessionId ?? `sess_${crypto.randomUUID()}`;
    yield* Effect.tryPromise({
      try: () =>
        env.DB.prepare(
          'INSERT INTO analytics_events (event_type, page_path, referrer, session_id, ip_address, user_agent, metadata) VALUES (?1, ?2, ?3, ?4, NULL, NULL, ?5)',
        )
          .bind(
            data.eventType,
            data.pagePath,
            data.referrer ?? null,
            sessionId,
            JSON.stringify(data.metadata ?? {}),
          )
          .run(),
      catch: (cause) => new AnalyticsProviderFailed({ cause }),
    });

    return { success: true as const, data: { tracked: true, sessionId } };
  }).pipe(
    Effect.catch(() =>
      Effect.succeed({
        success: false as const,
        error: 'Failed to track event',
      }),
    ),
  );

  return Response.json(await Effect.runPromise(program));
};
