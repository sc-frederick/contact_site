<script lang="ts">
  import { page } from '$app/state';
  import ArrowLeft from 'lucide-svelte/icons/arrow-left';
</script>

<div class="mp-shell flex min-h-[calc(100vh-72px)] items-center justify-center">
  <div class="mp-card max-w-md text-center">
    <p class="mp-eyebrow">Error {page.status}</p>
    <h1 class="mp-headline">
      {page.status === 404 ? 'Page not found' : 'Something went wrong'}
    </h1>
    <p class="mp-body">
      {page.status === 404
        ? 'The page you are looking for does not exist or has been moved.'
        : 'Please try again later.'}
    </p>
    <a href="/" class="mp-btn self-center"
      ><ArrowLeft class="mp-icon" />Back to home</a
    >
  </div>
</div>
