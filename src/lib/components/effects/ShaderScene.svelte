<script lang="ts">
  import { CustomShader, Dither, Shader } from 'shaders/svelte';
  import {
    DraftingGrid,
    InkField,
    ProjectDrawing,
    SignalRings,
  } from './print-shaders';
  import type { ProjectPattern, ShaderSceneProps } from './effect-types';

  let { artwork, onReady, onUnavailable }: ShaderSceneProps = $props();

  const motifs: Record<ProjectPattern, number> = {
    network: 0,
    flow: 1,
    scan: 2,
    grid: 3,
    orbits: 4,
    wave: 5,
  };
</script>

<Shader
  class="shader-canvas"
  colorSpace="srgb"
  disableTelemetry
  onready={onReady}
  onunavailable={onUnavailable}
>
  {#if artwork.kind === 'field'}
    <Dither pattern="bayer4" pixelSize={3} colorMode="source" threshold={0.48}
      ><CustomShader src={InkField} /></Dither
    >
  {:else if artwork.kind === 'draft'}
    <CustomShader src={DraftingGrid} />
  {:else if artwork.kind === 'signal'}
    <Dither
      pattern="bayer4"
      pixelSize={2}
      colorA="#101010"
      colorB="#86f46a"
      threshold={0.32}><CustomShader src={SignalRings} /></Dither
    >
  {:else if artwork.kind === 'project'}
    <CustomShader
      src={ProjectDrawing}
      motif={motifs[artwork.pattern]}
      seed={artwork.seed}
    />
  {/if}
</Shader>
