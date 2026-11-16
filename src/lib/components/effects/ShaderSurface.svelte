<script lang="ts">
  import { getMotion } from './motion.svelte.ts';
  import {
    createPrintRenderer,
    ShaderCompileFailed,
    WebGLUnavailable,
    type PrintRenderer,
  } from './print-renderer.ts';
  import { printPrograms, type PrintScene } from './print-shaders.ts';

  let { scene }: { scene: PrintScene } = $props();

  const motion = getMotion();

  /** How far outside the artwork the pointer still bends it, in CSS pixels. */
  const pointerReach = 160;

  /**
   * Owns the WebGL renderer for one canvas. The renderer starts once motion is
   * allowed and the artwork nears the viewport, runs only while both stay
   * true, and is released with the canvas. Until it is ready, or after a
   * failure, the static SVG underneath shows. Status is written to the host's
   * `data-shader-status` for CSS and the UX audit.
   */
  function surface(canvas: HTMLCanvasElement) {
    const host = canvas.parentElement;
    const program = printPrograms[scene];
    let renderer: PrintRenderer | null = null;
    let failed = false;
    let inView = false;

    function sync(motionAllowed: boolean) {
      const running = motionAllowed && inView;

      if (running && !renderer && !failed) {
        const result = createPrintRenderer(canvas, program);

        if (result instanceof ShaderCompileFailed)
          console.warn(`Print shader "${scene}" failed:`, result.log);

        if (
          result instanceof ShaderCompileFailed ||
          result instanceof WebGLUnavailable
        ) {
          failed = true;
          host?.setAttribute('data-shader-status', 'unavailable');

          return;
        }

        renderer = result;
        host?.setAttribute('data-shader-status', 'ready');
      }

      renderer?.setRunning(running);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        sync(motion.motionAllowed);
      },
      { rootMargin: '120px' },
    );

    observer.observe(canvas);

    // A nested effect tracks motion preferences without re-running the
    // attachment, which would rebuild the GPU program.
    $effect(() => sync(motion.motionAllowed));

    function move(event: PointerEvent) {
      if (
        !renderer ||
        event.pointerType === 'touch' ||
        !motion.finePointer ||
        !motion.motionAllowed
      )
        return;
      const rect = canvas.getBoundingClientRect();

      const near =
        event.clientX > rect.left - pointerReach &&
        event.clientX < rect.right + pointerReach &&
        event.clientY > rect.top - pointerReach &&
        event.clientY < rect.bottom + pointerReach;

      renderer.setPointer(
        near
          ? {
              x: (event.clientX - rect.left) / rect.width,
              y: (event.clientY - rect.top) / rect.height,
            }
          : null,
      );
    }

    function leave() {
      renderer?.setPointer(null);
    }

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      renderer?.destroy();
    };
  }
</script>

<div
  aria-hidden="true"
  class="shader-surface"
  data-artwork={scene}
  data-shader-status="static"
>
  <canvas {@attach surface} class="shader-canvas"></canvas>
</div>
