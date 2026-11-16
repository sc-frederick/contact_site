<script lang="ts">
  import { page } from '$app/state';
  import ArrowLeft from 'lucide-svelte/icons/arrow-left';
</script>

<svelte:head><title>{page.status} · Stephen Frederick</title></svelte:head>

<div class="mp-shell flex min-h-[calc(100vh-72px)] items-center justify-center">
  <div class="mp-card max-w-md text-center">
    <h1 class="mp-headline">
      {page.status === 404 ? 'Page not found' : 'Something went wrong'}
    </h1>
    <p class="mp-body">
      {page.status === 404
        ? 'Nothing lives at this address.'
        : 'Please try again later.'}
    </p>
    <a href="/" class="mp-btn self-center"
      ><ArrowLeft class="mp-icon" />Back to home</a
    >
  </div>
</div>
