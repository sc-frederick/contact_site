/**
 * Fragment shaders for the printed artwork, written in GLSL ES 3.00.
 *
 * Every program receives the shared uniforms declared in `prelude`:
 * `u_resolution` in device pixels, `u_time` in seconds, `u_pointer` in
 * top-left UV space, `u_pointerStrength` easing from 0 to 1 while the pointer
 * is near the artwork, and `u_pixel` as the device pixel ratio. Colors match
 * the Mosaic Press tokens so the canvas lines up with the static SVG beneath.
 */

/** The artwork recipes a shader surface can render. */
export type PrintScene = 'field' | 'signal';

const prelude = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform float u_pixel;

out vec4 outColor;

const vec3 VIOLET = vec3(0.357, 0.247, 1.0);
const vec3 VIOLET_DEEP = vec3(0.227, 0.149, 0.78);
const vec3 GREEN = vec3(0.525, 0.957, 0.416);
const vec3 INK = vec3(0.063);
const vec3 PAPER = vec3(0.984, 0.969, 0.925);

// Ordered 4x4 Bayer threshold for a printed halftone look.
float bayer4(vec2 cell) {
  ivec2 i = ivec2(mod(cell, 4.0));
  float m[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
  return (m[i.x + i.y * 4] + 0.5) / 16.0;
}

// Anti-aliased mask for a line at distance zero with the given half-width.
float line(float distance, float width) {
  float w = max(fwidth(distance), 1e-5);
  return 1.0 - smoothstep(width - w, width + w, abs(distance));
}

vec2 uvFromFrag() {
  return vec2(gl_FragCoord.x / u_resolution.x, 1.0 - gl_FragCoord.y / u_resolution.y);
}
`;

/**
 * Violet paper with flowing green contour lines, like the static ink strip.
 * Lines run left to right; the pointer lifts a soft swell that bends them.
 */
const field = /* glsl */ `${prelude}
void main() {
  vec2 uv = uvFromFrag();
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * vec2(aspect, 1.0);
  float t = u_time;
  vec2 delta = (uv - u_pointer) * vec2(aspect, 1.0);
  float swell = exp(-dot(delta, delta) * 10.0) * u_pointerStrength;

  float h = p.y * 2.4
    + 0.42 * sin(p.x * 1.7 + t * 0.32 + p.y * 1.1)
    + 0.16 * sin(p.x * 3.9 - t * 0.21 + 1.7)
    - swell * 0.55;

  float bands = h * 3.2;
  float contour = line(fract(bands + 0.5) - 0.5, 0.03);
  float major = line(fract(bands / 4.0 + 0.5) - 0.5, 0.02);

  // A slow dithered tone keeps the violet printed rather than flat.
  vec2 cell = floor(gl_FragCoord.xy / (3.0 * u_pixel));
  float tone = 0.5 + 0.5 * sin(h * 1.6 + t * 0.15);
  vec3 paper = mix(VIOLET_DEEP, VIOLET, step(bayer4(cell), 0.55 + tone * 0.45));

  vec3 color = mix(paper, mix(VIOLET, GREEN, 0.35), contour * 0.5);
  color = mix(color, GREEN, major * 0.95);
  outColor = vec4(color, 1.0);
}
`;

/** Dithered green signal rings radiating through ink, nudged by the pointer. */
const signal = /* glsl */ `${prelude}
void main() {
  vec2 uv = uvFromFrag();
  float aspect = u_resolution.x / u_resolution.y;
  vec2 origin = vec2(0.5, 0.71);
  vec2 center = mix(origin, clamp(u_pointer, vec2(0.15), vec2(0.85)), 0.3 * u_pointerStrength);
  float d = length((uv - center) * vec2(aspect, 1.0));
  float ring = pow(0.5 + 0.5 * cos(d * 34.0 - u_time * 2.4), 10.0);
  float fade = 1.0 - smoothstep(0.05, 0.95, d);
  float glow = exp(-d * d * 30.0) * 0.35;

  vec2 cell = floor(gl_FragCoord.xy / (2.0 * u_pixel));
  float value = ring * fade * 0.9 + glow;
  outColor = vec4(mix(INK, GREEN, step(bayer4(cell), value)), 1.0);
}
`;

/** Fragment shader source keyed by artwork kind. */
export const printPrograms: Readonly<Record<PrintScene, string>> = {
  field,
  signal,
};
