import { Effect, Option, Predicate, Schema } from 'effect';

/** Strict analytics transport; visitors cannot supply stored IP or user agent values. */
export const AnalyticsInput = Schema.Struct({
  eventType: Schema.Literals(['pageview', 'click', 'scroll', 'custom']),
  pagePath: Schema.String.check(
    Schema.isMinLength(1),
    Schema.isMaxLength(2048),
  ),
  referrer: Schema.optional(Schema.String.check(Schema.isMaxLength(2048))),
  sessionId: Schema.optional(
    Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(128)),
  ),
  metadata: Schema.optional(Schema.JsonObject),
});

/** Analytics input after its earliest schema boundary. */
export type AnalyticsPayload = typeof AnalyticsInput.Type;

/** An event's sanitized metadata exceeds the existing byte limit. */
export class AnalyticsMetadataTooLarge extends Schema.TaggedError<AnalyticsMetadataTooLarge>()(
  'AnalyticsMetadataTooLarge',
  {},
) {}

function sanitizeValue(
  value: typeof Schema.Json.Type,
  depth: number,
): typeof Schema.Json.Type | undefined {
  if (value === null || Predicate.isNumber(value) || Predicate.isBoolean(value))
    return value;

  if (Predicate.isString(value)) return value.slice(0, 500);

  if (depth >= 3) return undefined;

  if (Array.isArray(value)) {
    return value.slice(0, 20).flatMap((item) => {
      const clean = sanitizeValue(item, depth + 1);

      return clean === undefined ? [] : [clean];
    });
  }

  return Option.match(Schema.decodeUnknownOption(Schema.JsonObject)(value), {
    onNone: () => undefined,
    onSome: (object) => sanitizeMetadata(object, depth),
  });
}

function sanitizeMetadata(
  input: typeof Schema.JsonObject.Type,
  depth = 0,
): typeof Schema.JsonObject.Type {
  if (depth >= 3) return {};
  const result: Record<string, typeof Schema.Json.Type> = {};

  for (const [key, value] of Object.entries(input).slice(0, 30)) {
    if (key.length > 100) continue;
    const clean = sanitizeValue(value, depth + 1);

    if (clean !== undefined) result[key] = clean;
  }

  return result;
}

/** Bound metadata breadth, depth, string lengths, and total encoded size. */
export const normalizeAnalyticsPayload = Effect.fn('normalizeAnalyticsPayload')(
  function* (input: AnalyticsPayload) {
    const metadata = input.metadata
      ? sanitizeMetadata(input.metadata)
      : undefined;

    if (
      metadata &&
      new TextEncoder().encode(JSON.stringify(metadata)).byteLength > 4096
    )
      return yield* new AnalyticsMetadataTooLarge();

    return { ...input, metadata };
  },
);
