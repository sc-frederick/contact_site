import { useId } from "react";
import { ShaderSurface } from "./shader-surface";
import type { ProjectPattern } from "./effect-types";

/** Static, deterministic project illustrations stay visible before and without WebGPU. */
export function ProjectArtwork({ pattern, seed, active }: {
  readonly pattern: ProjectPattern;
  readonly seed: number;
  readonly active: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const wave = Array.from({ length: 61 }, (_, i) => `${i === 0 ? "M" : "L"}${i * 7} ${75 + Math.sin(i * 0.22 + seed) * 26}`).join(" ");
  return (
    <div className={`project-art project-art--${pattern}`} aria-hidden="true">
      <svg viewBox="0 0 420 150" preserveAspectRatio="xMidYMid slice" className="print-artwork">
        <defs>
          <linearGradient id={`${id}-ink`}><stop stopColor="#3a26c7" /><stop offset="1" stopColor="#4cb234" /></linearGradient>
          <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="0.7" fill="#5b3fff" opacity="0.22" /></pattern>
        </defs>
        <rect width="420" height="150" fill="#f2ead8" />
        <rect width="420" height="150" fill={`url(#${id}-dots)`} />
        <g fill="none" stroke={`url(#${id}-ink)`} strokeWidth="1.5">
          {pattern === "network" && <>
            <path d="M40 98L106 42L180 83L249 36L326 77L383 46M106 42L116 121L180 83L263 123L326 77M40 98L116 121M249 36L263 123M180 83L326 77" opacity="0.65" />
            {[[40,98],[106,42],[116,121],[180,83],[249,36],[263,123],[326,77],[383,46]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={i === 3 ? 10 : 5} fill="#f2ead8" />)}
            <circle cx="180" cy="83" r="19" strokeDasharray="2 5" className="project-orbit" />
          </>}
          {pattern === "flow" && <>
            <path d="M0 75H75Q105 75 105 45V23M75 75Q105 75 105 105V135M75 75H207Q239 75 239 42V15M207 75Q239 75 239 108V140M207 75H339Q371 75 371 45V25M339 75Q371 75 371 105V137M339 75H420" strokeWidth="2" />
            <path d="M0 75H420" className="project-flow" stroke="#86f46a" strokeWidth="3" strokeDasharray="5 28" />
            {[105,239,371].flatMap((x) => [28,128].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="12" strokeDasharray="2 4" />))}
          </>}
          {pattern === "scan" && <>
            <path d="M51 18H369V133H51ZM68 34H156V88H68ZM177 34H259V61H177ZM282 34H353V116H282ZM177 79H259V116H177ZM68 103H156M68 114H139" opacity="0.75" />
            <path d="M34 65H387" stroke="#86f46a" strokeWidth="3" className="project-scan" />
            <path d="M35 34V13H57M363 13H385V34M35 117V138H57M363 138H385V117" />
          </>}
          {pattern === "grid" && <>
            {Array.from({length: 9},(_,i) => <path key={i} d={`M${i * 48 + 18} 0V150M0 ${i * 24 + 3}H420`} opacity="0.25" strokeWidth="0.7" />)}
            <circle cx="262" cy="75" r="47" /><circle cx="262" cy="75" r="33" strokeDasharray="3 5" />
            <path d="M38 123L173 29L310 111M173 29V124M38 123H347M262 10V140M197 75H330" />
            <path d="M157 123V108H173" />
          </>}
          {pattern === "orbits" && <>
            <g className="project-orbit"><ellipse cx="210" cy="75" rx="130" ry="36" transform="rotate(18 210 75)" /><ellipse cx="210" cy="75" rx="130" ry="36" transform="rotate(-18 210 75)" /><circle cx="210" cy="75" r="43" /><circle cx="333" cy="114" r="5" fill="#86f46a" /></g>
            <circle cx="210" cy="75" r="7" fill="#5b3fff" />
          </>}
          {pattern === "wave" && <>
            <path d={wave} strokeWidth="2" />
            <path d={wave} transform="translate(0 -15)" opacity="0.25" /><path d={wave} transform="translate(0 15)" opacity="0.25" />
            {Array.from({length: 30},(_,i) => <path key={i} d={`M${i * 14 + 7} ${75 - Math.abs(Math.sin(i * 0.33 + seed)) * 40}V${75 + Math.abs(Math.sin(i * 0.33 + seed)) * 40}`} opacity="0.15" />)}
          </>}
        </g>
      </svg>
      <ShaderSurface artwork={{ kind: "project", pattern, seed }} active={active} />
    </div>
  );
}

/** The portfolio's dithered ink field, with a printed contour fallback. */
export function InkArtwork({ className = "" }: { readonly className?: string }) {
  return (
    <div className={`ink-artwork ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className="print-artwork">
        <rect width="600" height="200" fill="#5b3fff" />
        {Array.from({length: 12},(_,i) => <path key={i} d={`M-40 ${i * 23 - 110}C180 ${i * 14 + 20} 200 ${i * 35 - 50} 390 ${i * 17 + 10}S540 ${i * 22 + 50} 670 ${i * 19 + 10}`} fill="none" stroke="#86f46a" strokeWidth={i % 3 === 0 ? 10 : 2} opacity={0.3 + (i % 3) * 0.2} />)}
      </svg>
      <ShaderSurface artwork={{ kind: "field" }} />
    </div>
  );
}

/** An engineering drawing in the résumé header, enhanced with a responsive dot grid. */
export function DraftArtwork() {
  const id = useId().replaceAll(":", "");
  return (
    <div className="draft-artwork" aria-hidden="true">
      <svg viewBox="0 0 360 180" className="print-artwork">
        <defs><pattern id={`${id}-grid`} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="0.7" fill="#5b3fff" opacity="0.5" /></pattern></defs>
        <rect width="360" height="180" fill={`url(#${id}-grid)`} />
        <g stroke="#5b3fff" fill="none"><circle cx="210" cy="90" r="52" opacity="0.65" /><path d="M210 5V175M95 90H325M119 24H302V156H119Z" opacity="0.25" strokeWidth="0.75" /><path d="M162 144L262 40" opacity="0.6" /><path d="M195 90H225M210 75V105" /></g>
      </svg>
      <ShaderSurface artwork={{ kind: "draft" }} />
    </div>
  );
}

/** Printed signal rings include a one-time outgoing ripple after a confirmed submission. */
export function SignalArtwork({ sent, motionAllowed }: { readonly sent: boolean; readonly motionAllowed: boolean }) {
  return (
    <div className="signal-artwork" data-sent={sent} data-motion={motionAllowed} aria-hidden="true">
      <svg viewBox="0 0 420 240" className="print-artwork">
        <g fill="none" stroke="#86f46a">{[18,42,68,96,126,158,192].map((r,i) => <circle key={r} cx="210" cy="170" r={r} opacity={0.6 - i * 0.07} strokeDasharray="1 5" strokeWidth="2" />)}</g>
      </svg>
      <ShaderSurface artwork={{ kind: "signal" }} />
      <span className="signal-outgoing" />
    </div>
  );
}
