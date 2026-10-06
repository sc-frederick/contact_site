import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Pause, Play } from "lucide-react";

interface MotionPreferences {
  readonly ready: boolean;
  readonly motionAllowed: boolean;
  readonly finePointer: boolean;
  readonly reducedMotion: boolean;
  readonly paused: boolean;
  readonly togglePaused: () => void;
}

const MotionContext = createContext<MotionPreferences>({
  ready: false,
  motionAllowed: false,
  finePointer: false,
  reducedMotion: false,
  paused: false,
  togglePaused: () => {},
});

/** Share motion preferences, hydration readiness, and document visibility across effects. */
export function MotionProvider({ children }: { readonly children: ReactNode }) {
  const [preferences, setPreferences] = useState({
    ready: false, reducedMotion: false, finePointer: false, visible: true,
  });
  const [paused, setPaused] = useState(false);
  const motionAllowed = preferences.ready && preferences.visible && !preferences.reducedMotion && !paused;

  useEffect(() => {
    document.documentElement.dataset.motion = motionAllowed ? "on" : "off";
    return () => { delete document.documentElement.dataset.motion; };
  }, [motionAllowed]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    function sync() {
      setPreferences({
        ready: true,
        reducedMotion: reduced.matches,
        finePointer: pointer.matches,
        visible: document.visibilityState === "visible",
      });
    }
    sync();
    reduced.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <MotionContext.Provider value={{
      ...preferences,
      paused,
      motionAllowed,
      togglePaused: () => setPaused((value) => !value),
    }}>
      {children}
    </MotionContext.Provider>
  );
}

/** Read the visitor's motion and pointer preferences without browser access during SSR. */
export function useMotionPreferences() {
  return useContext(MotionContext);
}

/** Give visitors a keyboard-accessible way to pause decorative motion for this visit. */
export function MotionControl() {
  const { ready, paused, reducedMotion, togglePaused } = useMotionPreferences();
  if (!ready) return null;
  if (reducedMotion) return <span className="motion-control mp-meta">Reduced motion</span>;
  const Icon = paused ? Play : Pause;
  return (
    <button className="motion-control" type="button" onClick={togglePaused} aria-pressed={paused}>
      <Icon size={12} aria-hidden="true" />
      {paused ? "Resume motion" : "Pause motion"}
    </button>
  );
}
