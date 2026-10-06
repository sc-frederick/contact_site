import { useEffect, useRef } from "react";
import { useMotionPreferences } from "./motion-provider";

interface TrailPoint {
  readonly x: number;
  readonly y: number;
  readonly born: number;
}

/** Draw a short pixel wake only in page margins; run the small 2D loop only while it fades. */
export function PixelTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { motionAllowed, finePointer } = useMotionPreferences();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !motionAllowed || !finePointer) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let points: TrailPoint[] = [];
    let frame = 0;
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      points = [];
    }
    function draw(now: number) {
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      points = points.filter((point) => now - point.born < 450);
      for (const [i, point] of points.entries()) {
        const life = 1 - (now - point.born) / 450;
        context.globalAlpha = life * 0.55;
        context.fillStyle = i % 4 === 0 ? "#5b3fff" : "#5a5345";
        const size = life > 0.5 ? 3 : 2;
        context.fillRect(Math.round(point.x / 4) * 4, Math.round(point.y / 4) * 4, size, size);
      }
      frame = points.length ? window.requestAnimationFrame(draw) : 0;
    }
    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
      if (event.target.closest(".mp-card, .mp-feature-tile, .site-header, footer, button, a, input, textarea, [role='dialog']")) return;
      const last = points.at(-1);
      if (last && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 7) return;
      points.push({ x: event.clientX, y: event.clientY, born: performance.now() });
      if (points.length > 64) points.shift();
      if (!frame) frame = window.requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [motionAllowed, finePointer]);
  return <canvas ref={canvasRef} className="pixel-trail" aria-hidden="true" />;
}
