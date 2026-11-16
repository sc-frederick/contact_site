<script lang="ts">
  // Lucide has no X mark, only the retired Twitter bird, so this one brand
  // glyph is drawn inline. The padded viewBox matches Lucide's visual weight.
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg
  class={className}
  viewBox="-2 -2 28 28"
  width="24"
  height="24"
  fill="currentColor"
  aria-hidden="true"
  focusable="false"
>
  <path
    d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
  />
</svg>
