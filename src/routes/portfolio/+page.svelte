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
    <header class="mp-card mp-card--ink mp-on-ink portfolio-header mb-10">
      <div class="portfolio-header__intro">
        <p class="mp-eyebrow">Selected work</p>
        <h1 class="mp-display mp-on-ink mb-4">
          Developer <span class="mp-italic">portfolio.</span>
        </h1>
        <p class="mp-body mp-body--lg max-w-[48ch]">
          Tools I&apos;ve shipped for MEP design, drawing review, permits, and
          the odd workflow problem.
        </p>
      </div>
      <dl class="portfolio-stats">
        <div>
          <dt class="mp-eyebrow">Projects</dt>
          <dd>{data.items.length}</dd>
        </div>
        <div>
          <dt class="mp-eyebrow">Live</dt>
          <dd>{counts.live}</dd>
        </div>
        <div>
          <dt class="mp-eyebrow">Open source</dt>
          <dd>{counts.openSource}</dd>
        </div>
      </dl>
      <InkArtwork class="portfolio-ink-strip" />
    </header>
    <PortfolioGrid items={data.items} />
  </div>
</div>
