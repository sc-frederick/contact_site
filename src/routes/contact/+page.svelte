<script lang="ts">
  import ContactForm from '#lib/components/contact/ContactForm.svelte';
  import { resumeData } from '#lib/resume-data.ts';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Contact · Stephen Frederick</title>
  <meta
    name="description"
    content="Send Stephen Frederick a message about a project or collaboration."
  />
  <meta property="og:title" content="Contact · Stephen Frederick" />
  <meta
    property="og:description"
    content="Send Stephen Frederick a message about a project or collaboration."
  />
</svelte:head>

<div class="min-h-screen">
  <div class="mp-shell">
    <header class="mb-12 max-w-3xl">
      <h1 class="mp-display mb-4">Contact</h1>
      <p class="mp-body mp-body--lg max-w-2xl">{resumeData.availability}</p>
    </header>

    <ContactForm siteKey={data.siteKey} />
  </div>
</div>
