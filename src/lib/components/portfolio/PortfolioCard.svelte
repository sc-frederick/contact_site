<script lang="ts">
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Github from 'lucide-svelte/icons/github';
  import type { PortfolioItem } from '#lib/types.ts';
  import { cn } from '#lib/utils.ts';

  let {
    item,
    onOpen,
    className,
  }: {
    item: PortfolioItem;
    onOpen?: (item: PortfolioItem) => void;
    className?: string;
  } = $props();

  let hasLinks = $derived(Boolean(item.project_url || item.github_url));

  let onInk = $derived(Boolean(item.highlighted));
</script>

<article
  class={cn(
    'mp-card mp-span-4 project-card',
    onInk && 'mp-card--ink mp-on-ink',
    className,
  )}
>
  <h3 class="mp-title mb-1">
    <button
      type="button"
      onclick={() => onOpen?.(item)}
      class={cn(
        'text-left',
        onInk
          ? 'text-[var(--text-inverted)] hover:text-[var(--color-green)]'
          : 'hover:text-accent',
      )}
    >
      {item.title}
    </button>
  </h3>

  <p class="mp-body mb-2 line-clamp-3">
    {item.description}
  </p>

  <div class="flex flex-wrap gap-2 mb-5">
    {#each item.technologies as tech (tech)}
      <span class={cn('mp-chip')}>
        {tech}
      </span>
    {/each}
  </div>

  {#if hasLinks}
    <div
      class={cn(
        'mp-card__footer border-t pt-4',
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
          <ExternalLink class="mp-icon mp-icon--sm" />
          <span>Live Demo</span>
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
          <Github class="mp-icon mp-icon--sm" />
          <span>Source</span>
        </a>
      {/if}
    </div>
  {/if}
</article>
