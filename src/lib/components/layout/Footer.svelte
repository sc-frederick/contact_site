<script lang="ts">
  import Github from 'lucide-svelte/icons/github';
  import Linkedin from 'lucide-svelte/icons/linkedin';
  import Mail from 'lucide-svelte/icons/mail';
  import XLogo from '../icons/XLogo.svelte';
  import { page } from '$app/state';
  import { contactData } from '#lib/contact-data.ts';
  import MotionControl from '../effects/MotionControl.svelte';
</script>

<footer class="border-t border-border bg-bg-surface px-6 py-8">
  <div
    class="mx-auto grid max-w-[1240px] items-center gap-6 text-center md:grid-cols-3 md:text-left"
  >
    <div class="flex flex-col items-center gap-2 md:items-start">
      <p class="mp-meta">
        &copy; {new Date().getFullYear()}
        {contactData.name}
      </p>
      <MotionControl />
    </div>

    {#if page.url.pathname === '/contact'}
      <span aria-hidden="true"></span>
    {:else}
      <a href="/contact" class="mp-btn mp-btn--accent justify-self-center">
        <Mail class="mp-icon" />
        Get in touch
      </a>
    {/if}

    <div class="flex items-center justify-center gap-4 md:justify-self-end">
      <a
        href={contactData.github}
        target="_blank"
        rel="noopener noreferrer"
        class="mp-btn mp-btn--ghost mp-btn--icon"
        aria-label="GitHub"
      >
        <Github class="mp-icon" />
      </a>
      <a
        href={contactData.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        class="mp-btn mp-btn--ghost mp-btn--icon"
        aria-label="LinkedIn"
      >
        <Linkedin class="mp-icon" />
      </a>
      <a
        href={contactData.x}
        target="_blank"
        rel="noopener noreferrer"
        class="mp-btn mp-btn--ghost mp-btn--icon"
        aria-label="X"
      >
        <XLogo class="mp-icon" />
      </a>
      <a
        href="https://www.google.com/maps/search/?api=1&query=Brooksville%2C+FL"
        target="_blank"
        rel="noopener noreferrer"
        class="mp-meta footer-location hover:text-accent"
      >
        Brooksville, FL
      </a>
    </div>
  </div>
</footer>
