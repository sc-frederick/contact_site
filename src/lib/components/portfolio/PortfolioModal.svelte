<script lang="ts">
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Github from 'lucide-svelte/icons/github';
  import X from 'lucide-svelte/icons/x';
  import type { PortfolioItem } from '#lib/types.ts';

  let { item, onClose }: { item: PortfolioItem; onClose: () => void } =
    $props();

  let dialog: HTMLDivElement;

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();

      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function trap(element: HTMLDivElement) {
    dialog = element;
    const previousFocus = document.activeElement;
    element.querySelector<HTMLButtonElement>('[data-close-button]')?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;

      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/70 p-4"
  role="presentation"
  onclick={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}
  onkeydown={keydown}
>
  <div
    {@attach trap}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label={`${item.title} project details`}
    class="mp-card max-h-[90vh] w-full max-w-3xl overflow-y-auto"
  >
    <div class="flex items-start justify-between gap-4 mb-6">
      <h2 class="mp-headline">{item.title}</h2>
      <button
        data-close-button
        type="button"
        onclick={onClose}
        class="mp-btn mp-btn--secondary mp-btn--icon"
        aria-label="Close project details"
      >
        <X class="mp-icon" />
      </button>
    </div>

    <p class="mp-body mb-6">
      {item.description}
    </p>

    <div class="mb-8">
      <h3 class="mp-title mb-3">Tech Stack</h3>
      <div class="flex flex-wrap gap-2">
        {#each item.technologies as tech (tech)}
          <span class="mp-chip">
            {tech}
          </span>
        {/each}
      </div>
    </div>

    <div class="mp-card__footer border-t border-border pt-4">
      {#if item.project_url}
        <a
          href={item.project_url}
          target="_blank"
          rel="noopener noreferrer"
          class="mp-btn mp-btn--secondary mp-btn--sm"
        >
          <ExternalLink class="mp-icon mp-icon--sm" />
          <span>Live Demo</span>
        </a>
      {/if}
      {#if item.github_url}
        <a
          href={item.github_url}
          target="_blank"
          rel="noopener noreferrer"
          class="mp-btn mp-btn--secondary mp-btn--sm"
        >
          <Github class="mp-icon mp-icon--sm" />
          <span>Source</span>
        </a>
      {/if}
    </div>
  </div>
</div>
