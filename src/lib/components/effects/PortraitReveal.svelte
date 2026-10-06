<script lang="ts">
  import PortraitDither from './PortraitDither.svelte';
  import { getMotion } from './motion.svelte.ts';

  let { src, alt }: { src: string; alt: string } = $props();

  let inside = $state(false);

  const motion = getMotion();

  function move(event: PointerEvent & { currentTarget: HTMLDivElement }) {
    if (
      !motion.motionAllowed ||
      !motion.finePointer ||
      event.pointerType === 'touch'
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--reveal-x',
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      '--reveal-y',
      `${event.clientY - rect.top}px`,
    );
    inside = true;
  }
</script>

<div
  class="portrait-reveal"
  role="presentation"
  data-reveal={inside && motion.motionAllowed && motion.finePointer}
  onpointermove={move}
  onpointerleave={() => (inside = false)}
>
  <img {src} {alt} fetchpriority="high" class="h-full w-full object-cover" />
  <PortraitDither {src} />
  {#if motion.motionAllowed && motion.finePointer}<span class="portrait-hint"
      >Move to reveal</span
    >{/if}
</div>
