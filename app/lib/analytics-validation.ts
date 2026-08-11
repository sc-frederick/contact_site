import { z } from 'zod';

const MAX_METADATA_BYTES = 4096;
const MAX_METADATA_DEPTH = 3;
const MAX_METADATA_KEYS = 30;
const MAX_ARRAY_ITEMS = 20;
const MAX_STRING_LENGTH = 500;

const analyticsPayloadSchema = z.strictObject({
  eventType: z.enum(['pageview', 'click', 'scroll', 'custom']),
  pagePath: z.string().min(1).max(2048),
  referrer: z.string().max(2048).optional(),
  sessionId: z.string().min(1).max(128).optional(),
  metadata: z.record(z.string().max(100), z.unknown()).optional(),
});

export type AnalyticsPayload = z.infer<typeof analyticsPayloadSchema> & {
  metadata?: Record<string, AnalyticsMetadataValue>;
};

type AnalyticsMetadataPrimitive = string | number | boolean | null;
export type AnalyticsMetadataValue =
  | AnalyticsMetadataPrimitive
  | AnalyticsMetadataValue[]
  | { [key: string]: AnalyticsMetadataValue };

export function parseAnalyticsPayload(data: unknown): AnalyticsPayload {
  const parsed = analyticsPayloadSchema.parse(data);
  const metadata = parsed.metadata ? sanitizeMetadata(parsed.metadata) : undefined;

  if (metadata && new TextEncoder().encode(JSON.stringify(metadata)).byteLength > MAX_METADATA_BYTES) {
    throw new z.ZodError([
      {
        code: 'custom',
        path: ['metadata'],
        message: `Metadata must be at most ${MAX_METADATA_BYTES} bytes`,
        input: parsed.metadata,
      },
    ]);
  }

  return { ...parsed, metadata };
}

function sanitizeMetadata(
  input: Record<string, unknown>,
  depth = 0,
): Record<string, AnalyticsMetadataValue> {
  if (depth >= MAX_METADATA_DEPTH) return {};

  const sanitized: Record<string, AnalyticsMetadataValue> = {};
  for (const [key, value] of Object.entries(input).slice(0, MAX_METADATA_KEYS)) {
    const cleanValue = sanitizeValue(value, depth + 1);
    if (cleanValue !== undefined) sanitized[key] = cleanValue;
  }
  return sanitized;
}

function sanitizeValue(value: unknown, depth: number): AnalyticsMetadataValue | undefined {
  if (value === null || typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.slice(0, MAX_STRING_LENGTH);
  if (depth >= MAX_METADATA_DEPTH) return undefined;
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((item) => sanitizeValue(item, depth + 1))
      .filter((item): item is AnalyticsMetadataValue => item !== undefined);
  }
  if (typeof value === 'object') {
    return sanitizeMetadata(value as Record<string, unknown>, depth);
  }
  return undefined;
}
