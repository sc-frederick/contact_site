import { CustomShader, Dither, ImageTexture, Shader } from "shaders/react";
import { DraftingGrid, InkField, ProjectDrawing, SignalRings } from "./print-shaders";
import type { ProjectPattern, ShaderSceneProps } from "./effect-types";

const motifs: Readonly<Record<ProjectPattern, number>> = { network: 0, flow: 1, scan: 2, grid: 3, orbits: 4, wave: 5 };

/** Render the site's print recipes through the library's WebGPU renderer. */
export function ShaderScene({ artwork, onReady, onUnavailable }: ShaderSceneProps) {
  return (
    <Shader className="shader-canvas" colorSpace="srgb" disableTelemetry onReady={onReady} onUnavailable={onUnavailable}>
      {artwork.kind === "portrait" && (
        <Dither pattern="bayer8" pixelSize={2} threshold={0.43} colorA="#101010" colorB="#f2ead8">
          <ImageTexture url={artwork.imageUrl} objectFit="cover" />
        </Dither>
      )}
      {artwork.kind === "field" && (
        <Dither pattern="bayer4" pixelSize={3} colorMode="source" threshold={0.48}>
          <CustomShader src={InkField} />
        </Dither>
      )}
      {artwork.kind === "draft" && <CustomShader src={DraftingGrid} />}
      {artwork.kind === "signal" && (
        <Dither pattern="bayer4" pixelSize={2} colorA="#101010" colorB="#86f46a" threshold={0.32}>
          <CustomShader src={SignalRings} />
        </Dither>
      )}
      {artwork.kind === "project" && (
        <CustomShader src={ProjectDrawing} motif={motifs[artwork.pattern]} seed={artwork.seed} />
      )}
    </Shader>
  );
}
