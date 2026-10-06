<script lang="ts">
  import ShaderSurface from './ShaderSurface.svelte';
  import { getMotion } from './motion.svelte.ts';

  let { sent }: { sent: boolean } = $props();

  const motion = getMotion();
</script>

<div
  class="signal-artwork"
  data-sent={sent}
  data-motion={motion.motionAllowed}
  aria-hidden="true"
>
  <svg viewBox="0 0 420 240" class="print-artwork">
    <g fill="none" stroke="#86f46a"
      >{#each [18, 42, 68, 96, 126, 158, 192] as r, i (r)}<circle
          cx="210"
          cy="170"
          {r}
          opacity={0.6 - i * 0.07}
          stroke-dasharray="1 5"
          stroke-width="2"
        />{/each}</g
    >
  </svg>
  <ShaderSurface artwork={{ kind: 'signal' }} />
  <span class="signal-outgoing"></span>
</div>
