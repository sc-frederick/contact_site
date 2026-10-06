import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { PortraitDither } from "./portrait-dither";
import { useMotionPreferences } from "./motion-provider";

/** Reveal the accessible photo through a dithered print that is present before hydration. */
export function PortraitReveal({ src, alt }: { readonly src: string; readonly alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { motionAllowed, finePointer } = useMotionPreferences();
  const [inside, setInside] = useState(false);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!motionAllowed || !finePointer || event.pointerType === "touch") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--reveal-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--reveal-y", `${event.clientY - rect.top}px`);
    setInside(true);
  }
  return (
    <div ref={ref} className="portrait-reveal" data-reveal={inside && motionAllowed && finePointer} onPointerMove={move} onPointerLeave={() => setInside(false)}>
      <img src={src} alt={alt} fetchPriority="high" className="h-full w-full object-cover" />
      <PortraitDither src={src} />
      {motionAllowed && finePointer && <span className="portrait-hint">Move to reveal</span>}
    </div>
  );
}
