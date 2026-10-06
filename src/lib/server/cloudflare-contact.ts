import { Effect, Layer, Redacted, Schema } from 'effect';
import {
  decodeTurnstileResponse,
  verifyTurnstileResponse,
} from '../turnstile-validation';
import {
  ContactGate,
  ContactMailer,
  ContactStore,
  ContactRateLimitFailed,
  BotVerificationFailed,
  ContactStorageFailed,
  EmailDeliveryFailed,
  StoredContact,
} from './contact-service';
import { buildContactNotification } from './email';

const MailConfiguration = Schema.Struct({
  CONTACT_FROM_EMAIL: Schema.NonEmptyString,
  CONTACT_FROM_NAME: Schema.NonEmptyString,
  CONTACT_TO_EMAIL: Schema.NonEmptyString,
});

const TurnstileSecret = Schema.RedactedFromValue(Schema.NonEmptyString);

/** Supply request-local Cloudflare adapters, keeping bindings outside application policy. */
export function cloudflareContactLayer(bindings: Cloudflare.Env) {
  const gate = Layer.succeed(ContactGate, {
    limit: Effect.fn('ContactGate.limit')(function* (key) {
      const result = yield* Effect.tryPromise({
        try: () => bindings.CONTACT_RATE_LIMITER.limit({ key }),
        catch: (cause) => new ContactRateLimitFailed({ cause }),
      });

      return result.success;
    }),
    verify: Effect.fn('ContactGate.verify')(function* (token, ip, hostname) {
      const secret = yield* Schema.decodeUnknownEffect(TurnstileSecret)(
        bindings.TURNSTILE_SECRET_KEY,
      ).pipe(Effect.mapError(() => new BotVerificationFailed()));

      const body = new URLSearchParams({
        secret: Redacted.value(secret),
        response: token,
      });

      if (ip) body.set('remoteip', ip);

      const response = yield* Effect.tryPromise({
        try: () =>
          fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body,
            signal: AbortSignal.timeout(5000),
          }),
        catch: () => new BotVerificationFailed(),
      });

      if (!response.ok) return false;

      const raw = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new BotVerificationFailed(),
      });

      return verifyTurnstileResponse(
        decodeTurnstileResponse(raw),
        hostname,
        'contact',
      );
    }),
  });

  const store = Layer.succeed(ContactStore, {
    insert: Effect.fn('ContactStore.insert')(function* (data) {
      const row = yield* Effect.tryPromise({
        try: () =>
          bindings.DB.prepare(
            'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?1, ?2, ?3, ?4) RETURNING id, created_at',
          )
            .bind(data.name, data.email, data.subject, data.message)
            .first(),
        catch: (cause) => new ContactStorageFailed({ cause }),
      });

      return yield* Schema.decodeUnknownEffect(StoredContact)(row).pipe(
        Effect.mapError((cause) => new ContactStorageFailed({ cause })),
      );
    }),
  });

  const mailer = Layer.succeed(ContactMailer, {
    send: Effect.fn('ContactMailer.send')(function* (data, submittedAt) {
      const configuration = yield* Schema.decodeUnknownEffect(
        MailConfiguration,
      )(bindings).pipe(
        Effect.mapError((cause) => new EmailDeliveryFailed({ cause })),
      );

      yield* Effect.tryPromise({
        try: () =>
          bindings.SEND_EMAIL.send(
            buildContactNotification(data, submittedAt, {
              fromName: configuration.CONTACT_FROM_NAME,
              fromEmail: configuration.CONTACT_FROM_EMAIL,
              toEmail: configuration.CONTACT_TO_EMAIL,
            }),
          ),
        catch: (cause) => new EmailDeliveryFailed({ cause }),
      });
    }),
  });

  return Layer.mergeAll(gate, store, mailer);
}
