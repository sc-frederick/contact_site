<script lang="ts">
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Github from 'lucide-svelte/icons/github';
  import type { PortfolioItem } from '#lib/types.ts';
  import { cn } from '#lib/utils.ts';
  import { projectLinkLabel } from './project-links.ts';

  let {
    item,
    onOpen,
    compact = false,
    span = 4,
  }: {
    item: PortfolioItem;
    onOpen: (item: PortfolioItem) => void;
    /** Secondary projects use a denser card with a one-line stack. */
    compact?: boolean;
    /** Grid columns out of twelve on wide screens. */
    span?: number;
  } = $props();

  /** Cards show the leading technologies; the dialog lists all of them. */
  const visibleTechnologies = 3;

  let onInk = $derived(Boolean(item.highlighted));
</script>

<article
  style:--project-span={span}
  class={cn(
    'mp-card mp-card--interactive project-card',
    compact && 'mp-card--compact project-card--compact',
    compact && item.image && span === 8 && 'project-card--wide',
    onInk && 'mp-card--ink mp-on-ink',
  )}
>
  {#if item.image}
    <img
      class="project-card__media"
      src={item.image.srcSmall}
      srcset={`${item.image.srcSmall} 720w, ${item.image.src} 1400w`}
      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 400px"
      width={item.image.width}
      height={item.image.height}
      alt={item.image.alt}
      loading="lazy"
      decoding="async"
    />
  {/if}
  {#if item.status !== 'Internal'}
    <p class="project-status" data-status={item.status}>{item.status}</p>
  {/if}
  <h3 class="mp-title">
    <button
      type="button"
      onclick={() => onOpen(item)}
      class="project-card__open"
      aria-haspopup="dialog"
    >
      {item.title}
    </button>
  </h3>

  <p class="mp-body">
    {item.summary}
  </p>

  {#if compact}
    <div class="project-card__base">
      <ul class="mp-meta stack-line" aria-label="Built with">
        {#each item.technologies.slice(0, visibleTechnologies) as tech (tech)}
          <li>{tech}</li>
        {/each}
      </ul>
      {#if item.project_url}
        <a
          href={item.project_url}
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__inline-link"
        >
          {projectLinkLabel(item.project_url)}<ArrowUpRight
            class="mp-icon mp-icon--sm"
            aria-hidden="true"
          /><span class="sr-only"> for {item.title} (opens in a new tab)</span>
        </a>
      {/if}
    </div>
  {:else}
    <ul class="project-tech" aria-label="Technologies">
      {#each item.technologies.slice(0, visibleTechnologies) as tech (tech)}
        <li class="mp-chip">{tech}</li>
      {/each}
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
            class="mp-btn mp-btn--secondary mp-btn--sm"
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
            class="mp-btn mp-btn--secondary mp-btn--sm"
          >
            <Github class="mp-icon mp-icon--sm" aria-hidden="true" />
            <span>Source</span>
            <span class="sr-only">for {item.title} (opens in a new tab)</span>
          </a>
        {/if}
      </div>
    {/if}
  {/if}
</article>
