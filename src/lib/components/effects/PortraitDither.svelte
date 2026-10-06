<script lang="ts">
  const bayer = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];

  const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">${bayer
    .flatMap((row, y) =>
      row.map((value, x) => {
        const level = (1 - value / 64) * 100;

        return `<rect x="${x * 2}" y="${y * 2}" width="2" height="2" fill="rgb(${level}% ${level}% ${level}%)"/>`;
      }),
    )
    .join('')}</svg>`;

  const thresholdTexture = `data:image/svg+xml,${encodeURIComponent(tile)}`;

  let { src }: { src: string } = $props();

  const id = $props.id();

  const filterId = `portrait-dither-${id}`;
</script>

<div class="portrait-print" aria-hidden="true">
  <svg class="portrait-filter" width="0" height="0" focusable="false">
    <defs>
      <filter
        id={filterId}
        x="0"
        y="0"
        width="100%"
        height="100%"
        color-interpolation-filters="sRGB"
      >
        <feComponentTransfer in="SourceGraphic">
          <feFuncR type="gamma" amplitude="1" exponent="2.2" offset="0" />
          <feFuncG type="gamma" amplitude="1" exponent="2.2" offset="0" />
          <feFuncB type="gamma" amplitude="1" exponent="2.2" offset="0" />
        </feComponentTransfer>
        <feColorMatrix
          type="matrix"
          values=".299 .587 .114 0 0 .299 .587 .114 0 0 .299 .587 .114 0 0 0 0 0 1 0"
          result="luminance"
        />
        <feImage
          href={thresholdTexture}
          x="0"
          y="0"
          width="16"
          height="16"
          result="threshold"
        />
        <feTile in="threshold" result="pattern" />

        <feComposite
          in="luminance"
          in2="pattern"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="-0.57"
        />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0.062745 0.94902" />
          <feFuncG type="discrete" tableValues="0.062745 0.917647" />
          <feFuncB type="discrete" tableValues="0.062745 0.847059" />
          <feFuncA type="linear" slope="0" intercept="1" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
  <img
    {src}
    alt=""
    class="h-full w-full object-cover"
    style:filter={`url(#${filterId})`}
  />
</div>
