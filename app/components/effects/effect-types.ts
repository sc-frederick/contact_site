/** Procedural visual identities used by the project cards. */
export type ProjectPattern = "network" | "flow" | "scan" | "grid" | "orbits" | "wave";

/** A canvas recipe; portrait recipes require a local image source. */
export type EffectArtwork =
  | { readonly kind: "portrait"; readonly imageUrl: string }
  | { readonly kind: "field" | "draft" | "signal" }
  | { readonly kind: "project"; readonly pattern: ProjectPattern; readonly seed: number };

/** Parameters shared by the lazy GPU renderer and its host. */
export interface ShaderSceneProps {
  readonly artwork: EffectArtwork;
  readonly onReady: () => void;
  readonly onUnavailable: () => void;
}
