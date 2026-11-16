<script lang="ts">
  import type { PortfolioItem } from '#lib/types.ts';
  import PortfolioCard from './PortfolioCard.svelte';
  import PortfolioModal from './PortfolioModal.svelte';

  let { items }: { items: readonly PortfolioItem[] } = $props();

  let activeItem = $state.raw<PortfolioItem | null>(null);

  let sorted = $derived(
    [...items].sort((a, b) => a.display_order - b.display_order),
  );

  let featured = $derived(sorted.filter((item) => item.featured));

  let more = $derived(sorted.filter((item) => !item.featured));

  function open(item: PortfolioItem) {
    activeItem = item;
  }
</script>

{#if items.length === 0}
  <div class="mp-card text-center">
    <p class="mp-body">No portfolio items available yet.</p>
  </div>
{:else}
  <section aria-labelledby="featured-projects" class="mb-14">
    <h2 id="featured-projects" class="mp-eyebrow mp-eyebrow--marker mb-5">
      Featured
    </h2>
    <div class="mp-grid">
      {#each featured as item (item.id)}<PortfolioCard
          {item}
          onOpen={open}
        />{/each}
    </div>
  </section>
  <section aria-labelledby="more-projects">
    <h2 id="more-projects" class="mp-eyebrow mp-eyebrow--marker mb-5">
      More projects
    </h2>
    <div class="mp-grid">
      {#each more as item (item.id)}<PortfolioCard
          {item}
          onOpen={open}
          compact
        />{/each}
    </div>
  </section>
{/if}
{#if activeItem}<PortfolioModal
    item={activeItem}
    onClose={() => (activeItem = null)}
  />{/if}
