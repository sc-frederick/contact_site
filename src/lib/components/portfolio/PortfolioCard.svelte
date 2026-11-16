<script lang="ts">
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Github from 'lucide-svelte/icons/github';
  import type { PortfolioItem } from '#lib/types.ts';
  import { cn } from '#lib/utils.ts';
  import { projectLinkLabel } from './project-links.ts';

  let {
    item,
    onOpen,
  }: {
    item: PortfolioItem;
    onOpen: (item: PortfolioItem) => void;
  } = $props();

  /** Cards show the leading technologies; the dialog lists all of them. */
  const visibleTechnologies = 4;

  let onInk = $derived(Boolean(item.highlighted));

  let hiddenCount = $derived(
    Math.max(0, item.technologies.length - visibleTechnologies),
  );
</script>

<article
  class={cn(
    'mp-card mp-card--interactive mp-span-4 project-card',
    onInk && 'mp-card--ink mp-on-ink',
  )}
>
  <p class="project-status" data-status={item.status}>{item.status}</p>
  <h2 class="mp-title">
    <button
      type="button"
      onclick={() => onOpen(item)}
      class="project-card__open"
      aria-haspopup="dialog"
    >
      {item.title}
    </button>
  </h2>

  <p class="mp-body line-clamp-3">
    {item.description}
  </p>

  <ul class="project-tech" aria-label="Technologies">
    {#each item.technologies.slice(0, visibleTechnologies) as tech (tech)}
      <li class="mp-chip">{tech}</li>
    {/each}
    {#if hiddenCount > 0}
      <li class="mp-chip project-tech__more">
        +{hiddenCount}<span class="sr-only"> more</span>
      </li>
    {/if}
  </ul>

  {#if item.project_url || item.github_url}
    <div
      class={cn(
        'mp-card__footer project-card__links border-t pt-4',
        onInk ? 'border-white/15' : 'border-border',
      )}
    >
      {#if item.project_url}
        <a
          href={item.project_url}
          target="_blank"
          rel="noopener noreferrer"
          class={cn(
            'mp-btn mp-btn--sm',
            onInk ? 'mp-btn--secondary' : 'mp-btn--ghost',
          )}
        >
          <ExternalLink class="mp-icon mp-icon--sm" aria-hidden="true" />
          <span>{projectLinkLabel(item.project_url)}</span>
          <span class="sr-only">for {item.title} (opens in a new tab)</span>
        </a>
      {/if}

      {#if item.github_url}
        <a
          href={item.github_url}
          target="_blank"
          rel="noopener noreferrer"
          class={cn(
            'mp-btn mp-btn--sm',
            onInk ? 'mp-btn--secondary' : 'mp-btn--ghost',
          )}
        >
          <Github class="mp-icon mp-icon--sm" aria-hidden="true" />
          <span>Source</span>
          <span class="sr-only">for {item.title} (opens in a new tab)</span>
        </a>
      {/if}
    </div>
  {/if}
</article>
