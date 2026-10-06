import { createContext } from 'svelte';

/** Motion settings scoped to one rendered application, including browser visibility. */
export class MotionPreferences {
  /** Whether browser preferences have been read after hydration. */
  ready = $state(false);
  /** Whether the visitor prefers reduced motion. */
  reducedMotion = $state(false);
  /** Whether the device supports a hover-capable fine pointer. */
  finePointer = $state(false);
  /** Whether the page is currently visible. */
  visible = $state(true);
  /** Whether the visitor paused motion for this visit. */
  paused = $state(false);
  /** Whether decorative animation may run. */
  motionAllowed = $derived(
    this.ready && this.visible && !this.reducedMotion && !this.paused,
  );
}

/** Read the motion settings supplied by the application layout. */
export const [getMotion, setMotion] = createContext<MotionPreferences>();
