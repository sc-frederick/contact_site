<script lang="ts">
  import ShaderSurface from './ShaderSurface.svelte';

  const id = $props.id();
</script>

<div class="draft-artwork" aria-hidden="true">
  <svg viewBox="0 0 360 180" class="print-artwork">
    <defs
      ><pattern
        id={`${id}-grid`}
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
        ><circle cx="6" cy="6" r="0.7" fill="#5b3fff" opacity="0.5" /></pattern
      ></defs
    >
    <rect width="360" height="180" fill={`url(#${id}-grid)`} />
    <g stroke="#5b3fff" fill="none"
      ><circle cx="210" cy="90" r="52" opacity="0.65" /><path
        d="M210 5V175M95 90H325M119 24H302V156H119Z"
        opacity="0.25"
        stroke-width="0.75"
      /><path d="M162 144L262 40" opacity="0.6" /><path
        d="M195 90H225M210 75V105"
      /></g
    >
  </svg>
  <ShaderSurface artwork={{ kind: 'draft' }} />
</div>
