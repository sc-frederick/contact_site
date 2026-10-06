<script lang="ts">
  import ShaderSurface from './ShaderSurface.svelte';
  import type { ProjectPattern } from './effect-types';

  let {
    pattern,
    seed,
    active,
  }: { pattern: ProjectPattern; seed: number; active: boolean } = $props();

  const id = $props.id();

  let wave = $derived(
    Array.from(
      { length: 61 },
      (_, i) =>
        `${i === 0 ? 'M' : 'L'}${i * 7} ${75 + Math.sin(i * 0.22 + seed) * 26}`,
    ).join(' '),
  );
</script>

<div class={`project-art project-art--${pattern}`} aria-hidden="true">
  <svg
    viewBox="0 0 420 150"
    preserveAspectRatio="xMidYMid slice"
    class="print-artwork"
  >
    <defs>
      <linearGradient id={`${id}-ink`}
        ><stop stop-color="#3a26c7" /><stop
          offset="1"
          stop-color="#4cb234"
        /></linearGradient
      >
      <pattern
        id={`${id}-dots`}
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
        ><circle cx="6" cy="6" r="0.7" fill="#5b3fff" opacity="0.22" /></pattern
      >
    </defs>
    <rect width="420" height="150" fill="#f2ead8" />
    <rect width="420" height="150" fill={`url(#${id}-dots)`} />
    <g fill="none" stroke={`url(#${id}-ink)`} stroke-width="1.5">
      {#if pattern === 'network'}
        <path
          d="M40 98L106 42L180 83L249 36L326 77L383 46M106 42L116 121L180 83L263 123L326 77M40 98L116 121M249 36L263 123M180 83L326 77"
          opacity="0.65"
        />
        {#each [[40, 98], [106, 42], [116, 121], [180, 83], [249, 36], [263, 123], [326, 77], [383, 46]] as [x, y], i (`${x}-${y}`)}<circle
            cx={x}
            cy={y}
            r={i === 3 ? 10 : 5}
            fill="#f2ead8"
          />{/each}
        <circle
          cx="180"
          cy="83"
          r="19"
          stroke-dasharray="2 5"
          class="project-orbit"
        />
      {/if}
      {#if pattern === 'flow'}
        <path
          d="M0 75H75Q105 75 105 45V23M75 75Q105 75 105 105V135M75 75H207Q239 75 239 42V15M207 75Q239 75 239 108V140M207 75H339Q371 75 371 45V25M339 75Q371 75 371 105V137M339 75H420"
          stroke-width="2"
        />
        <path
          d="M0 75H420"
          class="project-flow"
          stroke="#86f46a"
          stroke-width="3"
          stroke-dasharray="5 28"
        />
        {#each [105, 239, 371] as x (x)}{#each [28, 128] as y (y)}<circle
              cx={x}
              cy={y}
              r="12"
              stroke-dasharray="2 4"
            />{/each}{/each}
      {/if}
      {#if pattern === 'scan'}
        <path
          d="M51 18H369V133H51ZM68 34H156V88H68ZM177 34H259V61H177ZM282 34H353V116H282ZM177 79H259V116H177ZM68 103H156M68 114H139"
          opacity="0.75"
        />
        <path
          d="M34 65H387"
          stroke="#86f46a"
          stroke-width="3"
          class="project-scan"
        />
        <path d="M35 34V13H57M363 13H385V34M35 117V138H57M363 138H385V117" />
      {/if}
      {#if pattern === 'grid'}
        {#each Array.from({ length: 9 }, (_, i) => i) as i (i)}<path
            d={`M${i * 48 + 18} 0V150M0 ${i * 24 + 3}H420`}
            opacity="0.25"
            stroke-width="0.7"
          />{/each}
        <circle cx="262" cy="75" r="47" /><circle
          cx="262"
          cy="75"
          r="33"
          stroke-dasharray="3 5"
        />
        <path
          d="M38 123L173 29L310 111M173 29V124M38 123H347M262 10V140M197 75H330"
        />
        <path d="M157 123V108H173" />
      {/if}
      {#if pattern === 'orbits'}
        <g class="project-orbit"
          ><ellipse
            cx="210"
            cy="75"
            rx="130"
            ry="36"
            transform="rotate(18 210 75)"
          /><ellipse
            cx="210"
            cy="75"
            rx="130"
            ry="36"
            transform="rotate(-18 210 75)"
          /><circle cx="210" cy="75" r="43" /><circle
            cx="333"
            cy="114"
            r="5"
            fill="#86f46a"
          /></g
        >
        <circle cx="210" cy="75" r="7" fill="#5b3fff" />
      {/if}
      {#if pattern === 'wave'}
        <path d={wave} stroke-width="2" />
        <path d={wave} transform="translate(0 -15)" opacity="0.25" /><path
          d={wave}
          transform="translate(0 15)"
          opacity="0.25"
        />
        {#each Array.from({ length: 30 }, (_, i) => i) as i (i)}<path
            d={`M${i * 14 + 7} ${75 - Math.abs(Math.sin(i * 0.33 + seed)) * 40}V${75 + Math.abs(Math.sin(i * 0.33 + seed)) * 40}`}
            opacity="0.15"
          />{/each}
      {/if}
    </g>
  </svg>
  <ShaderSurface artwork={{ kind: 'project', pattern, seed }} {active} />
</div>
