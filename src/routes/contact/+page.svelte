<script lang="ts">
  import ContactForm from '#lib/components/contact/ContactForm.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="min-h-screen">
  <div class="mp-shell">
    <header class="mb-12 max-w-3xl">
      <p class="mp-eyebrow mp-eyebrow--marker">Contact</p>
      <h1 class="mp-display mb-4">
        Let&apos;s make something <span class="mp-italic">useful.</span>
      </h1>
      <p class="mp-body mp-body--lg max-w-2xl">
        Have a project in mind or want to collaborate? Send me a message or
        reach out directly.
      </p>
    </header>

    <ContactForm siteKey={data.siteKey} />
  </div>
</div>
