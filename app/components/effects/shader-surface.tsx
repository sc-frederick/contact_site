import { Component, useEffect, useRef, useState } from "react";
import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { cn } from "~/lib/utils";
import { useMotionPreferences } from "./motion-provider";
import type { EffectArtwork, ShaderSceneProps } from "./effect-types";

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

/** Prepare nearby artwork and let the renderer suspend its own offscreen canvas. */
export function ShaderSurface({ artwork, className, active = true }: ShaderSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { motionAllowed } = useMotionPreferences();
  const [nearView, setNearView] = useState(false);
  const [Scene, setScene] = useState<ComponentType<ShaderSceneProps> | null>(null);
  const [status, setStatus] = useState<ShaderStatus>("loading");
  const enabled = motionAllowed && nearView && active && status !== "unavailable";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("gpu" in navigator) || navigator.gpu == null) {
      setStatus("unavailable");
      return;
    }
    // Check synchronously so visible artwork doesn't wait for an observer delivery.
    const rect = element.getBoundingClientRect();
    if (rect.bottom >= -240 && rect.top <= window.innerHeight + 240) {
      setNearView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setNearView(true);
      observer.disconnect();
    }, { rootMargin: "240px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!motionAllowed || !nearView || status === "unavailable" || Scene) return;
    let cancelled = false;
    // An explicit import avoids Suspense's fallback reveal delay. Warm the module
    // for nearby project cards even before hover/focus activates their canvas.
    void import("./shader-scenes").then((module) => {
      if (!cancelled) setScene(() => module.ShaderScene);
    }, (cause: unknown) => {
      if (cancelled) return;
      console.warn("Decorative shader unavailable", {
        _tag: "ShaderModuleUnavailable",
        message: cause instanceof Error ? cause.message : "Shader module could not load",
      });
      setStatus("unavailable");
    });
    return () => { cancelled = true; };
  }, [motionAllowed, nearView, status, Scene]);

  useEffect(() => {
    if (!enabled && status === "ready") setStatus("loading");
  }, [enabled, status]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("shader-surface", className)} data-artwork={artwork.kind} data-shader-status={status === "unavailable" ? "unavailable" : enabled ? status : "static"}>
      {enabled && Scene && (
        <ShaderBoundary onUnavailable={() => setStatus("unavailable")}>
          <Scene artwork={artwork} onReady={() => setStatus("ready")} onUnavailable={() => setStatus("unavailable")} />
        </ShaderBoundary>
      )}
    </div>
  );
}
