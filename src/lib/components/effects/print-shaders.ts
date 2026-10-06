import { defineShader, transformColor, wgsl } from 'shaders/std';

/** A flowing ink field that bends locally around the pointer. */
export const InkField = defineShader({
  name: 'FrederickInkField',
  animatedTime: { speed: 'speed' },
  props: {
    speed: { default: 0.2 },
    ink: { default: '#5b3fff', transform: transformColor },
    paper: { default: '#86f46a', transform: transformColor },
  },
  paint: wgsl`
    let delta = (uv - pointer) * vec2f(aspect, 1.0);
    let influence = exp(-dot(delta, delta) * 8.0);
    let p = uv * vec2f(aspect, 1.0) + delta * influence * 0.16;
    let wave = sin(p.x * 4.0 + sin(p.y * 6.0 - time) * 1.5 + time * 0.4);
    let bands = 0.5 + 0.5 * sin(wave * 2.0 + p.y * 5.0 - time);
    let value = smoothstep(0.2, 0.85, bands);
    return vec4f(mix(ink.rgb, paper.rgb, value), 1.0);
  `,
});

/** A drafting sheet whose dots, major lines, and circles flex around the pointer. */
export const DraftingGrid = defineShader({
  name: 'FrederickDraftingGrid',
  props: {
    ink: { default: '#5b3fff', transform: transformColor },
    paper: { default: '#fbf7ec', transform: transformColor },
  },
  paint: wgsl`
    let delta = (uv - pointer) * vec2f(aspect, 1.0);
    let influence = exp(-dot(delta, delta) * 12.0);
    let p = uv * vec2f(aspect, 1.0) + delta * influence * 0.12;
    let cells = p * 22.0;
    let cell = fract(cells) - 0.5;
    let dot = 1.0 - smoothstep(0.025, 0.055, length(cell));
    let major = abs(fract(cells / 5.0 + 0.5) - 0.5);
    let grid = 1.0 - smoothstep(0.002, 0.008, min(major.x, major.y));
    let d = length((p - vec2f(aspect * 0.58, 0.5)));
    let rings = 1.0 - smoothstep(0.0015, 0.004, abs(d - 0.29));
    let cross = max(1.0 - smoothstep(0.001, 0.004, abs(p.y - 0.5)), 1.0 - smoothstep(0.001, 0.004, abs(p.x - aspect * 0.58)));
    let strength = max(max(dot * 0.45, grid * 0.18), max(rings * 0.65, cross * 0.2));
    return vec4f(mix(paper.rgb, ink.rgb, strength), 1.0);
  `,
});

/** Concentric signal rings follow the pointer through a field of printed ink. */
export const SignalRings = defineShader({
  name: 'FrederickSignalRings',
  animatedTime: { speed: 'speed' },
  props: {
    speed: { default: 0.35 },
    ink: { default: '#101010', transform: transformColor },
    accent: { default: '#86f46a', transform: transformColor },
  },
  paint: wgsl`
    let center = mix(vec2f(0.5, 0.7), clamp(pointer, vec2f(0.15), vec2f(0.85)), 0.35);
    let d = length((uv - center) * vec2f(aspect, 1.0));
    let ring = pow(0.5 + 0.5 * cos(d * 38.0 - time * 3.0), 12.0);
    let fade = 1.0 - smoothstep(0.1, 0.95, d);
    return vec4f(mix(ink.rgb, accent.rgb, ring * fade * 0.85), 1.0);
  `,
});

/** Six geometric project motifs share a print palette and react to pointer movement. */
export const ProjectDrawing = defineShader({
  name: 'FrederickProjectDrawing',
  animatedTime: { speed: 'speed' },
  props: {
    speed: { default: 0.4 },
    motif: { default: 0 },
    seed: { default: 1 },
    ink: { default: '#3a26c7', transform: transformColor },
    paper: { default: '#f2ead8', transform: transformColor },
    accent: { default: '#86f46a', transform: transformColor },
  },
  paint: wgsl`
    let delta = (uv - pointer) * vec2f(aspect, 1.0);
    let push = delta * exp(-dot(delta, delta) * 8.0) * 0.08;
    let p = uv * vec2f(aspect, 1.0) + push;
    var mark = 0.0;
    if (motif < 0.5) {
      let cells = p * 5.0;
      let cell = fract(cells) - 0.5;
      let node = 1.0 - smoothstep(0.055, 0.08, length(cell));
      let connections = 1.0 - smoothstep(0.012, 0.026, min(abs(cell.x), abs(cell.y)));
      let pulse = 0.55 + 0.45 * sin(floor(cells.x) + floor(cells.y) + time * 2.0);
      mark = max(node, connections * pulse * 0.65);
    } else if (motif < 1.5) {
      let wave = p.y * 6.0 + sin(p.x * 3.0 - time) * 0.6;
      mark = 1.0 - smoothstep(0.025, 0.06, abs(fract(wave) - 0.5));
      let droplets = 1.0 - smoothstep(0.07, 0.13, length(fract(p * vec2f(4.0, 6.0) - vec2f(time * 0.2, 0.0)) - 0.5));
      mark = max(mark * 0.7, droplets);
    } else if (motif < 2.5) {
      let cell = abs(fract(p * 8.0) - 0.5);
      let sheet = 1.0 - smoothstep(0.007, 0.022, min(cell.x, cell.y));
      let scan = exp(-pow(uv.y - fract(time * 0.25 + seed * 0.13), 2.0) * 250.0);
      mark = max(sheet * 0.32, scan);
    } else if (motif < 3.5) {
      let cell = abs(fract(p * 8.0) - 0.5);
      let grid = 1.0 - smoothstep(0.01, 0.025, min(cell.x, cell.y));
      let diag = 1.0 - smoothstep(0.012, 0.025, abs(p.y - p.x * 0.25 + 0.1 * sin(time)));
      let circle = 1.0 - smoothstep(0.008, 0.022, abs(length(p - vec2f(aspect * 0.65, 0.5)) - 0.32));
      mark = max(grid * 0.32, max(circle, diag));
    } else if (motif < 4.5) {
      let d = length(p - vec2f(aspect * 0.5, 0.5));
      mark = 1.0 - smoothstep(0.008, 0.02, abs(fract(d * 5.0 - time * 0.05) - 0.5));
    } else {
      let wave = sin(p.x * 10.0 + time * 2.0 + seed) * 0.18;
      mark = 1.0 - smoothstep(0.009, 0.028, abs(uv.y - 0.5 - wave));
      let columns = 1.0 - smoothstep(0.02, 0.05, abs(fract(p.x * 12.0) - 0.5));
      mark = max(mark, columns * (1.0 - smoothstep(0.03, 0.25, abs(uv.y - 0.5))) * 0.45);
    }
    let color = mix(ink.rgb, accent.rgb, smoothstep(0.3, 0.9, uv.x));
    return vec4f(mix(paper.rgb, color, mark), 1.0);
  `,
});
