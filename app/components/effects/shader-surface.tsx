import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { cn } from "~/lib/utils";
import { useMotionPreferences } from "./motion-provider";
import type { EffectArtwork } from "./effect-types";

const LazyShaderScene = lazy(() => import("./shader-scenes").then((module) => ({ default: module.ShaderScene })));

type ShaderStatus = "loading" | "ready" | "unavailable";

class ShaderBoundary extends Component<{
  readonly children: ReactNode;
  readonly onUnavailable: () => void;
}, { readonly failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Decorative shader unavailable", {
      _tag: "ShaderRenderUnavailable", message: error.message, component: info.componentStack,
    });
    this.props.onUnavailable();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface ShaderSurfaceProps {
  readonly artwork: EffectArtwork;
  readonly className?: string;
  readonly active?: boolean;
}

/** Lazily enhance a static artwork with a GPU canvas while visible and motion is allowed. */
export function ShaderSurface({ artwork, className, active = true }: ShaderSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { motionAllowed } = useMotionPreferences();
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<ShaderStatus>("loading");
  const enabled = motionAllowed && inView && active && status !== "unavailable";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("gpu" in navigator) || navigator.gpu == null) {
      setStatus("unavailable");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled && status === "ready") setStatus("loading");
  }, [enabled, status]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("shader-surface", className)} data-artwork={artwork.kind} data-shader-status={status === "unavailable" ? "unavailable" : enabled ? status : "static"}>
      {enabled && (
        <ShaderBoundary onUnavailable={() => setStatus("unavailable")}>
          <Suspense fallback={null}>
            <LazyShaderScene artwork={artwork} onReady={() => setStatus("ready")} onUnavailable={() => setStatus("unavailable")} />
          </Suspense>
        </ShaderBoundary>
      )}
    </div>
  );
}
