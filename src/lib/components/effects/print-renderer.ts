/**
 * A minimal WebGL2 full-screen-triangle renderer for the printed artwork.
 *
 * It replaces a general shader framework with roughly 150 lines: one program
 * per canvas, a shared vertex shader, five uniforms, and a frame loop that
 * runs only while the host says the artwork is visible and motion is allowed.
 */

import { Data } from 'effect';

const vertexSource = /* glsl */ `#version 300 es
void main() {
  // One oversized triangle covers the viewport without a vertex buffer.
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}
`;

/** The browser has no WebGL2 context for this canvas. */
export class WebGLUnavailable extends Data.TaggedError('WebGLUnavailable') {}

/** The driver rejected a shader or program; `log` holds its message. */
export class ShaderCompileFailed extends Data.TaggedError(
  'ShaderCompileFailed',
)<{ readonly log: string }> {}

/** A running renderer bound to one canvas. */
export interface PrintRenderer {
  /** Starts or stops the frame loop. A stopped renderer keeps its last frame. */
  setRunning(running: boolean): void;
  /** Updates the pointer in top-left UV space, or clears it with `null`. */
  setPointer(pointer: { readonly x: number; readonly y: number } | null): void;
  /** Releases the GPU program and observers. */
  destroy(): void;
}

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | ShaderCompileFailed {
  const shader = gl.createShader(type);

  if (!shader) return new ShaderCompileFailed({ log: 'createShader failed' });
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  const log = gl.getShaderInfoLog(shader) ?? 'unknown compile error';

  gl.deleteShader(shader);

  return new ShaderCompileFailed({ log });
}

/**
 * Compiles `fragmentSource` for `canvas` and draws one frame. The caller
 * decides when the loop runs with `setRunning`.
 */
export function createPrintRenderer(
  canvas: HTMLCanvasElement,
  fragmentSource: string,
): PrintRenderer | WebGLUnavailable | ShaderCompileFailed {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });

  if (!gl) return new WebGLUnavailable();

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (vertex instanceof ShaderCompileFailed) return vertex;

  if (fragment instanceof ShaderCompileFailed) return fragment;

  const program = gl.createProgram();

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown link error';

    gl.deleteProgram(program);

    return new ShaderCompileFailed({ log });
  }

  gl.useProgram(program);

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    time: gl.getUniformLocation(program, 'u_time'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    pointerStrength: gl.getUniformLocation(program, 'u_pointerStrength'),
    pixel: gl.getUniformLocation(program, 'u_pixel'),
  };

  let running = false;
  let frame = 0;
  let elapsed = 0;
  let lastTick = 0;
  let pointer = { x: 0.5, y: 0.5 };
  let target: { x: number; y: number } | null = null;
  let strength = 0;

  function resize() {
    // Cap the backing store; the artwork is soft and fill-rate bound.
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl?.viewport(0, 0, width, height);
    gl?.uniform1f(uniforms.pixel, ratio);
  }

  function draw() {
    if (!gl) return;
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.pointerStrength, strength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(now: number) {
    const step = lastTick ? Math.min((now - lastTick) / 1000, 0.1) : 0;

    lastTick = now;
    elapsed += step;

    // Ease the pointer and its influence so motion never snaps.
    const ease = 1 - Math.exp(-step * 8);

    if (target) {
      pointer = {
        x: pointer.x + (target.x - pointer.x) * ease,
        y: pointer.y + (target.y - pointer.y) * ease,
      };
    }

    strength += ((target ? 1 : 0) - strength) * ease;
    draw();
    frame = running ? window.requestAnimationFrame(tick) : 0;
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();

    if (!running) draw();
  });

  resizeObserver.observe(canvas);
  resize();
  draw();

  return {
    setRunning(next) {
      if (next === running) return;
      running = next;

      if (running) {
        lastTick = 0;
        frame = window.requestAnimationFrame(tick);
      } else {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    setPointer(next) {
      if (next && !target) pointer = { ...next };
      target = next ? { ...next } : null;
    },
    destroy() {
      running = false;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
