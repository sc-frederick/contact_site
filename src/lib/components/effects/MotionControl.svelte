<script lang="ts">
  import Pause from 'lucide-svelte/icons/pause';
  import Play from 'lucide-svelte/icons/play';
  import { getMotion } from './motion.svelte.ts';

  const motion = getMotion();
</script>

{#if motion.ready}
  {#if motion.reducedMotion}
    <span class="motion-control mp-meta">Reduced motion</span>
  {:else}
    <button
      class="motion-control"
      type="button"
      onclick={() => (motion.paused = !motion.paused)}
      aria-pressed={motion.paused}
    >
      {#if motion.paused}<Play size={12} aria-hidden="true" />{:else}<Pause
          size={12}
          aria-hidden="true"
        />{/if}
      {motion.paused ? 'Resume motion' : 'Pause motion'}
    </button>
  {/if}
{/if}
