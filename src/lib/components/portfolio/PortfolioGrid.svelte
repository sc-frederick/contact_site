<script lang="ts">
  import type { PortfolioItem } from '#lib/types.ts';
  import PortfolioCard from './PortfolioCard.svelte';
  import PortfolioModal from './PortfolioModal.svelte';

  let { items }: { items: PortfolioItem[] } = $props();

  let activeItem = $state.raw<PortfolioItem | null>(null);

  let sorted = $derived(
    [...items].sort((a, b) => a.display_order - b.display_order),
  );
</script>

{#if items.length === 0}
  <div class="mp-card text-center">
    <p class="mp-body">No portfolio items available yet.</p>
  </div>
{:else}
  <section aria-label="Projects" class="mp-grid">
    {#each sorted as item (item.id)}<PortfolioCard
        {item}
        onOpen={(selectedItem) => (activeItem = selectedItem)}
      />{/each}
  </section>
{/if}
{#if activeItem}<PortfolioModal
    item={activeItem}
    onClose={() => (activeItem = null)}
  />{/if}
