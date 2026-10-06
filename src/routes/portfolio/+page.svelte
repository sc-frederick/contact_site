<script lang="ts">
  import PortfolioGrid from '#lib/components/portfolio/PortfolioGrid.svelte';
  import InkArtwork from '#lib/components/effects/InkArtwork.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div class="min-h-screen">
  <div class="mp-shell">
    <header class="mp-card mp-card--ink mp-on-ink portfolio-header mb-8">
      <div>
        <p class="mp-eyebrow">Selected work</p>
        <h1 class="mp-display mp-on-ink">
          Developer <span class="mp-italic">portfolio.</span>
        </h1>
      </div>
      <p class="mp-body max-w-md">
        Software, internal tools, and experiments that solve workflow problems.
      </p>
      <InkArtwork class="portfolio-ink-strip" />
    </header>
    <PortfolioGrid items={data.items} />
  </div>
</div>
