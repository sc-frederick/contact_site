<script lang="ts">
  import { Effect, Schema } from 'effect';
  import Send from 'lucide-svelte/icons/send';
  import CheckCircle from 'lucide-svelte/icons/check-circle';
  import AlertCircle from 'lucide-svelte/icons/alert-circle';
  import Loader2 from 'lucide-svelte/icons/loader-2';
  import { ContactResponse } from '#lib/contact-validation.ts';
  import type { ContactField } from '#lib/contact-validation.ts';
  import DirectContactInfo from './DirectContactInfo.svelte';
  import FormField from './FormField.svelte';

  let { siteKey }: { siteKey: string } = $props();

  let formData = $state({ name: '', email: '', subject: '', message: '' });

  let errors = $state<Partial<Record<ContactField, string>>>({});

  let submitting = $state(false);

  let success = $state(false);

  let submitError = $state<string | null>(null);

  let token = $state<string | null>(null);

  let challengeStatus = $state<'loading' | 'ready' | 'error'>('loading');

  let widgetId: string | undefined;

  function challenge(element: HTMLDivElement) {
    const key = siteKey;
    challengeStatus = 'loading';
    let cancelled = false;

    function unavailable() {
      token = null;
      challengeStatus = 'error';
    }

    function render() {
      if (cancelled) return;

      if (!window.turnstile) {
        unavailable();

        return;
      }

      widgetId = window.turnstile.render(element, {
        sitekey: key,
        action: 'contact',
        theme: 'light',
        callback: (value) => (token = value),
        'expired-callback': () => (token = null),
        'error-callback': unavailable,
        'timeout-callback': unavailable,
      });
      challengeStatus = 'ready';
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[data-contact-turnstile]',
    );

    if (window.turnstile) render();
    else {
      if (!script) {
        script = document.createElement('script');
        script.dataset.contactTurnstile = 'loading';
        script.src =
          'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener('load', render, { once: true });
      script.addEventListener('error', unavailable, { once: true });
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', render);
      script?.removeEventListener('error', unavailable);

      if (widgetId) window.turnstile?.remove(widgetId);
      widgetId = undefined;
      token = null;
    };
  }

  function change(field: ContactField, value: string) {
    formData[field] = value;
    delete errors[field];
    submitError = null;
  }

  function validate() {
    const next: Partial<Record<ContactField, string>> = {};

    if (!formData.name.trim()) next.name = 'Name is required';
    else if (formData.name.trim().length < 2)
      next.name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = 'Please enter a valid email address';

    if (formData.subject.length > 200)
      next.subject = 'Subject must be less than 200 characters';

    if (!formData.message.trim()) next.message = 'Message is required';
    else if (formData.message.trim().length < 10)
      next.message = 'Message must be at least 10 characters';
    else if (formData.message.length > 5000)
      next.message = 'Message must be less than 5000 characters';
    errors = next;

    return Object.keys(next).length === 0;
  }

  class ContactTransportFailed extends Schema.TaggedError<ContactTransportFailed>()(
    'ContactTransportFailed',
    {},
  ) {}

  async function submit(event: SubmitEvent) {
    event.preventDefault();

    if (!validate()) return;

    if (!token) {
      submitError = 'Please complete the bot-check challenge before sending.';

      return;
    }

    submitting = true;
    submitError = null;
    const payload = { ...formData, turnstileToken: token };

    const response = await Effect.runPromise(
      Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetch('/api/contact', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(payload),
            }),
          catch: () => new ContactTransportFailed(),
        });

        if (!response.ok) return yield* new ContactTransportFailed();

        const raw = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: () => new ContactTransportFailed(),
        });

        return yield* Schema.decodeUnknownEffect(ContactResponse)(raw).pipe(
          Effect.mapError(() => new ContactTransportFailed()),
        );
      }).pipe(
        Effect.catch(() =>
          Effect.succeed({
            success: false as const,
            error: 'An unexpected error occurred. Please try again later.',
          }),
        ),
      ),
    );

    submitting = false;

    if (response.success) {
      success = true;
      formData = { name: '', email: '', subject: '', message: '' };
    } else {
      submitError = response.error;

      if (widgetId) window.turnstile?.reset(widgetId);
      token = null;
    }
  }

  function reset() {
    success = false;
    formData = { name: '', email: '', subject: '', message: '' };
    errors = {};
    submitError = null;
  }
</script>

<div class="mp-grid">
  <DirectContactInfo sent={success} />
  <div class="mp-card mp-span-7">
    {#if success}
      <div class="py-12 text-center">
        <CheckCircle
          class="mx-auto mb-6 h-12 w-12 text-[var(--color-success)]"
        />
        <h3 class="mp-headline mb-3">Message sent</h3>
        <p class="mp-body mx-auto mb-8 max-w-sm">
          Thanks for your message. I will read it and reply as soon as I can.
        </p>
        <button onclick={reset} class="mp-btn mp-btn--secondary"
          >Send another message</button
        >
      </div>
    {:else}
      <form onsubmit={submit} class="mp-stack mp-stack--lg">
        <div>
          <p class="mp-eyebrow">Project inquiry</p>
          <h2 class="mp-headline mb-2">Send a Message</h2>
          <p class="mp-body">
            Fill out the form below and I'll respond within 24 hours.
          </p>
        </div>
        <div class="mp-stack">
          <FormField
            id="name"
            label="Name"
            value={formData.name}
            onChange={(value) => change('name', value)}
            error={errors.name}
            placeholder="Your full name"
            required
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => change('email', value)}
            error={errors.email}
            placeholder="your.email@example.com"
            required
          />
          <FormField
            id="subject"
            label="Subject"
            value={formData.subject}
            onChange={(value) => change('subject', value)}
            error={errors.subject}
            placeholder="What's this about?"
            maxLength={200}
          />
          <FormField
            id="message"
            label="Message"
            value={formData.message}
            onChange={(value) => change('message', value)}
            error={errors.message}
            placeholder="Tell me about your project or inquiry..."
            isTextarea
            required
            maxLength={5000}
          />
          <p class="mp-meta text-right">
            {formData.message.length}/5000 characters
          </p>
        </div>
        {#if submitError}<div
            class="mp-alert--error flex items-center gap-2"
            role="alert"
          >
            <AlertCircle class="mp-icon flex-shrink-0" />
            <p class="mp-meta">{submitError}</p>
          </div>{/if}
        <div {@attach challenge} class="min-h-[65px]"></div>
        <p
          class={[
            'mp-status',
            challengeStatus === 'error' && 'mp-status--error',
          ]}
          role="status"
          aria-live="polite"
        >
          {#if challengeStatus === 'loading'}Loading the bot check...{:else if challengeStatus === 'ready' && !token}Complete
            the bot check to enable Send Message.{:else if challengeStatus === 'error'}The
            bot check could not load. Refresh the page to try again.{/if}
        </p>
        <button
          type="submit"
          disabled={submitting || !token}
          class="mp-btn mp-btn--accent w-full"
        >
          {#if submitting}<Loader2
              class="mp-icon animate-spin"
            />Sending...{:else}<Send class="mp-icon" />Send Message{/if}
        </button>
      </form>
    {/if}
  </div>
</div>
