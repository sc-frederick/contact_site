import { Context, Effect, Schema } from 'effect';
import type { ContactSubmitPayload } from '../contact-validation';
import type { ContactFormData } from '../types';

/** An IP has exceeded the existing five-per-minute contact limit. */
export class ContactRateLimited extends Schema.TaggedError<ContactRateLimited>()(
  'ContactRateLimited',
  {},
) {}

/** Turnstile rejected a token or could not verify it. */
export class BotVerificationFailed extends Schema.TaggedError<BotVerificationFailed>()(
  'BotVerificationFailed',
  {},
) {}

/** The rate-limit binding could not check this request. */
export class ContactRateLimitFailed extends Schema.TaggedError<ContactRateLimitFailed>()(
  'ContactRateLimitFailed',
  { cause: Schema.Defect() },
) {}

/** D1 could not persist a validated submission. */
export class ContactStorageFailed extends Schema.TaggedError<ContactStorageFailed>()(
  'ContactStorageFailed',
  { cause: Schema.Defect() },
) {}

/** Email delivery failed after the submission was stored. */
export class EmailDeliveryFailed extends Schema.TaggedError<EmailDeliveryFailed>()(
  'EmailDeliveryFailed',
  { cause: Schema.Defect() },
) {}

/** Stored identity and timestamp returned by D1. */
export const StoredContact = Schema.Struct({
  id: Schema.Int,
  created_at: Schema.String,
});

/** Abuse protection checked before storage or mail delivery. */
export class ContactGate extends Context.Service<
  ContactGate,
  {
    readonly limit: (
      key: string,
    ) => Effect.Effect<boolean, ContactRateLimitFailed>;
    readonly verify: (
      token: string,
      ip: string | null,
      hostname: string,
    ) => Effect.Effect<boolean, BotVerificationFailed>;
  }
>()('contact-site/ContactGate') {}

/** Parameterized storage seam; submissions contain no IP or user agent. */
export class ContactStore extends Context.Service<
  ContactStore,
  {
    readonly insert: (
      data: ContactFormData,
    ) => Effect.Effect<typeof StoredContact.Type, ContactStorageFailed>;
  }
>()('contact-site/ContactStore') {}

/** Mail delivery seam, with a fixed recipient supplied by the adapter. */
export class ContactMailer extends Context.Service<
  ContactMailer,
  {
    readonly send: (
      data: ContactFormData,
      submittedAt: string,
    ) => Effect.Effect<void, EmailDeliveryFailed>;
  }
>()('contact-site/ContactMailer') {}

/** Rate limit, verify, store, and deliver a normalized contact submission in order. */
export const submitContact = Effect.fn('submitContact')(function* (
  data: ContactSubmitPayload,
  ip: string | null,
  hostname: string,
) {
  const gate = yield* ContactGate;

  if (!(yield* gate.limit(ip ?? 'local-development')))
    return yield* new ContactRateLimited();

  if (!(yield* gate.verify(data.turnstileToken, ip, hostname)))
    return yield* new BotVerificationFailed();

  const fields: ContactFormData = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  };

  const store = yield* ContactStore;
  const saved = yield* store.insert(fields);
  const mailer = yield* ContactMailer;
  yield* mailer.send(fields, saved.created_at);

  return { id: saved.id };
});
