import { describe, expect, it } from 'vitest';
import { Effect, Layer, Schema } from 'effect';
import { ContactResponse } from '../contact-validation';
import type { ContactFormData } from '../types';
import {
  ContactGate,
  ContactMailer,
  ContactStore,
  ContactStorageFailed,
  EmailDeliveryFailed,
} from './contact-service';
import { handleContactRequest } from './contact-handler';

const payload = {
  name: ' Visitor ',
  email: 'VISITOR@Example.com',
  subject: ' Project ',
  message: 'I would like to discuss a project.',
  turnstileToken: 'verified-token',
};

interface Scenario {
  limited?: boolean;
  rejected?: boolean;
  storageFailed?: boolean;
  mailFailed?: boolean;
}

function harness(scenario: Scenario = {}) {
  const calls: string[] = [];
  const submissions: ContactFormData[] = [];

  const services = Layer.mergeAll(
    Layer.succeed(ContactGate, {
      limit: (key) =>
        Effect.sync(() => {
          calls.push(`limit:${key}`);

          return !scenario.limited;
        }),
      verify: (token, ip, hostname) =>
        Effect.sync(() => {
          calls.push(`verify:${hostname}:${ip}:${token}`);

          return !scenario.rejected;
        }),
    }),
    Layer.succeed(ContactStore, {
      insert: (data) =>
        scenario.storageFailed
          ? Effect.fail(
              new ContactStorageFailed({ cause: new Error('D1 unavailable') }),
            )
          : Effect.sync(() => {
              calls.push('store');
              submissions.push(data);

              return { id: 7, created_at: '2026-10-06T12:00:00Z' };
            }),
    }),
    Layer.succeed(ContactMailer, {
      send: () =>
        scenario.mailFailed
          ? Effect.fail(
              new EmailDeliveryFailed({
                cause: new Error('private provider diagnostic'),
              }),
            )
          : Effect.sync(() => {
              calls.push('mail');
            }),
    }),
  );

  return { calls, submissions, services };
}

function request(body = JSON.stringify(payload)) {
  return new Request('https://sfrederick.dev/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '203.0.113.7',
    },
    body,
  });
}

async function response(request: Request, test: ReturnType<typeof harness>) {
  const result = await handleContactRequest(request, test.services);
  expect(result.headers.get('cache-control')).toBe('no-store');

  return Schema.decodeUnknownSync(ContactResponse)(await result.json());
}

describe('public contact endpoint', () => {
  it('verifies before storing and delivering, without retaining visitor metadata or tokens', async () => {
    const test = harness();
    expect(await response(request(), test)).toEqual({
      success: true,
      data: { id: 7 },
    });
    expect(test.calls).toEqual([
      'limit:203.0.113.7',
      'verify:sfrederick.dev:203.0.113.7:verified-token',
      'store',
      'mail',
    ]);
    expect(test.submissions).toEqual([
      {
        name: 'Visitor',
        email: 'visitor@example.com',
        subject: 'Project',
        message: payload.message,
      },
    ]);
  });
  it('rejects malformed and spoofed input before provider calls', async () => {
    for (const body of [
      'invalid JSON',
      JSON.stringify({ ...payload, ip_address: 'spoofed' }),
      JSON.stringify({ ...payload, message: 'short' }),
    ]) {
      const test = harness();
      expect((await response(request(body), test)).success).toBe(false);
      expect(test.calls).toEqual([]);
    }
  });
  it('stops at the rate limiter and preserves its feedback', async () => {
    const test = harness({ limited: true });
    expect(await response(request(), test)).toEqual({
      success: false,
      error: 'Too many requests. Please try again in a minute.',
    });
    expect(test.calls).toEqual(['limit:203.0.113.7']);
  });
  it('never stores a rejected Turnstile submission', async () => {
    const test = harness({ rejected: true });
    expect(await response(request(), test)).toEqual({
      success: false,
      error:
        'Bot verification failed. Please complete the challenge and try again.',
    });
    expect(test.submissions).toEqual([]);
  });
  it('does not deliver email if storage fails', async () => {
    const test = harness({ storageFailed: true });
    expect((await response(request(), test)).success).toBe(false);
    expect(test.calls).not.toContain('mail');
  });
  it('reports failed delivery after storing, without exposing provider diagnostics', async () => {
    const test = harness({ mailFailed: true });
    const result = await response(request(), test);
    expect(result).toEqual({
      success: false,
      error:
        "Sorry — your message couldn't be delivered right now. Please try again in a moment, or email me directly at contact@sfrederick.dev.",
    });
    expect(test.submissions).toHaveLength(1);
  });
});
