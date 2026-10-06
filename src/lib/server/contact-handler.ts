import { Effect, Layer, Schema } from 'effect';
import { ContactSubmit } from '../contact-validation';
import type { ApiResponse } from '../types';
import { submitContact } from './contact-service';
import type {
  ContactGate,
  ContactMailer,
  ContactStore,
} from './contact-service';

/** The contact transport did not contain a valid, bounded submission. */
export class InvalidContactRequest extends Schema.TaggedError<InvalidContactRequest>()(
  'InvalidContactRequest',
  { cause: Schema.Defect() },
) {}

/** Parse and run the public contact endpoint through application-owned services. */
export async function handleContactRequest(
  request: Request,
  services: Layer.Layer<ContactGate | ContactStore | ContactMailer>,
): Promise<Response> {
  const program = Effect.gen(function* () {
    const raw = yield* Effect.tryPromise({
      try: () => request.json(),
      catch: (cause) => new InvalidContactRequest({ cause }),
    });

    const data = yield* Schema.decodeUnknownEffect(ContactSubmit)(raw, {
      onExcessProperty: 'error',
    }).pipe(Effect.mapError((cause) => new InvalidContactRequest({ cause })));

    return yield* submitContact(
      data,
      request.headers.get('cf-connecting-ip'),
      new URL(request.url).hostname,
    );
  }).pipe(
    Effect.tapError((error) =>
      Effect.logError('Contact submission failed', { error: error._tag }),
    ),
    Effect.map((data): ApiResponse<{ id: number }> => ({
      success: true,
      data,
    })),
    Effect.catchTags({
      InvalidContactRequest: () =>
        Effect.succeed({
          success: false as const,
          error: 'An unexpected error occurred. Please try again later.',
        }),
      ContactRateLimited: () =>
        Effect.succeed({
          success: false as const,
          error: 'Too many requests. Please try again in a minute.',
        }),
      BotVerificationFailed: () =>
        Effect.succeed({
          success: false as const,
          error:
            'Bot verification failed. Please complete the challenge and try again.',
        }),
      EmailDeliveryFailed: () =>
        Effect.succeed({
          success: false as const,
          error:
            "Sorry — your message couldn't be delivered right now. Please try again in a moment, or email me directly at contact@sfrederick.dev.",
        }),
    }),
    Effect.catch(() =>
      Effect.succeed({
        success: false as const,
        error: 'Failed to submit contact form. Please try again later.',
      }),
    ),
    Effect.provide(services),
  );

  const result = await Effect.runPromise(program);

  return Response.json(result, { headers: { 'cache-control': 'no-store' } });
}
