import { Option, Schema } from 'effect';

/** Cloudflare Siteverify's response, validated before checking form binding. */
export const TurnstileResponse = Schema.Struct({
  success: Schema.Boolean,
  hostname: Schema.optional(Schema.String),
  action: Schema.optional(Schema.String),
  challenge_ts: Schema.optional(Schema.String),
  'error-codes': Schema.optional(Schema.Array(Schema.String)),
});

/** Match a parsed Siteverify response to the hostname and contact action. */
export const isExpectedTurnstileResponse = (
  input: typeof TurnstileResponse.Type,
  expectedHostname: string,
  expectedAction: string,
): boolean =>
  input.success &&
  input.hostname === expectedHostname &&
  input.action === expectedAction;

/** Decode provider responses without throwing on malformed input. */
export const decodeTurnstileResponse =
  Schema.decodeUnknownOption(TurnstileResponse);

/** Accept only validated, successful responses for this form and hostname. */
export const verifyTurnstileResponse = (
  response: Option.Option<typeof TurnstileResponse.Type>,
  expectedHostname: string,
  expectedAction: string,
): boolean =>
  Option.isSome(response) &&
  isExpectedTurnstileResponse(response.value, expectedHostname, expectedAction);
