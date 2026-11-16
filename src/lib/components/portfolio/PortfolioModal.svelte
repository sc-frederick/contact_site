<script lang="ts">
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Github from 'lucide-svelte/icons/github';
  import X from 'lucide-svelte/icons/x';
  import type { PortfolioItem } from '#lib/types.ts';
  import { projectLinkLabel } from './project-links.ts';

  let { item, onClose }: { item: PortfolioItem; onClose: () => void } =
    $props();

  let dialog: HTMLDialogElement | undefined;

  const titleId = $props.id();

  // The native modal dialog traps focus, makes the page inert, closes on
  // Escape, and returns focus to the card's button when it closes.
  function open(element: HTMLDialogElement) {
    dialog = element;
    element.showModal();
    element.addEventListener('close', onClose);

    return () => {
      element.removeEventListener('close', onClose);
      dialog = undefined;
    };
  }
</script>

<dialog
  {@attach open}
  aria-labelledby={titleId}
  class="project-dialog mp-card"
  onclick={(event) => {
    // Clicks on the backdrop target the dialog element itself.
    if (event.target === event.currentTarget) dialog?.close();
  }}
>
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="project-status mb-2" data-status={item.status}>
        {item.status}
      </p>
      <h2 id={titleId} class="mp-headline">{item.title}</h2>
    </div>
    <button
      type="button"
      onclick={() => dialog?.close()}
      class="mp-btn mp-btn--secondary mp-btn--icon"
      aria-label="Close project details"
    >
      <X class="mp-icon" aria-hidden="true" />
    </button>
  </div>

  {#if item.image}
    <img
      class="project-dialog__media"
      src={item.image.src}
      width={item.image.width}
      height={item.image.height}
      alt={item.image.alt}
      decoding="async"
    />
  {/if}

  <p class="mp-body mp-body--lg">
    {item.description}
  </p>

  <div>
    <ul class="project-tech" aria-label="Built with">
      {#each item.technologies as tech (tech)}
        <li class="mp-chip">{tech}</li>
      {/each}
    </ul>
  </div>

  {#if item.project_url || item.github_url}
    <div class="mp-card__footer border-t border-border pt-4">
      {#if item.project_url}
        <a
          href={item.project_url}
          target="_blank"
          rel="noopener noreferrer"
          class="mp-btn mp-btn--sm"
        >
          <ExternalLink class="mp-icon mp-icon--sm" aria-hidden="true" />
          <span>{projectLinkLabel(item.project_url)}</span>
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      {/if}
      {#if item.github_url}
        <a
          href={item.github_url}
          target="_blank"
          rel="noopener noreferrer"
          class="mp-btn mp-btn--secondary mp-btn--sm"
        >
          <Github class="mp-icon mp-icon--sm" aria-hidden="true" />
          <span>Source</span>
          <span class="sr-only">(opens in a new tab)</span>
        </a>
      {/if}
    </div>
  {:else}
    <p class="mp-meta border-t border-border pt-4">Private repository.</p>
  {/if}
</dialog>
