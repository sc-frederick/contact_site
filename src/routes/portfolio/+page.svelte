<script lang="ts">
  import PortfolioGrid from '#lib/components/portfolio/PortfolioGrid.svelte';
  import InkArtwork from '#lib/components/effects/InkArtwork.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let counts = $derived({
    live: data.items.filter((item) => item.status === 'Live').length,
    openSource: data.items.filter((item) => item.status === 'Open source')
      .length,
  });
</script>

<svelte:head>
  <title>Developer portfolio · Stephen Frederick</title>
  <meta
    name="description"
    content="Engineering software, internal tools, and experiments by Stephen Frederick: Surfside Software, Second Set, tsdraft, and more."
  />
  <meta property="og:title" content="Developer portfolio · Stephen Frederick" />
  <meta
    property="og:description"
    content="Engineering software, internal tools, and experiments by Stephen Frederick: Surfside Software, Second Set, tsdraft, and more."
  />
</svelte:head>

<div class="min-h-screen">
  <div class="mp-shell">
    <header class="mp-card mp-card--ink mp-on-ink portfolio-header mb-12">
      <div>
        <p class="mp-eyebrow">Selected work</p>
        <h1 class="mp-display mp-on-ink">
          Developer <span class="mp-italic">portfolio.</span>
        </h1>
      </div>
      <p class="mp-body mp-body--lg max-w-[52ch]">
        Tools I&apos;ve shipped for MEP design, drawing review, permits, and the
        odd workflow problem.
      </p>
      <p class="mp-meta">
        {data.items.length} projects · {counts.live} live · {counts.openSource}
        open source
      </p>
      <InkArtwork class="portfolio-ink-strip" />
    </header>
    <PortfolioGrid items={data.items} />
  </div>
</div>
