import { Schema, SchemaGetter } from 'effect';

/** Maximum lengths accepted by the contact transport and database. */
export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
  turnstileToken: 2048,
} as const;

/** Contact fields shared by the form and the server boundary. */
export const ContactFields = Schema.Struct({
  name: Schema.Trim.check(
    Schema.isMinLength(2),
    Schema.isMaxLength(CONTACT_LIMITS.name),
  ),
  email: Schema.Trim.check(
    Schema.isMaxLength(CONTACT_LIMITS.email),
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  ).pipe(
    Schema.decode({
      decode: SchemaGetter.transform((email) => email.toLowerCase()),
      encode: SchemaGetter.passthrough(),
    }),
  ),
  subject: Schema.Trim.check(Schema.isMaxLength(CONTACT_LIMITS.subject)),
  message: Schema.Trim.check(
    Schema.isMinLength(10),
    Schema.isMaxLength(CONTACT_LIMITS.message),
  ),
});

/** Strict contact request schema; verification tokens never enter storage. */
export const ContactSubmit = Schema.Struct({
  ...ContactFields.fields,
  // Match the original Zod server validator's practical email acceptance rules.
  email: ContactFields.fields.email.check(
    Schema.isPattern(
      /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/,
    ),
  ),
  turnstileToken: Schema.String.check(
    Schema.isMinLength(1),
    Schema.isMaxLength(CONTACT_LIMITS.turnstileToken),
  ),
});

/** Normalized contact input obtained from the request schema. */
export type ContactSubmitPayload = typeof ContactSubmit.Type;

/** JSON response contract consumed by the Svelte contact form. */
export const ContactResponse = Schema.Union([
  Schema.Struct({
    success: Schema.Literal(true),
    data: Schema.Struct({ id: Schema.Int }),
  }),
  Schema.Struct({ success: Schema.Literal(false), error: Schema.String }),
]);

/** Finite set of editable contact fields. */
export type ContactField = keyof typeof ContactFields.Type;
