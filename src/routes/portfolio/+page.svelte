<script lang="ts">
  import PortfolioGrid from '#lib/components/portfolio/PortfolioGrid.svelte';
  import InkArtwork from '#lib/components/effects/InkArtwork.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Projects · Stephen Frederick</title>
  <meta
    name="description"
    content="Engineering software, internal tools, and experiments by Stephen Frederick: Surfside Software, Second Set, tsdraft, and more."
  />
  <meta property="og:title" content="Projects · Stephen Frederick" />
  <meta
    property="og:description"
    content="Engineering software, internal tools, and experiments by Stephen Frederick: Surfside Software, Second Set, tsdraft, and more."
  />
</svelte:head>

<div class="min-h-screen">
  <div class="mp-shell">
    <header class="mp-card mp-card--ink mp-on-ink portfolio-header mb-10">
      <div class="portfolio-header__intro">
        <h1 class="mp-display mp-on-ink mb-4">Projects</h1>
        <p class="mp-body mp-body--lg max-w-[48ch]">
          Engineering software and internal tools for MEP design, drawing
          review, and permits.
        </p>
      </div>
      <InkArtwork class="portfolio-ink-strip" />
    </header>
    <PortfolioGrid items={data.items} />
  </div>
</div>
