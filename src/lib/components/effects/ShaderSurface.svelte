<script lang="ts">
  import type { Component } from 'svelte';
  import { getMotion } from './motion.svelte.ts';
  import type { EffectArtwork, ShaderSceneProps } from './effect-types';

  let { artwork, active = true }: { artwork: EffectArtwork; active?: boolean } =
    $props();

  const motion = getMotion();

  let Scene = $state.raw<Component<ShaderSceneProps> | null>(null);

  let nearView = $state(false);

  let status = $state<'loading' | 'ready' | 'unavailable'>('loading');

  let enabled = $derived(
    motion.motionAllowed && nearView && active && status !== 'unavailable',
  );

  function observe(element: HTMLDivElement) {
    if (!('gpu' in navigator) || navigator.gpu == null) {
      status = 'unavailable';

      return;
    }

    const rect = element.getBoundingClientRect();

    if (rect.bottom >= -240 && rect.top <= window.innerHeight + 240) {
      nearView = true;

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        nearView = true;
        observer.disconnect();
      },
      { rootMargin: '240px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }

  // This asynchronous resource acquisition needs cleanup when visibility or
  // preferences change; it cannot be expressed as a synchronous derived value.
  $effect(() => {
    if (!motion.motionAllowed || !nearView || status === 'unavailable' || Scene)
      return;
    let cancelled = false;
    void import('./ShaderScene.svelte').then(
      (module) => {
        if (!cancelled) Scene = module.default;
      },
      () => {
        if (!cancelled) status = 'unavailable';
      },
    );

    return () => {
      cancelled = true;
    };
  });
</script>

<div
  {@attach observe}
  aria-hidden="true"
  class="shader-surface"
  data-artwork={artwork.kind}
  data-shader-status={status === 'unavailable'
    ? 'unavailable'
    : enabled
      ? status
      : 'static'}
>
  {#if enabled && Scene}
    <svelte:boundary onerror={() => (status = 'unavailable')}>
      <Scene
        {artwork}
        onReady={() => (status = 'ready')}
        onUnavailable={() => (status = 'unavailable')}
      />
      {#snippet failed()}<!-- Static artwork remains underneath the unavailable renderer. -->{/snippet}
    </svelte:boundary>
  {/if}
</div>
