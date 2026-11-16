<script lang="ts">
  import { onMount } from 'svelte';
  import type { LayoutProps } from './$types';
  import '@fontsource/instrument-serif/latin-400.css';
  import '@fontsource/instrument-serif/latin-400-italic.css';
  import '@fontsource-variable/inter-tight/wght.css';
  import '../styles.css';
  import Navbar from '#lib/components/layout/Navbar.svelte';
  import Footer from '#lib/components/layout/Footer.svelte';
  import PixelTrail from '#lib/components/effects/PixelTrail.svelte';
  import {
    MotionPreferences,
    setMotion,
  } from '#lib/components/effects/motion.svelte.ts';

  let { children }: LayoutProps = $props();

  const motion = new MotionPreferences();

  setMotion(motion);

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    function sync() {
      motion.reducedMotion = reduced.matches;
      motion.finePointer = pointer.matches;
      motion.visible = document.visibilityState === 'visible';
      motion.ready = true;
    }

    sync();
    reduced.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);

    return () => {
      reduced.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      delete document.documentElement.dataset.motion;
    };
  });

  $effect(() => {
    document.documentElement.dataset.motion = motion.motionAllowed
      ? 'on'
      : 'off';
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#f2ead8" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Stephen Frederick" />
</svelte:head>
<PixelTrail />
<Navbar />
<main class="flex min-h-0 flex-1 flex-col pt-[73px]">{@render children()}</main>
<Footer />
