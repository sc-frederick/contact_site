import { z } from 'zod';

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
});

export function isExpectedTurnstileResponse(
  input: unknown,
  expectedHostname: string,
  expectedAction: string,
): boolean {
  const result = siteverifyResponseSchema.safeParse(input);
  if (!result.success) return false;

  return (
    result.data.success === true &&
    result.data.hostname === expectedHostname &&
    result.data.action === expectedAction
  );
}
