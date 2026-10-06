<script lang="ts">
  import ShaderSurface from './ShaderSurface.svelte';

  let { class: className = '' }: { class?: string } = $props();
</script>

<div class={`ink-artwork ${className}`} aria-hidden="true">
  <svg
    viewBox="0 0 600 200"
    preserveAspectRatio="xMidYMid slice"
    class="print-artwork"
  >
    <rect width="600" height="200" fill="#5b3fff" />
    {#each Array.from({ length: 12 }, (_, i) => i) as i (i)}<path
        d={`M-40 ${i * 23 - 110}C180 ${i * 14 + 20} 200 ${i * 35 - 50} 390 ${i * 17 + 10}S540 ${i * 22 + 50} 670 ${i * 19 + 10}`}
        fill="none"
        stroke="#86f46a"
        stroke-width={i % 3 === 0 ? 10 : 2}
        opacity={0.3 + (i % 3) * 0.2}
      />{/each}
  </svg>
  <ShaderSurface artwork={{ kind: 'field' }} />
</div>
